import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyBaseWeek,
  dayAvailability,
  openSlots,
  possibleTimes,
  serviceTotal,
  updateWeekDay,
  validateEditedBooking,
  validateManualBooking,
  groupByPeriod,
  halfHourCapacity,
  BLOCKED_MESSAGE,
} from "@/scripts/scheduling";
import type { AppState, Booking, Notice, Staff } from "@/types/barber";

// Quarta-feira, 11/11/2026, 08:00 (antes do expediente: todos os horários do dia ainda valem).
const TODAY = "2026-11-11";
const WED = "2026-11-11";
const SUN = "2026-11-15";

const staff = (patch: Partial<Staff> = {}): Staff => ({
  id: "p1",
  name: "Rafael Úzeda",
  role: "Barbeiro",
  start: "09:00",
  end: "11:00",
  days: [1, 2, 3, 4, 5, 6],
  active: true,
  ...patch,
});

const booking = (patch: Partial<Booking> = {}): Booking => ({
  id: "b1",
  date: WED,
  time: "09:00",
  customer: "João Silva",
  phone: "79999990000",
  serviceId: "s1",
  staffId: "p1",
  status: "confirmado",
  paid: false,
  paymentMethod: null,
  ...patch,
});

const state = (patch: Partial<AppState> = {}): AppState => ({
  shop: { name: "Barbearia", tagline: "", whatsapp: "", address: "" },
  services: [
    { id: "s1", name: "Corte", duration: 30, price: 40, active: true },
    { id: "s2", name: "Barba", duration: 30, price: 30, active: true },
  ],
  staff: [staff()],
  notices: [],
  payments: [],
  bookings: [],
  ...patch,
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 11, 8, 0));
});
afterEach(() => vi.useRealTimers());

describe("serviceTotal", () => {
  it("soma nome, duração e preço de vários serviços", () => {
    expect(serviceTotal(state(), ["s1", "s2"])).toEqual({
      name: "Corte + Barba",
      duration: 60,
      price: 70,
    });
  });
  it("ignora serviços removidos e retorna null sem nenhum válido", () => {
    expect(serviceTotal(state(), ["x"])).toBeNull();
  });
});

describe("openSlots", () => {
  it("gera horários a cada 10 minutos dentro do expediente", () => {
    const slots = openSlots(state(), WED, "p1", ["s1"]);
    expect(slots[0]).toBe("09:00");
    expect(slots[1]).toBe("09:10");
    expect(slots.at(-1)).toBe("10:30");
  });
  it("remove horários que se sobrepõem a outro atendimento ativo", () => {
    const db = state({ bookings: [booking({ time: "09:30" })] });
    const slots = openSlots(db, WED, "p1", ["s1"]);
    expect(slots).not.toContain("09:10");
    expect(slots).not.toContain("09:50");
    expect(slots).toContain("09:00");
    expect(slots).toContain("10:00");
  });
  it("ignora agendamentos cancelados", () => {
    const db = state({ bookings: [booking({ time: "09:30", status: "cancelado" })] });
    expect(openSlots(db, WED, "p1", ["s1"])).toContain("09:30");
  });
  it("não abre dias fechados, bloqueados ou de profissional inativo", () => {
    expect(openSlots(state(), SUN, "p1", ["s1"])).toEqual([]);
    const blocked = state({
      notices: [{ id: "n", date: WED, staffId: "p1", type: "block", title: "", detail: "" }],
    });
    expect(openSlots(blocked, WED, "p1", ["s1"])).toEqual([]);
    expect(openSlots(state({ staff: [staff({ active: false })] }), WED, "p1", ["s1"])).toEqual([]);
  });
  it("usa o horário personalizado do dia", () => {
    const db = state({
      staff: [staff({ weekly: { "3": { mode: "custom", start: "14:00", end: "15:00" } } })],
    });
    expect(openSlots(db, WED, "p1", ["s1"])).toEqual(["14:00", "14:10", "14:20", "14:30"]);
  });
});

