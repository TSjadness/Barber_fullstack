import type { ButtonProps } from "./types";
import { cx } from "@/utils/classNames";

/** Botão padrão da interface (`.btn`), com variações primária, fantasma, perigo e compacta. */
export function Button({ variant, small, className, children, ...rest }: ButtonProps) {
  return (
    <button className={cx("btn", small && "small", variant, className)} {...rest}>
      {children}
    </button>
  );
}
