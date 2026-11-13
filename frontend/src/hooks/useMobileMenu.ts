import { useCallback, useEffect, useRef, useState } from "react";
import { MOBILE_QUERY } from "@/constants/barber";

const LOCK_CLASS = "bf-mobile-menu-lock";

/**
 * Menu lateral da gestão no mobile. Ao abrir, a rolagem da página é guardada e o
 * fundo é imobilizado (classe `bf-mobile-menu-lock` em html e body), mantendo
 * cabeçalho e menu presos à viewport; ao fechar, a rolagem é restaurada.
 * Fecha com Esc e quando a largura da tela cruza o breakpoint mobile.
 */
export function useMobileMenu() {
  const [open, setOpen] = useState(false);
  const lockedScroll = useRef<number | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    const previous = lockedScroll.current;
    lockedScroll.current = null;
    document.documentElement.classList.remove(LOCK_CLASS);
    document.body.classList.remove(LOCK_CLASS);
    document.body.style.removeProperty("--bf-locked-scroll-top");
    if (previous !== null) window.scrollTo(0, previous);
  }, []);

  const toggle = useCallback(() => {
    if (open) return close();
    if (window.matchMedia(MOBILE_QUERY).matches) {
      lockedScroll.current = window.scrollY;
      document.body.style.setProperty("--bf-locked-scroll-top", `-${window.scrollY}px`);
      document.documentElement.classList.add(LOCK_CLASS);
      document.body.classList.add(LOCK_CLASS);
    }
    setOpen(true);
  }, [open, close]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const media = window.matchMedia(MOBILE_QUERY);
    document.addEventListener("keydown", onKey);
    media.addEventListener("change", close);
    return () => {
      document.removeEventListener("keydown", onKey);
      media.removeEventListener("change", close);
    };
  }, [close]);

  return { open, toggle, close };
}
