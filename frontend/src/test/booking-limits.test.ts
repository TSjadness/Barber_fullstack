import { describe, expect, it, vi } from "vitest";
import { LimitError, checkPhoneLimit, phoneKey, type Booking } from "@/lib/barber-rules";

// Limite do site público: no máximo 2 reservas ativas futuras por WhatsApp.
const now = { date: "2031-03-04", minutes: 600 }; // 10:00
const b = (time: string, phone: string, status = "confirmado", date = "2031-03-04"): Booking => ({
  id: time + phone + status + date,
  date,
  time,
  phone,
  status,
  serviceId: "s1",
  staffId: "p1",
});

describe("limite de reservas por WhatsApp", () => {
  it("ignora máscara e o código do país", () => {
    expect(phoneKey("+55 (79) 99999-0001")).toBe("79999990001");
    expect(phoneKey("79999990001")).toBe("79999990001");
  });

  it("aceita até 2 reservas ativas e recusa a terceira", () => {
    expect(() => checkPhoneLimit("79999990001", [b("11:00", "79999990001")], now)).not.toThrow();
    expect(() =>
      checkPhoneLimit(
        "(79) 99999-0001",
        [b("11:00", "79999990001"), b("12:00", "5579999990001", "pendente")],
        now,
      ),
    ).toThrow(LimitError);
  });

  it("canceladas, concluídas, passadas e de outro telefone não contam", () => {
    const list = [
      b("11:00", "79999990001", "cancelado"),
      b("12:00", "79999990001", "concluido"),
      b("09:00", "79999990001"),
      b("11:00", "79999990001", "confirmado", "2031-03-01"),
      b("13:00", "79999990002"),
      b("14:00", "79999990002"),
    ];
    expect(() => checkPhoneLimit("79999990001", list, now)).not.toThrow();
  });
});

// Mapeamento no modo Supabase: limite → 403 (mensagem direta, sem voltar à escolha de horário).
const createBooking = vi.fn();
vi.mock("@/lib/barber.functions", () => ({
  saveAdminState: vi.fn(),
  createBooking: (arg: unknown) => createBooking(arg),
  getAdminState: vi.fn(),
  getPublicState: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: {} } }));

describe("reserva recusada por limite (modo Supabase)", () => {
  it("vira erro 403 com a mensagem do servidor", async () => {
    const { supabaseRequest } = await import("@/services/api/supabaseClient");
    createBooking.mockResolvedValue({ error: "Muitas reservas", limit: true });
    await expect(
      supabaseRequest("/bookings", { method: "POST", body: "{}" }),
    ).rejects.toMatchObject({ status: 403, message: "Muitas reservas" });
    createBooking.mockResolvedValue({ error: "Este horário acabou de ser reservado." });
    await expect(
      supabaseRequest("/bookings", { method: "POST", body: "{}" }),
    ).rejects.toMatchObject({ status: 409 });
  });
});

describe("modal de limite: mensagem e link do WhatsApp", async () => {
  const { limitWhatsAppLink, limitWhatsAppText } = await import("@/pages/Booking/bookingLimit");
  const request = {
    customer: "Maria Lima",
    services: ["Corte masculino", "Barba"],
    date: "2031-03-04",
    time: "10:00",
    staffName: "Rafael",
  };

  it("monta a mensagem com nome, serviços, data, horário e profissional", () => {
    expect(limitWhatsAppText("phone", request)).toBe(
      "Olá! Sou Maria Lima. Já tenho dois agendamentos ativos e gostaria de realizar mais um: Corte masculino + Barba em 04/03/2031 às 10:00 com Rafael. Poderiam verificar a disponibilidade para mim?",
    );
    expect(limitWhatsAppText("ip", request)).toContain("atingi o limite de reservas");
  });

  it("usa o WhatsApp cadastrado da barbearia (com 55) e esconde o botão sem número", () => {
    const href = limitWhatsAppLink("(79) 99999-8888", "Olá! Tudo bem?");
    expect(href).toBe("https://wa.me/5579999998888?text=Ol%C3%A1!%20Tudo%20bem%3F");
    expect(limitWhatsAppLink("", "x")).toBe("");
  });

  it("o motivo do limite chega ao site junto com o 403", async () => {
    const { supabaseRequest } = await import("@/services/api/supabaseClient");
    const { reasonOf } = await import("@/services/api");
    createBooking.mockResolvedValue({ error: "Limite", limit: true, reason: "phone" });
    const error = await supabaseRequest("/bookings", { method: "POST", body: "{}" }).catch(
      (e: unknown) => e,
    );
    expect(reasonOf(error)).toBe("phone");
  });
});
