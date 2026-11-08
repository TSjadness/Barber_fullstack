import { describe, expect, it } from "vitest";
import { checkSlot } from "@/lib/barber-rules";
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
  notices: [] as any[],
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
