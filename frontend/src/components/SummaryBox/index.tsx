import type { CSSProperties, ReactNode } from "react";

/** Resumo de um agendamento (serviço, data, profissional, valor). */
export function SummaryBox({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  return (
    <div className="summary-box" style={style}>
      {children}
    </div>
  );
}