describe("dayAvailability", () => {
  it("classifica livre, poucas vagas, lotado e fechado", () => {
    const flow = { staffId: "p1", serviceIds: ["s1"] };
    expect(dayAvailability(state(), flow, WED, TODAY).code).toBe("available");
    expect(dayAvailability(state(), flow, SUN, TODAY).code).toBe("closed");
    const full = state({
      bookings: [
        booking({ time: "09:00", serviceIds: ["s1", "s2"] }),
        booking({ id: "b2", time: "10:00", serviceIds: ["s1", "s2"] }),
      ],
    });
    expect(dayAvailability(full, flow, WED, TODAY).code).toBe("full");
    const few = state({
      bookings: [
        booking({ time: "09:00", serviceIds: ["s1", "s2"] }),
        booking({ id: "b2", time: "10:30" }),
      ],
    });
    expect(dayAvailability(few, flow, WED, TODAY).code).toBe("partial");
  });
});

describe("possibleTimes", () => {
  it("junta horários de todos os profissionais em 'sem preferência', em ordem", () => {
    const db = state({
      staff: [staff(), staff({ id: "p2", name: "Alê", start: "09:05", end: "10:00" })],
    });
    const times = possibleTimes(db, { staffId: "any", serviceIds: ["s1"] }, WED, TODAY);
    expect(times.slice(0, 2)).toEqual([
      { time: "09:00", staffId: "p1" },
      { time: "09:05", staffId: "p2" },
    ]);
  });
  it("agrupa por manhã, tarde e noite omitindo períodos vazios", () => {
    const groups = groupByPeriod([
      { time: "09:00", staffId: "p1" },
      { time: "18:30", staffId: "p1" },
    ]);
    expect(groups.map((g) => g.name)).toEqual(["Manhã", "Noite"]);
  });
});

describe("validateEditedBooking", () => {
  it("aceita horário livre e recusa conflito, fora do expediente e data passada", () => {
    const db = state({ bookings: [booking(), booking({ id: "b2", time: "10:00" })] });
    expect(validateEditedBooking(db, booking({ time: "09:30" }), TODAY)).toBeNull();
    expect(validateEditedBooking(db, booking({ time: "09:50" }), TODAY)).toBe(
      "Existe outro atendimento nesse horário",
    );
    expect(validateEditedBooking(db, booking({ time: "10:45" }), TODAY)).toBe(
      "Horário fora do expediente ou bloqueado",
    );
    expect(validateEditedBooking(db, booking({ date: "2026-11-10" }), TODAY)).toBe(
      "Selecione uma data válida",
    );
  });
});

describe("expediente semanal", () => {
  it("recusa horário personalizado com fim antes do início", () => {
    const p = staff();
    expect(updateWeekDay(p, 3, { mode: "custom", start: "12:00", end: "11:00" })).toBe(
      "O horário final deve ser depois do inicial.",
    );
    expect(p.weekly).toBeUndefined();
  });
  it("fechar um dia remove-o dos dias de atendimento", () => {
    const p = staff();
    expect(updateWeekDay(p, 3, { mode: "closed" })).toBeNull();
    expect(p.days).toEqual([1, 2, 4, 5, 6]);
  });
  it("aplica o padrão de segunda a sábado com domingo fechado", () => {
    const p = staff({ days: [0, 3] });
    applyBaseWeek(p);
    expect(p.days).toEqual([1, 2, 3, 4, 5, 6]);
    expect(p.weekly?.["0"]?.mode).toBe("closed");
    expect(p.weekly?.["1"]?.mode).toBe("default");
  });
});

