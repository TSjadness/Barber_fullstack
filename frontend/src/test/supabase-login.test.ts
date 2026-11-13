import { beforeEach, describe, expect, it, vi } from "vitest";

// O login do modo Supabase nunca cria contas: só o dono já cadastrado entra na gestão.
const auth = {
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
};
const getAdminState = vi.fn();
vi.mock("@/lib/barber.functions", () => ({
  saveAdminState: vi.fn(),
  createBooking: vi.fn(),
  getAdminState: () => getAdminState(),
  getPublicState: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth } }));

const { supabaseRequest } = await import("@/services/api/supabaseClient");
const login = (email: string, password: string) =>
  supabaseRequest("/login", { method: "POST", body: JSON.stringify({ email, password }) });

describe("login no modo Supabase", () => {
  beforeEach(() => {
    Object.values(auth).forEach((f) => f.mockReset());
    getAdminState.mockReset();
  });

  it("senha errada ou conta inexistente é recusada sem criar conta", async () => {
    auth.signInWithPassword.mockResolvedValue({ data: {}, error: { message: "Invalid login" } });
    await expect(login("visitante@exemplo.com", "qualquer-coisa")).rejects.toThrow(
      "Credenciais inválidas.",
    );
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it("conta sem papel de dono não acessa a gestão", async () => {
    auth.signInWithPassword.mockResolvedValue({
      data: { user: { email: "outra@exemplo.com" } },
      error: null,
    });
    getAdminState.mockRejectedValue(new Error("Acesso restrito ao proprietário."));
    await expect(login("outra@exemplo.com", "senha-de-teste")).rejects.toThrow(
      "Esta conta não tem acesso à gestão.",
    );
    expect(auth.signOut).toHaveBeenCalled();
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it("o dono entra normalmente", async () => {
    auth.signInWithPassword.mockResolvedValue({
      data: { user: { email: "dono@exemplo.com" } },
      error: null,
    });
    getAdminState.mockResolvedValue({});
    await expect(login("dono@exemplo.com", "senha-de-teste")).resolves.toMatchObject({
      user: { role: "owner" },
    });
  });
});
