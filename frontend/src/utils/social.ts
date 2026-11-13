import { phoneIntl } from "./format";
import type { IconName } from "@/components/Icon/types";
import type { Shop } from "@/types/barber";

export type SocialKind = "instagram" | "facebook";

/** Link seguro da rede social: aceita @usuario, usuario ou URL http(s); qualquer outra coisa é ignorada. */
export function socialUrl(kind: SocialKind, raw: unknown) {
  const v = String(raw || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return "";
  if (/^(www\.|m\.)?(instagram|facebook|fb)\.com\//i.test(v)) return "https://" + v;
  const handle = v
    .replace(/^@/, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\s+/g, "");
  if (!handle) return "";
  return (kind === "instagram" ? "https://instagram.com/" : "https://facebook.com/") + handle;
}

export interface SocialLink {
  icon: IconName;
  label: string;
  href: string;
}

/** Redes preenchidas nas configurações (o WhatsApp usa o número da barbearia). */
export function socialLinksOf(shop: Shop): SocialLink[] {
  const wa = phoneIntl(shop.whatsapp);
  const items: SocialLink[] = [
    { icon: "whatsapp", label: "WhatsApp", href: wa ? "https://wa.me/" + wa : "" },
    { icon: "instagram", label: "Instagram", href: socialUrl("instagram", shop.instagram) },
    { icon: "facebook", label: "Facebook", href: socialUrl("facebook", shop.facebook) },
  ];
  return items.filter((i) => i.href);
}