describe("bloqueios gerais e por profissional", () => {
  const block = (staffId: string, date = WED): Notice => ({
    id: "n-" + staffId,
    date,
    staffId,
    type: "block",
    title: "Bloqueio",
    detail: "",
  });
  const two = (notices: Notice[], bookings: Booking[] = []) =>
    state({
      staff: [staff(), staff({ id: "p2", name: "Alê" })],
      notices,
      bookings,
    });

  it("bloqueio individual fecha o dia apenas para aquele profissional", () => {
    const db = two([block("p1")]);
    expect(dayAvailability(db, { staffId: "p1", serviceIds: ["s1"] }, WED, TODAY).code).toBe(
      "closed",
    );
    expect(dayAvailability(db, { staffId: "p2", serviceIds: ["s1"] }, WED, TODAY).code).toBe(
      "available",
    );
    expect(openSlots(db, WED, "p1", ["s1"])).toEqual([]);
  });

  it("sem preferência continua oferecendo o profissional não bloqueado", () => {
    const db = two([block("p1")]);
    const flow = { staffId: "any", serviceIds: ["s1"] };
    expect(dayAvailability(db, flow, WED, TODAY).code).toBe("available");
    const staffIds = new Set(possibleTimes(db, flow, WED, TODAY).map((t) => t.staffId));
    expect([...staffIds]).toEqual(["p2"]);
  });

  it("bloqueio geral fecha a barbearia para todos", () => {
    const db = two([block("all")]);
    expect(dayAvailability(db, { staffId: "any", serviceIds: ["s1"] }, WED, TODAY).code).toBe(
      "closed",
    );
    expect(possibleTimes(db, { staffId: "any", serviceIds: ["s1"] }, WED, TODAY)).toEqual([]);
  });

  it("bloqueio em outra data não afeta o dia", () => {
    const db = two([block("p1", "2026-11-12")]);
    expect(openSlots(db, WED, "p1", ["s1"]).length).toBeGreaterThan(0);
  });

  it("agendamento manual: permitido, bloqueado e em conflito", () => {
    const db = two([block("p1")], [booking({ staffId: "p2", time: "09:00" })]);
    const manual = (patch: Partial<Booking>) =>
      booking({ id: "novo", customer: "Cliente", ...patch });
    expect(validateManualBooking(db, manual({ staffId: "p2", time: "10:00" }))).toBeNull();
    expect(validateManualBooking(db, manual({ staffId: "p1", time: "10:00" }))).toBe(
      BLOCKED_MESSAGE,
    );
    expect(validateManualBooking(db, manual({ staffId: "p2", time: "09:10" }))).toMatch(
      /indisponível/,
    );
  });

  it("reagendamento para dia bloqueado do profissional é recusado", () => {
    const original = booking({ date: "2026-11-12", staffId: "p1" });
    const db = two([block("p1")], [original]);
    expect(validateEditedBooking(db, { ...original, date: WED }, TODAY)).toBe(BLOCKED_MESSAGE);
    // Mesmo dia, outro profissional livre: permitido.
    expect(validateEditedBooking(db, { ...original, date: WED, staffId: "p2" }, TODAY)).toBeNull();
  });

  it("edição sem mudar o horário não conflita com o próprio agendamento", () => {
    const own = booking({ time: "09:00" });
    const db = two([], [own]);
    expect(validateEditedBooking(db, { ...own, customer: "João Souza" }, TODAY)).toBeNull();
  });

  it("edição considera a duração de todos os serviços", () => {
    // 10:30 + 60 min (corte + barba) passa do fim do expediente (11:00).
    const multi = booking({ time: "09:00", serviceIds: ["s1", "s2"] });
    const db = two([], [multi]);
    expect(validateEditedBooking(db, { ...multi, time: "10:30" }, TODAY)).toBe(
      "Horário fora do expediente ou bloqueado",
    );
    expect(validateEditedBooking(db, { ...multi, time: "10:00" }, TODAY)).toBeNull();
  });

  it("ocupação da agenda não conta o profissional bloqueado como capacidade", () => {
    const people = [staff(), staff({ id: "p2", name: "Alê" })];
    // Expediente 09:00-11:00 = 4 blocos de 30 min por profissional.
    expect(halfHourCapacity(two([]), people, WED)).toBe(8);
    expect(halfHourCapacity(two([block("p1")]), people, WED)).toBe(4);
    expect(halfHourCapacity(two([block("all")]), people, WED)).toBe(0);
  });
});
