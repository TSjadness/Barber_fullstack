import { describe, expect, it } from "vitest";
import { checkSlot, validateBookingChanges, type Notice } from "@/lib/barber-rules";
const db = {
  services: [{ id: "s1", name: "Corte", duration: 30, price: 40, active: true }],
  staff: [
    {
      id: "p1",
      name: "Lucas",
      start: "09:00",
      end: "18:00",
      days: [1, 2, 3, 4, 5, 6],
      active: true,
    },
  ],
  notices: [] as Notice[],
  bookings: [
    {
      id: "x",
      date: "2030-01-07",
      time: "10:00",
      serviceId: "s1",
      staffId: "p1",
      status: "confirmado",
    },
  ],
};
const now = { date: "2030-01-01", minutes: 0 };
const b = (time: string, date = "2030-01-07") => ({
  id: "n",
  date,
  time,
  serviceId: "s1",
  staffId: "p1",
  status: "confirmado",
});
describe("booking rules", () => {
  it("accepts a free slot in working hours", () =>
    expect(() => checkSlot(b("11:00"), db, now)).not.toThrow());
  it("rejects overlapping bookings", () =>
    expect(() => checkSlot(b("10:20"), db, now)).toThrow("reservado"));
  it("rejects outside working hours", () =>
    expect(() => checkSlot(b("17:40"), db, now)).toThrow("expediente"));
  it("rejects closed days (Sunday)", () =>
    expect(() => checkSlot(b("11:00", "2030-01-06"), db, now)).toThrow("indisponível"));
  it("rejects past dates", () =>
    expect(() => checkSlot(b("11:00", "2029-12-31"), db, now)).toThrow("passou"));
});

describe("multi-service bookings", () => {
  const db2 = {
    ...db,
    services: [...db.services, { id: "s2", name: "Barba", duration: 30, price: 20, active: true }],
  };
  const multi = (time: string) => ({ ...b(time), serviceIds: ["s1", "s2"] });
  it("blocks the summed duration (corte + barba = 60 min)", () =>
    expect(() => checkSlot(multi("09:10"), db2, now)).toThrow("reservado"));
  it("accepts when the summed duration fits", () =>
    expect(() => checkSlot(multi("09:00"), db2, now)).not.toThrow());
  it("rejects when the summed duration passes closing time", () =>
    expect(() => checkSlot(multi("17:10"), db2, now)).toThrow("expediente"));
});

describe("bloqueios por profissional (servidor)", () => {
  const MON = "2030-01-07";
  const p2 = { ...db.staff[0]!, id: "p2", name: "Alê" };
  const block = (staffId: string): Notice => ({
    id: "n" + staffId,
    date: MON,
    staffId,
    type: "block",
  });
  const withBlock = (staffId: string) => ({
    ...db,
    staff: [...db.staff, p2],
    notices: [block(staffId)],
  });

  it("reserva pública recusa o profissional bloqueado", () =>
    expect(() => checkSlot(b("11:00"), withBlock("p1"), now)).toThrow("indisponível"));
  it("reserva pública aceita outro profissional na data bloqueada para o primeiro", () =>
    expect(() => checkSlot({ ...b("11:00"), staffId: "p2" }, withBlock("p1"), now)).not.toThrow());
  it("bloqueio geral recusa qualquer profissional", () =>
    expect(() => checkSlot({ ...b("11:00"), staffId: "p2" }, withBlock("all"), now)).toThrow(
      "indisponível",
    ));
});

describe("gravação da gestão (validateBookingChanges)", () => {
  const MON = "2030-01-07";
  const p2 = { ...db.staff[0]!, id: "p2", name: "Alê" };
  const existing = { ...b("10:00"), id: "x" };
  const base = { ...db, staff: [...db.staff, p2], bookings: [existing] };
  const blockP1: Notice = { id: "n1", date: MON, staffId: "p1", type: "block" };
  const save = (next: typeof base) => () => validateBookingChanges(base, next);

  it("aceita agendamento manual novo em horário livre", () =>
    expect(save({ ...base, bookings: [existing, { ...b("14:05"), id: "m" }] })).not.toThrow());
  it("recusa agendamento manual novo em dia bloqueado do profissional", () =>
    expect(
      save({ ...base, notices: [blockP1], bookings: [existing, { ...b("14:00"), id: "m" }] }),
    ).toThrow("indisponível"));
  it("recusa reagendamento para dia bloqueado do profissional", () =>
    expect(
      save({ ...base, notices: [blockP1], bookings: [{ ...existing, date: MON, time: "15:00" }] }),
    ).toThrow("indisponível"));
  it("aceita reagendamento para outro profissional livre na data bloqueada", () =>
    expect(
      save({ ...base, notices: [blockP1], bookings: [{ ...existing, staffId: "p2" }] }),
    ).not.toThrow());
  it("não revalida agendamento existente sem mudança de vaga (bloqueio criado depois)", () =>
    expect(
      save({ ...base, notices: [blockP1], bookings: [{ ...existing, status: "concluido" }] }),
    ).not.toThrow());
  it("recusa conflito com outro atendimento", () =>
    expect(save({ ...base, bookings: [existing, { ...b("10:10"), id: "m" }] })).toThrow(
      "reservado",
    ));
  it("ignora agendamentos cancelados", () =>
    expect(
      save({ ...base, bookings: [existing, { ...b("10:10"), id: "m", status: "cancelado" }] }),
    ).not.toThrow());
  it("recusa horário fora do expediente na remarcação", () =>
    expect(save({ ...base, bookings: [{ ...existing, time: "17:50" }] })).toThrow("expediente"));
});
