import type { ReactNode } from "react";

/** Etiqueta discreta com informação complementar. */
export function Chip({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>;
}
