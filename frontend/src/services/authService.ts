import { apiRequest, ApiError, IS_MOCK } from "./api";
import { mockToken } from "./api/mockClient";
import { hasSupabaseSession } from "./api/supabaseClient";
import type { LoginPayload, ResetPayload } from "./api";

/** Autenticação do proprietário (login, saída e recuperação de senha). */

/** Há uma sessão salva neste navegador? */
export const hasStoredSession = async () => (IS_MOCK ? !!mockToken.get() : hasSupabaseSession());

/** Apaga a sessão local do modo mock (o Supabase gerencia a própria sessão). */
export const clearStoredSession = () => {
  if (IS_MOCK) mockToken.clear();
};

export async function login(payload: LoginPayload): Promise<string> {
  const data = await apiRequest("/login", { method: "POST", body: JSON.stringify(payload) });
  const token =
    data && typeof data === "object" ? (data as Record<string, unknown>)["token"] : null;
  if (typeof token !== "string" || !token) throw new ApiError("Resposta inválida do servidor.");
  return token;
}

export async function logout() {
  await apiRequest("/logout", { method: "POST" });
}

/** Envia o código de recuperação para o e-mail informado. */
export async function sendResetCode(email: string) {
  await apiRequest("/forgot", { method: "POST", body: JSON.stringify({ email }) });
}

export async function resetPassword(payload: ResetPayload) {
  await apiRequest("/reset", { method: "POST", body: JSON.stringify(payload) });
}
