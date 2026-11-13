import { isIconName } from "@/components/Icon/icons";
import type { IconName } from "@/components/Icon/types";
import { SERVICE_EMOJI_ICONS } from "@/constants/barber";
import type { Service } from "@/types/barber";

/** Ícone do serviço; emojis antigos são convertidos e valores desconhecidos viram tesoura. */
export function serviceIconName(service: Pick<Service, "icon"> | undefined): IconName {
  const icon = service?.icon;
  if (icon && SERVICE_EMOJI_ICONS[icon]) return SERVICE_EMOJI_ICONS[icon];
  return isIconName(icon) ? icon : "scissors";
}
