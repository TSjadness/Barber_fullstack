import { ApiError, authErrorPt } from "./errors";
import type { ApiRequest, ApiRoute } from "./types";
import { supabase } from "@/integrations/supabase/client";
import {
  createBooking,
  getAdminState,
  getPublicState,
  saveAdminState,
} from "@/lib/barber.functions";

/**
 * Implementa as rotas lógicas da API sobre o Supabase: dados pelas server functions
 * (`src/lib/barber.functions.ts`) e autenticação pelo Supabase Auth.
 */

type Json = Record<string, unknown>;

const unwrap = <T extends Json>(r: T, status = 400) => {
  if (r && typeof r === "object" && "error" in r && r["error"])
    throw new ApiError(String(r["error"]), {
      status,
      reason: typeof r["reason"] === "string" ? r["reason"] : undefined,
    });
  return r;
};

const field = (body: Json, key: string) => String(body[key] || "");
const email = (body: Json) => field(body, "email").trim().toLowerCase();

async function login(body: Json) {
  const address = email(body);
  const password = field(body, "password");
  // O login nunca cria contas: o dono já existe e é o único com acesso à gestão.
  const { data, error } = await supabase.auth.signInWithPassword({ email: address, password });
  if (error) throw new Error("Credenciais inválidas.");
  try {
    await getAdminState();
  } catch {
    await supabase.auth.signOut();
    throw new Error("Esta conta não tem acesso à gestão.");
  }
  return { token: "session", user: { email: data.user.email, role: "owner" } };
}

async function forgot(body: Json) {
  const { error } = await supabase.auth.resetPasswordForEmail(email(body), {
    redirectTo: `${window.location.origin}/login`,
  });
  if (error) throw new Error("Não foi possível enviar o código. Tente novamente em instantes.");
  return { ok: true };
}

async function reset(body: Json) {
  const code = field(body, "code").trim();
  const password = field(body, "password");
  if (password.length < 6) throw new Error("A nova senha precisa ter pelo menos 6 caracteres.");
  if (code) {
    const v = await supabase.auth.verifyOtp({ email: email(body), token: code, type: "recovery" });
    if (v.error) throw new Error("Código inválido ou expirado. Solicite um novo código.");
  } else {
    // Link de recuperação: a sessão temporária já foi criada pelo Supabase.
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw new Error("Informe o código recebido por e-mail.");
  }
  const u = await supabase.auth.updateUser({ password });
  if (u.error) throw new Error("Não foi possível alterar a senha: " + authErrorPt(u.error.message));
  await supabase.auth.signOut();
  return { ok: true };
}

export async function supabaseRequest(route: ApiRoute, options: ApiRequest = {}): Promise<unknown> {
  const body = (options.body ? JSON.parse(options.body) : {}) as Json;
  switch (route) {
    case "/public":
      return getPublicState();
    case "/admin/state":
      if (options.method === "PUT") {
        const saved = (await saveAdminState({ data: body })) as Json;
        return unwrap(saved, saved?.["conflict"] ? 409 : 400);
      }
      return getAdminState();
    case "/bookings": {
      // Limite de reservas (telefone/IP) → 403: não é conflito de horário nem falha passageira.
      const result = (await createBooking({ data: body })) as Json;
      return unwrap(result, result["limit"] ? 403 : 409);
    }
    case "/login":
      return login(body);
    case "/forgot":
      return forgot(body);
    case "/reset":
      return reset(body);
    case "/logout":
      await supabase.auth.signOut();
      return { ok: true };
  }
}

export async function hasSupabaseSession() {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}
