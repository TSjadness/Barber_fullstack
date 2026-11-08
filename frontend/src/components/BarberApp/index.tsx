import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { BarberAppProps } from "./types";
import { supabase } from "@/integrations/supabase/client";
import {
  createBooking,
  getAdminState,
  getPublicState,
  ownerExists,
  saveAdminState,
} from "@/lib/barber.functions";

const IS_MOCK = import.meta.env["VITE_API_MODE"] === "mock";
const MOCK_API_URL = (import.meta.env["VITE_API_URL"] || "http://localhost:3333").replace(
  /\/+$/,
  "",
);
const MOCK_TOKEN_KEY = "barberflow_mock_token";

/** Erro da API com o status HTTP e a indicação de falha de rede (sem resposta do servidor). */
class ApiError extends Error {
  status: number | undefined;
  network: boolean;
  constructor(message: string, options: { status?: number; network?: boolean } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.network = options.network ?? false;
  }
}

const NETWORK_MESSAGE =
  "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
const REQUEST_TIMEOUT_MS = 15000;

/** Falha passageira: sem rede, tempo esgotado, servidor sobrecarregado ou erro 5xx. */
const isTransient = (e: unknown) =>
  e instanceof ApiError &&
  (e.network || e.status === 408 || e.status === 429 || (e.status ?? 0) >= 500);

/** Qualquer erro vindo do fetch/servidor (sem ApiError) que na prática é falta de conexão. */
const asApiError = (e: unknown) => {
  if (e instanceof ApiError) return e;
  const message = e instanceof Error ? e.message : String(e);
  if (
    e instanceof TypeError ||
    /failed to fetch|networkerror|load failed|network request/i.test(message)
  )
    return new ApiError(NETWORK_MESSAGE, { network: true });
  // O middleware de autenticação responde "Unauthorized: ..." em inglês: vira sessão expirada (401).
  if (/^unauthorized/i.test(message))
    return new ApiError("Sua sessão expirou. Entre novamente.", { status: 401 });
  return e instanceof Error ? e : new Error(message);
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Repete a chamada em falhas passageiras (espera crescente: ~0,4 s, ~0,9 s). */
async function withRetry<T>(run: () => Promise<T>, retries: number): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await run();
    } catch (e) {
      if (attempt >= retries || !isTransient(e)) throw e;
      await sleep(400 * 2 ** attempt + Math.random() * 150);
    }
  }
}

