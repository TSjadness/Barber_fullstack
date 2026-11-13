import type { ReactNode } from "react";
import { cx } from "@/utils/classNames";

/** Linha de item gerenciável (serviço, profissional, pagamento). */
export function ManageRow({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("manage-row", className)}>{children}</div>;
}
