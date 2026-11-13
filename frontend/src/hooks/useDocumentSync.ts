import { useEffect } from "react";
import type { Theme, View } from "@/types/app";

interface DocumentSyncOptions {
  ready: boolean;
  view: View;
  loggedIn: boolean;
  theme: Theme;
  shopName: string | undefined;
}

/**
 * Mantém o documento coerente com a tela: endereço (`/` ou `/login`, sem recarregar
 * a página), título da aba e o tema claro, que vale apenas para a gestão logada.
 */
export function useDocumentSync({ ready, view, loggedIn, theme, shopName }: DocumentSyncOptions) {
  useEffect(() => {
    if (!ready) return;
    const wanted = view === "admin" ? "/login" : "/";
    if (location.pathname !== wanted && !location.hash.includes("type=recovery"))
      history.replaceState(null, "", wanted);
    document.body.classList.toggle(
      "theme-light",
      view === "admin" && loggedIn && theme === "light",
    );
    document.title = `${shopName} • ${view === "admin" ? "Gestão" : view === "booking" ? "Agendamento" : "Barbearia"}`;
  }, [ready, view, loggedIn, theme, shopName]);
}
