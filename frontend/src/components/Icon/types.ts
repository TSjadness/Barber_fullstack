import type { ICONS } from "./icons";

export type IconName = keyof typeof ICONS;

export interface IconProps {
  name: IconName;
  /** Classe extra de tamanho (`ic-md`, `ic-lg`). */
  size?: "ic-md" | "ic-lg";
}
