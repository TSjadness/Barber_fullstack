/**
 * Funcionalidade: Agenda e disponibilidade de horários
 *
 * Responsabilidade:
 * Calcular expediente de cada profissional, bloqueios por aviso, horários livres
 * (passos de 10 minutos sem sobreposição), disponibilidade de cada dia no calendário
 * do cliente e a validação dos agendamentos criados ou editados na gestão.
 *
 * Origem:
 * Funcionalidade anteriormente implementada no arquivo public/barber/app.js
 * (staffHours, closed, openSlots, dayAvailability, possibleTimes, manualBooking,
 * saveEditedBooking). Ajuste posterior: bloqueios individuais do profissional passaram
 * a valer também na disponibilidade do dia, na ocupação da agenda e na edição, e a
 * edição considera a duração de todos os serviços do agendamento. A gravação aplica a
 * mesma regra no servidor (validateBookingChanges em src/lib/barber-rules.ts e
 * backend/src/rules.mjs).
 */
import { nowMinutes, toClock, toMinutes, weekdayOf } from "@/utils/date";
import type {
  AppState,
  Booking,
  BookingFlow,
  DayAvailability,
  DaySchedule,
  Service,
  ServiceTotal,
  Staff,
  TimeOption,
} from "@/types/barber";

const SLOT_STEP_MINUTES = 10;
const DEFAULT_BOOKING_MINUTES = 30;

export const findService = (db: AppState, id: string | null | undefined) =>
  db.services.find((x) => x.id === id);

export const findStaff = (db: AppState, id: string | null | undefined) =>
  db.staff.find((x) => x.id === id);

/** Serviços de uma lista de ids (ou de um id único), ignorando os removidos. */
export function serviceList(db: AppState, ids: string | readonly string[] | null | undefined) {
  const list = Array.isArray(ids) ? ids : [ids];
  return list.map((id) => findService(db, id as string)).filter((s): s is Service => Boolean(s));
}

/** Soma nome, duração e preço dos serviços escolhidos; null se nenhum existir. */
export function serviceTotal(
  db: AppState,
  ids: string | readonly string[] | null | undefined,
): ServiceTotal | null {
  const l = serviceList(db, ids);
  return l.length
    ? {
        name: l.map((x) => x.name).join(" + "),
        duration: l.reduce((a, x) => a + Number(x.duration), 0),
        price: l.reduce((a, x) => a + Number(x.price), 0),
      }
    : null;
}

/** Serviços de um agendamento: `serviceIds` quando existir, senão o `serviceId` legado. */
export const bookingServices = (b: Pick<Booking, "serviceId" | "serviceIds">) =>
  b.serviceIds || b.serviceId;

/** Nome exibido no lugar do cliente excluído (anonimizado). */
export const ANONYMIZED_CUSTOMER = "Cliente removido";

/** Chave que agrupa os agendamentos de um mesmo cliente (nome, sem diferenciar maiúsculas). */
export const clientKey = (customer: string) => customer.trim().toLowerCase();

/**
 * Pagos ou concluídos fazem parte do histórico financeiro: podem ser cancelados ou
 * editados, mas não excluídos (mesma regra de `isFinancialRecord` no servidor).
 */
export const isFinancialRecord = (b: Pick<Booking, "paid" | "status">) =>
  b.paid === true || b.status === "concluido";

/** Ids dos serviços do agendamento sempre como lista (mesma regra de `idsOf` no servidor). */
export const serviceIdsOf = (b: Pick<Booking, "serviceId" | "serviceIds">): string[] =>
  Array.isArray(b.serviceIds) && b.serviceIds.length ? b.serviceIds : [b.serviceId];

export const bookingTotal = (db: AppState, b: Booking) => serviceTotal(db, bookingServices(b));

export const bookingDuration = (db: AppState, b: Booking) =>
  bookingTotal(db, b)?.duration || DEFAULT_BOOKING_MINUTES;

export const bookingPrice = (db: AppState, b: Booking) => bookingTotal(db, b)?.price || 0;

export const activeBookings = (db: AppState) => db.bookings.filter((b) => b.status !== "cancelado");

/** Bloqueio na data para o profissional (ou para a barbearia inteira). */
export const isBlocked = (db: AppState, date: string, staffId: string) =>
  db.notices.some(
    (n) => n.type === "block" && n.date === date && (n.staffId === "all" || n.staffId === staffId),
  );

