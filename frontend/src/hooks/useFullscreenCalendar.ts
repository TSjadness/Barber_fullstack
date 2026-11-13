import { useCallback, useEffect, useState } from "react";

const LOCK_CLASS = "bf-cal-lock";

const exitBrowserFullscreen = () => {
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
};

/**
 * Modo maximizado do Calendário: trava a rolagem do corpo e pede tela cheia ao
 * navegador. Sair da tela cheia (Esc) também minimiza, e Esc minimiza quando não há
 * modal aberto. Ao desmontar (troca de seção ou de tela) o modo é encerrado.
 */
export function useFullscreenCalendar(overlayOpen: boolean) {
  const [full, setFull] = useState(false);

  const setFullscreen = useCallback((on: boolean) => {
    setFull(on);
    document.body.classList.toggle(LOCK_CLASS, on);
    if (on) document.documentElement.requestFullscreen?.().catch(() => {});
    else exitBrowserFullscreen();
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && full) setFullscreen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && full && !overlayOpen) setFullscreen(false);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("keydown", onKey);
    };
  }, [full, overlayOpen, setFullscreen]);

  useEffect(
    () => () => {
      document.body.classList.remove(LOCK_CLASS);
      exitBrowserFullscreen();
    },
    [],
  );

  return { full, toggle: () => setFullscreen(!full) };
}
