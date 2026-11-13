import { useCallback, useMemo, useState, type ReactNode } from "react";
import { PreferencesContext, type PreferencesValue } from "./context";
import { STORAGE_KEYS } from "@/constants/barber";
import type { Theme } from "@/types/app";
import { storage } from "@/utils/storage";

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    storage.get(STORAGE_KEYS.theme) === "light" ? "light" : "dark",
  );
  const [sideCollapsed, setSideCollapsed] = useState(
    () => storage.get(STORAGE_KEYS.sidebar) === "1",
  );

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "light" ? "dark" : "light";
      storage.set(STORAGE_KEYS.theme, next);
      return next;
    });
  }, []);
  const toggleSide = useCallback(() => {
    setSideCollapsed((current) => {
      storage.set(STORAGE_KEYS.sidebar, current ? "0" : "1");
      return !current;
    });
  }, []);

  const value = useMemo<PreferencesValue>(
    () => ({ theme, toggleTheme, sideCollapsed, toggleSide }),
    [theme, toggleTheme, sideCollapsed, toggleSide],
  );
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