/** Mensagem exibida quando a gestão tenta usar um dia bloqueado para o profissional. */
export const BLOCKED_MESSAGE = "O profissional está bloqueado nesta data.";

/** Expediente do profissional no dia: ajuste semanal ou o horário padrão. */
export function staffHours(employee: Staff, date: string): DaySchedule {
  return daySchedule(employee, weekdayOf(date));
}

/** Início e fim efetivos do expediente (o horário personalizado substitui o padrão). */
export function workingWindow(employee: Staff, date: string) {
  const h = staffHours(employee, date);
  const custom = h.mode === "custom";
  return {
    mode: h.mode,
    start: (custom ? h.start : employee.start) ?? employee.start,
    end: (custom ? h.end : employee.end) ?? employee.end,
  };
}

/** Conflito com outro atendimento ativo do mesmo profissional. */
function overlaps(
  db: AppState,
  date: string,
  staffId: string,
  start: number,
  duration: number,
  ignoreId?: string,
) {
  return db.bookings.some(
    (b) =>
      b.id !== ignoreId &&
      b.date === date &&
      b.staffId === staffId &&
      b.status !== "cancelado" &&
      start < toMinutes(b.time) + bookingDuration(db, b) &&
      start + duration > toMinutes(b.time),
  );
}

/** Horários livres do profissional no dia para os serviços informados. */
export function openSlots(
  db: AppState,
  date: string,
  staffId: string | null,
  services: string | readonly string[] | null | undefined,
): string[] {
  const employee = findStaff(db, staffId);
  const total = serviceTotal(db, services);
  if (!employee || !total || !employee.active) return [];
  const window = workingWindow(employee, date);
  if (window.mode === "closed" || isBlocked(db, date, employee.id)) return [];
  const output: string[] = [];
  for (
    let m = toMinutes(window.start);
    m + total.duration <= toMinutes(window.end);
    m += SLOT_STEP_MINUTES
  ) {
    if (!overlaps(db, date, employee.id, m, total.duration)) output.push(toClock(m));
  }
  return output;
}

/** Remove horários que já passaram quando a data é hoje. */
const upcoming = (date: string, today: string) => (t: string) =>
  date !== today || toMinutes(t) > nowMinutes();

/** Situação do dia no calendário do cliente (livre, poucas vagas, lotado, fechado). */
export function dayAvailability(
  db: AppState,
  flow: Pick<BookingFlow, "staffId" | "serviceIds">,
  date: string,
  today: string,
): DayAvailability {
  const active = db.staff.filter(
    (p) => p.active && (flow.staffId === "any" || p.id === flow.staffId),
  );
  const working = active.filter(
    (p) => staffHours(p, date).mode !== "closed" && !isBlocked(db, date, p.id),
  );
  if (!working.length) return { code: "closed", label: "Fechado" };
  const slots = working.map((p) => openSlots(db, date, p.id, flow.serviceIds));
  const total = slots.reduce((a, list) => a + list.length, 0);
  const available = slots.reduce((a, list) => a + list.filter(upcoming(date, today)).length, 0);
  if (!available) return { code: "full", label: "Lotado" };
  if (available <= Math.max(3, Math.floor(total * 0.28)))
    return { code: "partial", label: "Poucas vagas" };
  return { code: "available", label: "Livre" };
}

/** Horários possíveis do dia, com o profissional que atende cada um. */
export function possibleTimes(
  db: AppState,
  flow: Pick<BookingFlow, "staffId" | "serviceIds">,
  date: string,
  today: string,
): TimeOption[] {
  const ids =
    flow.staffId === "any" ? db.staff.filter((x) => x.active).map((x) => x.id) : [flow.staffId];
  return ids
    .flatMap((id) =>
      openSlots(db, date, id, flow.serviceIds)
        .filter(upcoming(date, today))
        .map((time) => ({ time, staffId: id ?? "" })),
    )
    .sort((a, b) => a.time.localeCompare(b.time));
}

export type PeriodName = "Manhã" | "Tarde" | "Noite";

/** Agrupa horários em manhã (<12h), tarde (12h-18h) e noite (>=18h), omitindo grupos vazios. */
export function groupByPeriod(slots: TimeOption[]) {
  const groups: Array<{ name: PeriodName; test: (m: number) => boolean }> = [
    { name: "Manhã", test: (m) => m < 12 * 60 },
    { name: "Tarde", test: (m) => m >= 12 * 60 && m < 18 * 60 },
    { name: "Noite", test: (m) => m >= 18 * 60 },
  ];
  return groups
    .map((g) => ({ name: g.name, slots: slots.filter((s) => g.test(toMinutes(s.time))) }))
    .filter((g) => g.slots.length);
}