async function mockApi(route: string, options: { method?: string; body?: string } = {}) {
  const token = localStorage.getItem(MOCK_TOKEN_KEY);
  // Sair sempre apaga a sessão local, mesmo que o servidor esteja fora do ar.
  if (route === "/logout") localStorage.removeItem(MOCK_TOKEN_KEY);
  const method = options.method || (options.body ? "POST" : "GET");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(`${MOCK_API_URL}${route}`, {
      method,
      signal: controller.signal,
      headers: {
        ...(options.body || method !== "GET" ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(options.body ? { body: options.body } : method !== "GET" ? { body: "{}" } : {}),
    });
  } catch (e) {
    const aborted = e instanceof DOMException && e.name === "AbortError";
    throw new ApiError(
      aborted ? "O servidor demorou para responder. Tente novamente." : NETWORK_MESSAGE,
      {
        network: true,
      },
    );
  } finally {
    clearTimeout(timer);
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new ApiError(result.error || `Erro HTTP ${response.status}`, { status: response.status });
  if (route === "/login" && result.token) localStorage.setItem(MOCK_TOKEN_KEY, result.token);
  return result;
}

function authErrorPt(raw: string): string {
  const m = raw.toLowerCase();
  const rules: [RegExp, string][] = [
    [
      /email address .* is invalid|invalid email|unable to validate email/,
      "E-mail inválido. Confira o endereço digitado.",
    ],
    [/invalid login credentials/, "E-mail ou senha incorretos."],
    [
      /email not confirmed/,
      "E-mail ainda não confirmado. Confirme pelo link enviado ao seu e-mail.",
    ],
    [/user already registered|already been registered/, "Este e-mail já está cadastrado."],
    [
      /password should be at least|password is too short|weak password/,
      "A senha é muito curta ou fraca. Use pelo menos 6 caracteres.",
    ],
    [
      /rate limit|too many requests|over_email_send_rate_limit|security purposes/,
      "Muitas tentativas. Aguarde um pouco e tente novamente.",
    ],
    [/signups? not allowed|signup is disabled/, "O cadastro de novas contas está desativado."],
    [/same password|different from the old/, "A nova senha precisa ser diferente da atual."],
    [
      /token has expired|otp.*expired|invalid or has expired/,
      "Código inválido ou expirado. Solicite um novo código.",
    ],
    [/user not found/, "Usuário não encontrado."],
    [/failed to fetch|network|fetch failed/, NETWORK_MESSAGE],
  ];
  for (const [re, pt] of rules) if (re.test(m)) return pt;
  return "Não foi possível concluir. Tente novamente em instantes.";
}

const unwrap = <T extends Record<string, unknown>>(r: T, status = 400) => {
  if (r && typeof r === "object" && "error" in r && r["error"])
    throw new ApiError(String(r["error"]), { status });
  return r;
};

type ApiOptions = { method?: string; body?: string };

let adminPrefetch: Promise<unknown> | null = null;
let prefetchedAdminState: { at: number; data: unknown } | null = null;

async function api(route: string, options: ApiOptions = {}) {
  const method = options.method || (options.body ? "POST" : "GET");
  const cached = prefetchedAdminState;
  if (cached) {
    prefetchedAdminState = null;
    adminPrefetch = null;
    if (route === "/admin/state" && method === "GET" && Date.now() - cached.at < 4000)
      return cached.data;
  }
  const retryable = method === "GET" || (method === "PUT" && route === "/admin/state");
  try {
    return await withRetry(() => apiOnce(route, options), retryable ? 2 : 0);
  } catch (e) {
    throw asApiError(e);
  }
}

async function apiOnce(route: string, options: ApiOptions = {}) {
  if (IS_MOCK) return mockApi(route, options);
  const body = options.body ? JSON.parse(options.body) : {};
  switch (route) {
    case "/public":
      return getPublicState();
    case "/admin/state":
      if (options.method === "PUT")
        return unwrap((await saveAdminState({ data: body })) as Record<string, unknown>);
      return getAdminState();
    case "/bookings":
      return unwrap(await createBooking({ data: body }), 409);
    case "/login": {
      const email = String(body.email || "")
        .trim()
        .toLowerCase();
      const password = String(body.password || "");
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const { exists } = await ownerExists();
        if (exists) throw new Error("Credenciais inválidas.");
        const su = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (su.error) throw new Error(authErrorPt(su.error.message));
        if (!su.data.session)
          throw new Error(
            "Conta do proprietário criada. Confirme pelo link enviado ao seu e-mail e entre novamente.",
          );
        return { token: "session", user: { email, role: "owner" } };
      }
      try {
        await getAdminState();
      } catch {
        await supabase.auth.signOut();
        throw new Error("Esta conta não tem acesso à gestão.");
      }
      return { token: "session", user: { email: data.user.email, role: "owner" } };
    }
    case "/forgot": {
      const email = String(body.email || "")
        .trim()
        .toLowerCase();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw new Error("Não foi possível enviar o código. Tente novamente em instantes.");
      return { ok: true };
    }
    case "/reset": {
      const email = String(body.email || "")
        .trim()
        .toLowerCase();
      const code = String(body.code || "").trim();
      const password = String(body.password || "");
      if (password.length < 6) throw new Error("A nova senha precisa ter pelo menos 6 caracteres.");
      if (code) {
        const v = await supabase.auth.verifyOtp({ email, token: code, type: "recovery" });
        if (v.error) throw new Error("Código inválido ou expirado. Solicite um novo código.");
      } else {
        const { data } = await supabase.auth.getSession();
        if (!data.session) throw new Error("Informe o código recebido por e-mail.");
      }
      const u = await supabase.auth.updateUser({ password });
      if (u.error)
        throw new Error("Não foi possível alterar a senha: " + authErrorPt(u.error.message));
      await supabase.auth.signOut();
      return { ok: true };
    }
    case "/logout":
      await supabase.auth.signOut();
      return { ok: true };
  }
  throw new Error("Rota não encontrada.");
}

interface BarberWindow extends Window {
  __barberReactToast?: boolean;
  __barberStartView?: string;
  __barberToken?: string;
  __barberApi?: typeof api;
  __barberRemount?: (view: "admin" | "public") => void;
}

export function BarberApp({ startView }: BarberAppProps) {
  useEffect(() => {
    (window as BarberWindow).__barberReactToast = true;
    const handler = (event: Event) => {
      const { message, type } = (event as CustomEvent<{ message: string; type: string }>).detail;
      if (type === "error") toast.error(message);
      else if (type === "success") toast.success(message);
      else toast.info(message);
    };
    window.addEventListener("barber:toast", handler);
    return () => {
      window.removeEventListener("barber:toast", handler);
      (window as BarberWindow).__barberReactToast = false;
    };
  }, []);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = IS_MOCK
        ? {
            data: {
              session: localStorage.getItem(MOCK_TOKEN_KEY) ? { access_token: "mock" } : null,
            },
          }
        : await supabase.auth.getSession();
      if (cancelled) return;
      const w = window as BarberWindow;
      const recovery = window.location.hash.includes("type=recovery");
      w.__barberStartView = recovery ? "reset-link" : startView || "public";
      w.__barberApi = api;
      w.__barberToken = data.session && !recovery ? "session" : "";
      if (IS_MOCK && data.session && !document.querySelector("script[data-barber]")) {
        try {
          // Uma única busca compartilhada, mesmo que o efeito rode duas vezes (StrictMode).
          adminPrefetch ??= withRetry(() => mockApi("/admin/state"), 2);
          const data = await adminPrefetch;
          if (!prefetchedAdminState) prefetchedAdminState = { at: Date.now(), data };
        } catch (e) {
          adminPrefetch = null;
          // Só encerra a sessão local se o servidor a recusou (401). Falha de rede não desloga ninguém.
          if (e instanceof ApiError && e.status === 401) {
            localStorage.removeItem(MOCK_TOKEN_KEY);
            w.__barberToken = "";
          }
        }
      }
      if (document.querySelector("script[data-barber]")) {
        // Script already running (client-side route change): repaint into the new #app.
        w.__barberRemount?.(startView === "admin" ? "admin" : "public");
        return;
      }
      const s = document.createElement("script");
      s.src = "/barber/app.js";
      const icons = document.createElement("script");
      icons.src = "/barber/icons.js";
      icons.async = false;
      s.async = false;
      document.body.appendChild(icons);
      s.dataset["barber"] = "1";
      document.body.appendChild(s);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div id="app" />
      <div id="overlay" />
      <div id="toastbox" />
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
