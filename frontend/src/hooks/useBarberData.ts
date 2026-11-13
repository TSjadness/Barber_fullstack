import { useContext } from "react";
import { BarberDataContext } from "@/contexts/data/context";
import type { AppState } from "@/types/barber";

export function useBarberData() {
  const ctx = useContext(BarberDataContext);
  if (!ctx) throw new Error("useBarberData deve ser usado dentro de BarberDataProvider");
  return ctx;
}

/** Estado já carregado (para componentes que só aparecem depois da carga inicial). */
export function useDb(): AppState {
  const { db } = useBarberData();
  if (!db) throw new Error("Estado da barbearia ainda não carregado");
  return db;
}
