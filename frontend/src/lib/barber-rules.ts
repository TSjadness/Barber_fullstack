// Booking rules ported from the original backend (checkSlot / validateState).
export type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  active: boolean;
};
export type Staff = {
  id: string;
  name: string;
  start: string;
  end: string;
  days: number[];
  active: boolean;
  weekly?: Record<string, { mode: string; start?: string; end?: string }>;
};
export type Notice = { id: string; date: string; staffId: string; type: string };
export type Booking = {
  id: string;
  date: string;
  time: string;
  serviceId: string;
  serviceIds?: string[] | undefined;
  staffId: string;
  status: string;
  [k: string]: any;
};

export class RuleError extends Error {}
const fail = (m: string): never => {
  throw new RuleError(m);
};
export const mins = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const dayOf = (d: string) => new Date(d + "T12:00:00").getDay();

/** Current date/minutes in the shop's timezone (São Paulo). */
export function shopNow(now = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((x) => [x.type, x.value]),
  );
  return {
    date: `${p["year"]}-${p["month"]}-${p["day"]}`,
    minutes: Number(p["hour"]) * 60 + Number(p["minute"]),
  };
}

/** Service ids of a booking (supports multi-service bookings). */
export const idsOf = (b: Pick<Booking, "serviceId" | "serviceIds">) =>
  Array.isArray(b.serviceIds) && b.serviceIds.length ? b.serviceIds : [b.serviceId];

/** Total duration in minutes of a booking's services (30 if unknown). */
export function durationOf(b: Pick<Booking, "serviceId" | "serviceIds">, services: Service[]) {
  const total = idsOf(b).reduce(
    (a, id) => a + (Number(services.find((s) => s.id === id)?.duration) || 0),
    0,
  );
  return total || 30;
}

