import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/utils/classNames";

/** Painel com borda e fundo da interface (`.card`). */
export function Card({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className={cx("card", className)} style={style}>
      {children}
    </div>
  );
}
