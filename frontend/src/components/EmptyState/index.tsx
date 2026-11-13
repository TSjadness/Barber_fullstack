import type { ReactNode } from "react";

/** Mensagem de lista vazia. Em tabelas, use `colSpan` para ocupar a linha inteira. */
export function EmptyState({ as = "div", colSpan, children }: EmptyStateProps) {
  if (as === "td")
    return (
      <tr>
        <td colSpan={colSpan} className="empty">
          {children}
        </td>
      </tr>
    );
  if (as === "p") return <p className="empty">{children}</p>;
  return <div className="empty">{children}</div>;
}

interface EmptyStateProps {
  as?: "div" | "p" | "td";
  colSpan?: number;
  children: ReactNode;
}
