import { ApiError, NETWORK_MESSAGE } from "./errors";
import type { ApiRequest, ApiRoute } from "./types";
import { STORAGE_KEYS } from "@/constants/barber";

/** Cliente da API local (backend Node + SQLite em `backend/src/server.mjs`). */
export const MOCK_API_URL = (import.meta.env["VITE_API_URL"] || "http://localhost:3333").replace(
  /\/+$/,
  "",
);
const REQUEST_TIMEOUT_MS = 15000;

export const mockToken = {
  get: () => localStorage.getItem(STORAGE_KEYS.mockToken),
  set: (token: string) => localStorage.setItem(STORAGE_KEYS.mockToken, token),
  clear: () => localStorage.removeItem(STORAGE_KEYS.mockToken),
};

export async function mockRequest(route: ApiRoute, options: ApiRequest = {}): Promise<unknown> {
  const token = mockToken.get();
  // Sair sempre apaga a sessão local, mesmo que o servidor esteja fora do ar.
  if (route === "/logout") mockToken.clear();
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
      { network: true },
    );
  } finally {
    clearTimeout(timer);
  }
  const result: unknown = await response.json().catch(() => ({}));
  const record = (result && typeof result === "object" ? result : {}) as Record<string, unknown>;
  if (!response.ok)
    throw new ApiError(String(record["error"] || `Erro HTTP ${response.status}`), {
      status: response.status,
    });
  if (route === "/login" && typeof record["token"] === "string") mockToken.set(record["token"]);
  return result;
}