export function checkSlot(
  b: Booking,
  db: { services: Service[]; staff: Staff[]; notices: Notice[]; bookings: Booking[] },
  now = shopNow(),
) {
  const ids = idsOf(b);
  const p = db.staff.find((x) => x.id === b.staffId && x.active);
  if (
    !ids.length ||
    ids.length > 6 ||
    new Set(ids).size !== ids.length ||
    !ids.every((id) => db.services.some((x) => x.id === id && x.active)) ||
    !p
  )
    fail("Serviço ou profissional indisponível.");
  const dur = durationOf(b, db.services);
  if (
    !/^\d{4}-\d\d-\d\d$/.test(b.date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(b.time) ||
    Number.isNaN(new Date(b.date + "T12:00:00").getTime())
  )
    fail("Data ou horário inválido.");
  if (b.date < now.date) fail("A data já passou.");
  if (b.date === now.date && mins(b.time) <= now.minutes) fail("Esse horário já passou.");
  checkWorkingSlot(b, p!, dur, db, true);
}

type RulesState = { services: Service[]; staff: Staff[]; notices: Notice[]; bookings: Booking[] };

/**
 * Expediente do dia, bloqueios (da barbearia ou do próprio profissional), limites do
 * horário e conflito com outros atendimentos ativos (ignorando o próprio agendamento).
 * `grid` exige início em passos de 10 minutos (reserva pública).
 */
function checkWorkingSlot(b: Booking, p: Staff, dur: number, db: RulesState, grid: boolean) {
  const wd = dayOf(b.date);
  const sched = p.weekly?.[wd] || {
    mode: p.days.includes(wd) ? "default" : "closed",
    start: p.start,
    end: p.end,
  };
  if (
    sched.mode === "closed" ||
    db.notices.some(
      (n) => n.type === "block" && n.date === b.date && (n.staffId === "all" || n.staffId === p.id),
    )
  )
    fail("Profissional indisponível nessa data.");
  const a = mins(sched.mode === "custom" ? (sched.start ?? p.start) : p.start);
  const z = mins(sched.mode === "custom" ? (sched.end ?? p.end) : p.end);
  const t = mins(b.time);
  if (t < a || t + dur > z || (grid && (t - a) % 10)) fail("Horário fora do expediente.");
  if (
    db.bookings.some(
      (x) =>
        x.status !== "cancelado" &&
        x.id !== b.id &&
        x.staffId === p.id &&
        x.date === b.date &&
        t < mins(x.time) + durationOf(x, db.services) &&
        t + dur > mins(x.time),
    )
  )
    fail("Este horário acabou de ser reservado.");
}

/** Data, horário, profissional e serviços: o que define a vaga ocupada pelo agendamento. */
const slotKey = (b: Booking) => [b.date, b.time, b.staffId, idsOf(b).join("+")].join("|");

/**
 * Valida, na gravação da gestão, os agendamentos novos ou remarcados (data, horário,
 * profissional ou serviços alterados): expediente, bloqueios gerais e do profissional,
 * limites do horário e conflitos. Agendamentos sem alteração de vaga não são revalidados,
 * pois bloqueios criados depois não cancelam reservas existentes. Diferente da reserva
 * pública, a gestão pode lançar horários fora da grade de 10 minutos e horários já
 * passados do dia (registro de atendimento feito).
 */
export function validateBookingChanges(previous: { bookings: Booking[] }, next: RulesState) {
  const before = new Map(previous.bookings.map((b) => [b.id, b]));
  for (const b of next.bookings) {
    if (b.status === "cancelado") continue;
    const old = before.get(b.id);
    if (old && slotKey(old) === slotKey(b)) continue;
    const ids = idsOf(b);
    const p = next.staff.find((x) => x.id === b.staffId);
    if (!p || !ids.length || !ids.every((id) => next.services.some((s) => s.id === id)))
      fail("Serviço ou profissional indisponível.");
    if (!/^\d{4}-\d\d-\d\d$/.test(b.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(b.time))
      fail("Data ou horário inválido.");
    checkWorkingSlot(b, p!, durationOf(b, next.services), next, false);
  }
}

export function validateState(next: any) {
  if (!next || typeof next !== "object") fail("Dados inválidos.");
  for (const k of ["shop", "services", "staff", "bookings", "notices"])
    if (!next[k] || !(k === "shop" ? typeof next[k] === "object" : Array.isArray(next[k])))
      fail("Estrutura inválida: " + k);
  if (
    next.services.length > 200 ||
    next.staff.length > 100 ||
    next.bookings.length > 20000 ||
    next.notices.length > 2000
  )
    fail("Limite de registros excedido.");
  for (const s of next.services)
    if (
      !s.id ||
      typeof s.name !== "string" ||
      s.name.length > 100 ||
      !Number.isFinite(+s.price) ||
      +s.price < 0 ||
      !Number.isFinite(+s.duration) ||
      +s.duration < 10
    )
      fail("Serviço inválido.");
  for (const p of next.staff)
    if (
      !p.id ||
      typeof p.name !== "string" ||
      !Array.isArray(p.days) ||
      !/^\d\d:\d\d$/.test(p.start) ||
      !/^\d\d:\d\d$/.test(p.end) ||
      mins(p.start) >= mins(p.end)
    )
      fail("Profissional inválido.");
  for (const b of next.bookings)
    if (!b.id || !b.serviceId || !b.staffId || !b.date || !b.time) fail("Agendamento inválido.");
}

// ---------------------------------------------------------------------------
// Gravação da gestão: conteúdo, exclusões explícitas e integridade referencial.
// Mesma regra de backend/src/rules.mjs (servidor local).
// ---------------------------------------------------------------------------

const STATUSES = new Set(["pendente", "confirmado", "concluido", "cancelado"]);
const MAX_PHOTO_CHARS = 1_000_000;

/** Foto aceita: data URL de imagem (jpeg/png/webp), caminho do próprio site ou URL https. */
export function isSafePhoto(value: unknown) {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value !== "string" || value.length > MAX_PHOTO_CHARS) return false;
  return (
    /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(value) ||
    /^\/(?!\/)[\w\-./]+$/.test(value) ||
    /^https:\/\/[\w\-.]+(:\d+)?\/[\w\-./%?=&]*$/.test(value)
  );
}

const text = (value: unknown, max: number, required = false) =>
  (value === undefined || value === null ? !required : typeof value === "string") &&
  String(value ?? "").length <= max &&
  (!required || String(value).trim().length > 0);

type Record_ = Record<string, unknown>;
type SaveState = RulesState & { shop: Record_; deletedBookingIds?: unknown };

/** Tipos e tamanhos dos campos editáveis (protege contra dados malformados ou abusivos). */
function validateContent(next: SaveState) {
  const shop = next.shop;
  if (
    !text(shop["name"], 200) ||
    !text(shop["tagline"], 1000) ||
    !text(shop["address"], 2000) ||
    !text(shop["whatsapp"], 40) ||
    !text(shop["phone"], 40) ||
    !text(shop["instagram"], 300) ||
    !text(shop["facebook"], 300)
  )
    fail("Configurações inválidas.");
  for (const p of next.staff as Array<Staff & Record_>)
    if (!text(p.name, 200, true) || !text(p["role"], 200) || !isSafePhoto(p["photo"]))
      fail("Profissional inválido.");
  for (const b of next.bookings)
    if (
      typeof b.id !== "string" ||
      !STATUSES.has(b.status) ||
      !text(b["customer"], 200) ||
      !text(b["phone"], 40) ||
      (b["paid"] !== undefined && typeof b["paid"] !== "boolean")
    )
      fail("Agendamento inválido.");
  for (const n of next.notices as Array<Notice & Record_>)
    if (
      !n.id ||
      !/^\d{4}-\d\d-\d\d$/.test(n.date) ||
      !text(n["title"], 200) ||
      !text(n["detail"], 2000)
    )
      fail("Aviso inválido.");
}

/** Agendamento que faz parte do histórico financeiro (não pode ser excluído). */
const isFinancialRecord = (b: Booking) => b["paid"] === true || b.status === "concluido";

/**
 * Valida a gravação completa da gestão e devolve o que deve ser persistido.
 *
 * - Agendamentos ausentes do envio são PRESERVADOS (uma reserva pública feita enquanto o
 *   painel estava aberto não pode ser apagada por um estado desatualizado). Excluir exige
 *   pedido explícito em `deletedBookingIds`, só para agendamentos sem histórico financeiro.
 * - Serviço usado por algum agendamento não pode ser excluído (o faturamento depende dele).
 * - O proprietário e profissionais com agendamentos futuros ativos não podem ser removidos.
 * - Agendamentos novos ou remarcados respeitam expediente, bloqueios e conflitos.
 */
export function prepareAdminSave(
  previous: RulesState,
  next: SaveState,
  now = shopNow(),
): { bookings: Booking[]; deletions: string[] } {
  validateContent(next);
  const requested = next.deletedBookingIds ?? [];
  if (
    !Array.isArray(requested) ||
    requested.length > 500 ||
    requested.some((id) => typeof id !== "string")
  )
    fail("Exclusão inválida.");
  const byId = new Map(previous.bookings.map((b) => [b.id, b]));
  const deletions = [...new Set(requested as string[])];
  for (const id of deletions) {
    const b = byId.get(id);
    if (!b) fail("Agendamento não encontrado para exclusão.");
    if (isFinancialRecord(b!))
      fail(
        "Agendamentos pagos ou concluídos fazem parte do histórico financeiro e não podem ser excluídos.",
      );
  }
  const sent = new Set(next.bookings.map((b) => b.id));
  const removed = new Set(deletions);
  const kept = previous.bookings.filter((b) => !sent.has(b.id) && !removed.has(b.id));
  const bookings = [...next.bookings.filter((b) => !removed.has(b.id)), ...kept];

  const used = new Set(bookings.flatMap((b) => idsOf(b)));
  for (const s of previous.services)
    if (!next.services.some((x) => x.id === s.id) && used.has(s.id))
      fail(
        "Este serviço possui agendamentos e não pode ser excluído. Desative-o para ocultá-lo do site.",
      );

  for (const p of previous.staff as Array<Staff & Record_>) {
    if (next.staff.some((x) => x.id === p.id)) continue;
    if (p["owner"] === true || p.id === "p1") fail("O cadastro do dono não pode ser removido.");
    if (bookings.some((b) => b.staffId === p.id && b.status !== "cancelado" && b.date >= now.date))
      fail("Este profissional tem agendamentos futuros. Cancele ou transfira antes de remover.");
  }

  validateBookingChanges(previous, { ...next, bookings });
  return { bookings, deletions };
}
