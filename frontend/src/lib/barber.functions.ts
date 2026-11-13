import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  IP_BOOKING_LIMIT,
  IP_LIMIT_MESSAGE,
  IP_LIMIT_WINDOW_MS,
  LimitError,
  RuleError,
  checkPhoneLimit,
  checkSlot,
  prepareAdminSave,
  validateState,
  type Booking,
} from "./barber-rules";

type Row = { data: Booking };

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const STALE_STATE =
  "Os dados foram alterados em outra aba ou aparelho. A tela foi atualizada: confira e refaça a alteração.";

async function loadAll() {
  const sb = await admin();
  const [{ data: st, error: e1 }, { data: bk, error: e2 }] = await Promise.all([
    sb.from("app_state").select("*").eq("id", 1).single(),
    sb.from("bookings").select("data"),
  ]);
  if (e1 || e2 || !st) throw new Error("Erro ao carregar dados.");
  return {
    /** Versão do estado (updated_at): a gestão a devolve ao salvar (controle otimista). */
    version: String(st.updated_at),
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
  const { version: _version, ...db } = await loadAll();
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

/**
 * Identificador da conexão para o limite por IP: HMAC do IP com a chave do servidor, para
 * não guardar o IP em texto. Na Vercel o IP vem de `x-real-ip`/`x-forwarded-for`,
 * preenchidos pela própria plataforma.
 */
async function clientKey(): Promise<string | null> {
  const ip = (getRequestHeader("x-real-ip") || getRequestIP({ xForwardedFor: true }) || "")
    .split(",")[0]!
    .trim();
  const secret = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!ip || !secret) return null;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(ip)));
  return Array.from(sig, (x) => x.toString(16).padStart(2, "0")).join("");
}

/**
 * Limite por IP (tabela `booking_rate_limits`, só acessível pelo servidor). Se a tabela
 * ainda não existir (migração 0002 pendente), o limite é ignorado e a reserva segue.
 */
// A tabela não está nos tipos gerados do Supabase; o cliente sem tipos aceita o nome dela.
const limitsDb = async () => (await admin()) as unknown as SupabaseClient;
const rateLimits = {
  async exceeded(ipKey: string) {
    const since = new Date(Date.now() - IP_LIMIT_WINDOW_MS).toISOString();
    const { count, error } = await (
      await limitsDb()
    )
      .from("booking_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipKey)
      .gte("created_at", since);
    if (error) {
      console.warn("[BarberFlow] Limite por IP indisponível:", error.message);
      return false;
    }
    return (count ?? 0) >= IP_BOOKING_LIMIT;
  },
  async record(ipKey: string) {
    const sb = await limitsDb();
    const old = new Date(Date.now() - IP_LIMIT_WINDOW_MS).toISOString();
    await sb.from("booking_rate_limits").delete().lt("created_at", old);
    const { error } = await sb.from("booking_rate_limits").insert({ ip_hash: ipKey });
    if (error) console.warn("[BarberFlow] Limite por IP não registrado:", error.message);
  },
};

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
    const ipKey = await clientKey();
    if (ipKey && (await rateLimits.exceeded(ipKey)))
      return { error: IP_LIMIT_MESSAGE, limit: true, reason: "ip" };
    try {
      const db = await loadAll();
      checkPhoneLimit(ph, db.bookings);
      checkSlot(b, db);
    } catch (e) {
      if (e instanceof LimitError) return { error: e.message, limit: true, reason: e.reason };
      if (e instanceof RuleError) return { error: e.message };
      throw e;
    }
    const { error } = await (await admin()).from("bookings").insert(rowOf(b));
    if (error) return { error: "Não foi possível salvar o agendamento." };
    if (ipKey) await rateLimits.record(ipKey);
    return { booking: b };
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
    if (next?.version !== undefined && typeof next.version !== "string")
      return { error: "Versão inválida." };
    let plan: ReturnType<typeof prepareAdminSave>;
    try {
      validateState(next);
      // Integridade, exclusões explícitas e regras de agendamento (ver barber-rules.ts).
      plan = prepareAdminSave(await loadAll(), next);
    } catch (e) {
      if (e instanceof RuleError) return { error: e.message };
      throw e;
    }
    const sb = context.supabase;
    // Controle de versão otimista: com `version` (lida pela tela), o UPDATE só atinge a linha se
    // ninguém gravou depois. Nenhuma linha atualizada = aba/aparelho desatualizado: nada é gravado.
    let version = new Date().toISOString();
    if (version === next.version) version = new Date(Date.now() + 1).toISOString();
    let query = sb
      .from("app_state")
      .update({
        shop: next.shop,
        services: next.services,
        staff: next.staff,
        notices: next.notices,
        payments: next.payments ?? [],
        updated_at: version,
      })
      .eq("id", 1);
    if (next.version !== undefined) query = query.eq("updated_at", next.version);
    const { data: updated, error: e1 } = await query.select("updated_at");
    if (e1) return { error: "Erro ao salvar." };
    if (!updated?.length) return { error: STALE_STATE, conflict: true };
    version = String(updated[0]!.updated_at);
    // Só os agendamentos enviados são gravados; os ausentes do envio são preservados.
    const deleted = new Set(plan.deletions);
    const rows = (next.bookings as Booking[]).filter((b) => !deleted.has(b.id)).map(rowOf);
    if (rows.length) {
      const { error } = await sb.from("bookings").upsert(rows);
      if (error) return { error: "Erro ao salvar agendamentos." };
    }
    // Exclusão definitiva apenas do que foi pedido explicitamente (e validado).
    if (plan.deletions.length) {
      const { error } = await sb.from("bookings").delete().in("id", plan.deletions);
      if (error) return { error: "Erro ao excluir agendamentos." };
    }
    return { ok: true, version };
  });
