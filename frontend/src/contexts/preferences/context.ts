import { createContext } from "react";
import type { Theme } from "@/types/app";

/** Preferências visuais da gestão salvas no navegador. */
export interface PreferencesValue {
  theme: Theme;
  toggleTheme: () => void;
  sideCollapsed: boolean;
  toggleSide: () => void;
}

export const PreferencesContext = createContext<PreferencesValue | null>(null);
