import { asApiError } from "./errors";
import { mockRequest } from "./mockClient";
import { withRetry } from "./retry";
import { supabaseRequest } from "./supabaseClient";
import type { ApiRequest, ApiRoute } from "./types";

/** `VITE_API_MODE=mock` usa o backend local; qualquer outro valor usa o Supabase. */
export const IS_MOCK = import.meta.env["VITE_API_MODE"] === "mock";

/**
 * Ponto único de acesso à API. Leituras (e o salvamento do estado da gestão, que é
 * idempotente) são repetidas em falhas passageiras de rede.
 */
export async function apiRequest(route: ApiRoute, options: ApiRequest = {}): Promise<unknown> {
  const method = options.method || (options.body ? "POST" : "GET");
  const retryable = method === "GET" || (method === "PUT" && route === "/admin/state");
  const run = () => (IS_MOCK ? mockRequest(route, options) : supabaseRequest(route, options));
  try {
    return await withRetry(run, retryable ? 2 : 0);
  } catch (e) {
    throw asApiError(e);
  }
}

export * from "./errors";
export type * from "./types";
