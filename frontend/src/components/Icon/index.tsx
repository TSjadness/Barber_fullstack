import { ICONS } from "./icons";
import type { IconProps } from "./types";

/** Ícone de linha da interface (16px, traço 1,75), com a classe `ic` usada pelos estilos. */
export function Icon({ name, size }: IconProps) {
  const Svg = ICONS[name];
  return <Svg size={16} strokeWidth={1.75} className={size ? `ic ${size}` : "ic"} />;
}

export type { IconName } from "./types";
