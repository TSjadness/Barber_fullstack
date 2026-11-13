import { useContext } from "react";
import { PreferencesContext } from "@/contexts/preferences/context";

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences deve ser usado dentro de PreferencesProvider");
  return ctx;
}
