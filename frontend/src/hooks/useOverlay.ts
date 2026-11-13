import { useContext } from "react";
import { OverlayContext } from "@/contexts/overlay/context";

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay deve ser usado dentro de OverlayProvider");
  return ctx;
}
