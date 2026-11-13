import { createContext } from "react";
import type { AppState } from "@/types/barber";

export type LoadStatus = "loading" | "ready" | "error";

export interface SaveOptions {
  /**
   * Agendamentos que devem ser apagados de verdade. Sem este pedido explícito o
   * servidor preserva os agendamentos ausentes do envio (ex.: reservas públicas
   * feitas durante a edição). Pagos ou concluídos são recusados pelo servidor.
   */
  deletedBookingIds?: string[];
}

/** Estado da barbearia vindo da API e as operações que o alteram. */
export interface BarberDataValue {
  db: AppState | null;
  /** Sessão do proprietário ativa (vazio = visitante). */
  token: string;
  status: LoadStatus;
  loadError: string;
  /**
   * Aplica uma alteração da gestão e grava o estado completo no servidor.
   * A receita recebe uma cópia mutável do estado atual.
   */
  update: (recipe: (draft: AppState) => void, options?: SaveOptions) => void;
  /** Altera somente a cópia local (ex.: reserva recém-criada pelo cliente). */
  updateLocal: (recipe: (draft: AppState) => void) => void;
  /** Recarrega o catálogo público (sem dados de clientes). */
  reloadPublic: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const BarberDataContext = createContext<BarberDataValue | null>(null);
