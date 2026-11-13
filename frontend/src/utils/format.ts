/** Formatação de valores exibidos na interface. */

export const money = (n: number | string | null | undefined) =>
  Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Remove acentos e caixa para buscas tolerantes. */
export const normalizeSearch = (text: unknown) =>
  String(text || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export const onlyDigits = (value: unknown) => String(value || "").replace(/\D/g, "");

/** Telefone com DDD no formato `(79) 99999-9999`; sem número, `Sem telefone`. */
export const phoneLabel = (raw: unknown) => {
  const d = onlyDigits(raw);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return d || "Sem telefone";
};

/** Número com DDI 55 (ex.: 5579999999999) ou só com DDD, no formato (79) 99999-9999. */
export const phonePretty = (raw: unknown) => {
  let d = onlyDigits(raw);
  if (d.length >= 12 && d.startsWith("55")) d = d.slice(2);
  return phoneLabel(d);
};

/** Dígitos com DDI 55, prontos para wa.me e tel:. */
export const phoneIntl = (raw: unknown) => {
  const d = onlyDigits(raw);
  return d.length === 10 || d.length === 11 ? "55" + d : d;
};

/** Máscara progressiva do WhatsApp digitado pelo cliente: `(79) 99999-9999`. */
export function maskPhoneInput(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (!digits.length) return "";
  if (digits.length <= 2) return `(${digits}`;
  const split = digits.length > 10 ? 7 : 6;
  const tail = digits.length > split ? "-" + digits.slice(split) : "";
  return `(${digits.slice(0, 2)}) ${digits.slice(2, split)}${tail}`;
}

/** Mantém apenas letras, espaços, apóstrofo e hífen no nome do cliente. */
export const sanitizePersonName = (value: string) =>
  value.replace(/[^\p{L}\p{M}\s'-]/gu, "").replace(/\s{2,}/g, " ");

/** Nome e sobrenome com pelo menos duas letras cada. */
export const isFullName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 && parts.every((p) => /^[\p{L}\p{M}'-]{2,}$/u.test(p));
};

/** Inicial exibida no avatar sem foto. */
export const initialOf = (name: string | undefined) => (name || "?")[0] ?? "?";

/** Identificador curto para novos registros. */
export const uid = () => Math.random().toString(36).slice(2, 10);
