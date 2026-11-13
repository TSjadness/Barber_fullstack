import { apiRequest, ApiError } from "./api";
import type { AppState } from "@/types/barber";

/**
 * Leitura e gravação do estado da barbearia (catálogo, equipe, avisos e agendamentos).
 * As respostas da API são validadas antes de chegar à interface.
 */

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object";

export function parseAppState(value: unknown): AppState {
  if (
    !isRecord(value) ||
    !isRecord(value["shop"]) ||
    !Array.isArray(value["services"]) ||
    !Array.isArray(value["staff"]) ||
    !Array.isArray(value["notices"]) ||
    !Array.isArray(value["bookings"])
  )
    throw new ApiError("Resposta inválida do servidor.");
  const payments = value["payments"];
  return {
    ...(value as unknown as AppState),
    payments: Array.isArray(payments) ? payments : [],
  };
}

/** Catálogo público e horários ocupados, sem nomes e telefones dos clientes. */
export const fetchPublicState = async () => parseAppState(await apiRequest("/public"));

/** Estado completo da gestão (exige sessão do proprietário). */
export const fetchAdminState = async () => parseAppState(await apiRequest("/admin/state"));

/**
 * Salva o estado completo da gestão; o servidor valida as regras antes de gravar.
 * Devolve a nova versão do estado (ou `undefined` se o servidor não informar).
 * Estado desatualizado (outra aba/aparelho gravou antes) → ApiError com status 409.
 */
export const saveAdminState = async (snapshot: string): Promise<string | undefined> => {
  const result: unknown = await apiRequest("/admin/state", { method: "PUT", body: snapshot });
  const version = isRecord(result) ? result["version"] : undefined;
  return typeof version === "string" ? version : undefined;
};