/**
 * Valida a edição de um agendamento pela gestão. Retorna a mensagem de erro
 * exibida ao usuário ou null quando a alteração pode ser salva.
 */
export function validateEditedBooking(
  db: AppState,
  updated: Booking,
  today: string,
): string | null {
  if (updated.customer.length < 3) return "Informe o nome do cliente";
  if (updated.date < today) return "Selecione uma data válida";
  const p = findStaff(db, updated.staffId);
  if (!p || !serviceList(db, bookingServices(updated)).length)
    return "Profissional ou serviço inválido";
  if (isBlocked(db, updated.date, p.id)) return BLOCKED_MESSAGE;
  // Duração real do atendimento (todos os serviços do agendamento).
  const duration = bookingDuration(db, updated);
  const a = toMinutes(updated.time);
  const window = workingWindow(p, updated.date);
  if (
    window.mode === "closed" ||
    a < toMinutes(window.start) ||
    a + duration > toMinutes(window.end)
  )
    return "Horário fora do expediente ou bloqueado";
  // O próprio agendamento é ignorado: editar sem mudar o horário não é conflito.
  if (overlaps(db, updated.date, updated.staffId, a, duration, updated.id))
    return "Existe outro atendimento nesse horário";
  return null;
}

/**
 * Valida o agendamento manual da gestão. Retorna a mensagem de erro ou null.
 * O horário precisa ser um dos horários livres (grade de 10 minutos, expediente,
 * bloqueios e conflitos).
 */
export function validateManualBooking(db: AppState, booking: Booking): string | null {
  if (booking.customer && isBlocked(db, booking.date, booking.staffId)) return BLOCKED_MESSAGE;
  if (
    !booking.customer ||
    !openSlots(db, booking.date, booking.staffId, booking.serviceId).includes(booking.time)
  )
    return "Horário inválido ou indisponível. Use intervalos de 10 minutos.";
  return null;
}

/**
 * Capacidade estimada em blocos de 30 minutos (usada na ocupação da agenda).
 * Profissionais fechados ou bloqueados na data (bloqueio geral ou individual) não contam.
 */
export function halfHourCapacity(db: AppState, employees: Staff[], date: string) {
  return employees.reduce((n, p) => {
    const w = workingWindow(p, date);
    if (w.mode === "closed" || isBlocked(db, date, p.id)) return n;
    return n + Math.max(0, Math.floor((toMinutes(w.end) - toMinutes(w.start)) / 30));
  }, 0);
}

/** O cadastro do proprietário não pode ser removido. */
export const isOwnerStaff = (p: Staff | undefined) => !!p && (!!p.owner || p.id === "p1");

/** Configuração do dia da semana: ajuste salvo ou o padrão (aberto se o dia está em `days`). */
export const daySchedule = (p: Staff, day: number): DaySchedule =>
  p.weekly?.[String(day)] || {
    mode: p.days.includes(day) ? "default" : "closed",
    start: p.start,
    end: p.end,
  };

/**
 * Altera um dia da semana do profissional (modo, início ou fim) e recalcula os dias
 * de atendimento. Retorna a mensagem de erro quando o horário personalizado é inválido.
 */
export function updateWeekDay(p: Staff, day: number, patch: Partial<DaySchedule>): string | null {
  const next = { ...daySchedule(p, day), ...patch };
  if (next.mode === "custom" && toMinutes(next.start ?? "") >= toMinutes(next.end ?? ""))
    return "O horário final deve ser depois do inicial.";
  const previousDays = p.days;
  p.weekly = { ...(p.weekly || {}), [String(day)]: next };
  const weekly = p.weekly;
  p.days = [0, 1, 2, 3, 4, 5, 6].filter(
    (i) =>
      (weekly[String(i)]?.mode || (previousDays.includes(i) ? "default" : "closed")) !== "closed",
  );
  return null;
}

/** Expediente padrão de segunda a sábado, domingo fechado. */
export function applyBaseWeek(p: Staff) {
  p.weekly = {};
  for (let i = 0; i < 7; i++)
    p.weekly[String(i)] = { mode: i === 0 ? "closed" : "default", start: p.start, end: p.end };
  p.days = [1, 2, 3, 4, 5, 6];
}
