import { beforeEach, describe, expect, it, vi } from "vitest";

// Server functions e cliente do Supabase simulados: o teste cobre só o mapeamento das respostas.
const saveAdminState = vi.fn();
vi.mock("@/lib/barber.functions", () => ({
  saveAdminState: (arg: unknown) => saveAdminState(arg),
  createBooking: vi.fn(),
  getAdminState: vi.fn(),
  getPublicState: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: {} } }));

const { supabaseRequest } = await import("@/services/api/supabaseClient");

describe("controle de versão da gestão (modo Supabase)", () => {
  beforeEach(() => saveAdminState.mockReset());

  it("envia a versão lida e devolve a nova versão", async () => {
    saveAdminState.mockResolvedValue({ ok: true, version: "v2" });
    const out = await supabaseRequest("/admin/state", {
      method: "PUT",
      body: JSON.stringify({ shop: {}, version: "v1" }),
    });
    expect(saveAdminState).toHaveBeenCalledWith({ data: { shop: {}, version: "v1" } });
    expect(out).toEqual({ ok: true, version: "v2" });
  });

  it("estado desatualizado vira erro 409 (a tela recarrega e descarta a fila)", async () => {
    saveAdminState.mockResolvedValue({
      error: "Os dados foram alterados em outra aba",
      conflict: true,
    });
    await expect(
      supabaseRequest("/admin/state", { method: "PUT", body: JSON.stringify({ version: "v0" }) }),
    ).rejects.toMatchObject({ status: 409 });
  });

  it("erro de regra continua sendo 400", async () => {
    saveAdminState.mockResolvedValue({ error: "Agendamento inválido." });
    await expect(
      supabaseRequest("/admin/state", { method: "PUT", body: "{}" }),
    ).rejects.toMatchObject({ status: 400 });
  });
});
