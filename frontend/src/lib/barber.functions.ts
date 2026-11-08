import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { RuleError, checkSlot, validateState, type Booking } from "./barber-rules";

type Row = { data: Booking };

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function loadAll() {
  const sb = await admin();
  const [{ data: st, error: e1 }, { data: bk, error: e2 }] = await Promise.all([
    sb.from("app_state").select("*").eq("id", 1).single(),
    sb.from("bookings").select("data"),
  ]);
  if (e1 || e2 || !st) throw new Error("Erro ao carregar dados.");
  return {
    shop: st.shop as any,
    services: st.services as any[],
    staff: st.staff as any[],
    notices: st.notices as any[],
    payments: st.payments as any[],
    bookings: ((bk ?? []) as unknown as Row[]).map((r) => r.data),
  };
}

const rowOf = (b: Booking) => ({
  id: b.id,
  date: b.date,
  time: b.time,
  staff_id: b.staffId,
  service_id: b.serviceId,
  status: b.status,
  data: b as any,
});

/** Public catalog + busy slots, without customer names or phones. */
export const getPublicState = createServerFn({ method: "GET" }).handler(async () => {
  const db = await loadAll();
  return {
    ...db,
    payments: [],
    bookings: db.bookings.map((b) => ({
      id: b.id,
      date: b.date,
      time: b.time,
      serviceId: b.serviceId,
      staffId: b.staffId,
      serviceIds: b.serviceIds,
      status: b.status,
    })),
  };
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as Record<string, any>)
  .handler(async ({ data: body }) => {
    const b: Booking = {
      id: crypto.randomUUID(),
      date: String(body["date"] || ""),
      time: String(body["time"] || ""),
      customer: String(body["customer"] || "").trim(),
      phone: String(body["phone"] || "").replace(/[^\d]/g, ""),
      serviceId: String(body["serviceId"] || ""),
      serviceIds: Array.isArray(body["serviceIds"])
        ? body["serviceIds"].slice(0, 6).map((x: unknown) => String(x))
        : undefined,
      staffId: String(body["staffId"] || ""),
      status: "confirmado",
      paid: false,
      paymentMethod: null,
    };
    if (b.serviceIds?.length) b.serviceId = b.serviceIds[0]!;
    else delete b.serviceIds;
    const c = b["customer"] as string,
      ph = b["phone"] as string;
    if (c.length < 3 || c.length > 100 || ph.length < 10 || ph.length > 15)
      return { error: "Nome ou telefone inválido." };
    try {
      checkSlot(b, await loadAll());
    } catch (e) {
      if (e instanceof RuleError) return { error: e.message };
      throw e;
    }
    const { error } = await (await admin()).from("bookings").insert(rowOf(b));
    if (error) return { error: "Não foi possível salvar o agendamento." };
    return { booking: b };
  });

export const ownerExists = createServerFn({ method: "GET" }).handler(async () => {
  const { count } = await (
    await admin()
  )
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "owner");
  return { exists: (count ?? 0) > 0 };
});

async function assertOwner(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "owner" });
  if (!data) throw new Error("Acesso restrito ao proprietário.");
}

export const getAdminState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertOwner(context);
    return loadAll();
  });

export const saveAdminState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: any) => d)
  .handler(async ({ data: next, context }) => {
    await assertOwner(context);
    try {
      validateState(next);
    } catch (e) {
      if (e instanceof RuleError) return { error: e.message };
      throw e;
    }
    const sb = context.supabase;
    const { error: e1 } = await sb
      .from("app_state")
      .update({
        shop: next.shop,
        services: next.services,
        staff: next.staff,
        notices: next.notices,
        payments: next.payments ?? [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (e1) return { error: "Erro ao salvar." };
    const rows = (next.bookings as Booking[]).map(rowOf);
    if (rows.length) {
      const { error } = await sb.from("bookings").upsert(rows);
      if (error) return { error: "Erro ao salvar agendamentos." };
    }
    const { data: existing } = await sb.from("bookings").select("id");
    const keep = new Set(rows.map((r) => r.id));
    const gone = (existing ?? [])
      .map((r: { id: string }) => r.id)
      .filter((id: string) => !keep.has(id));
    if (gone.length) await sb.from("bookings").delete().in("id", gone);
    return { ok: true };
  });
