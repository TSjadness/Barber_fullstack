import type { ReactNode } from "react";

/** Tabela com rolagem horizontal própria (`.tablewrap > .table`). */
export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="tablewrap">
      <table className="table">{children}</table>
    </div>
  );
}
