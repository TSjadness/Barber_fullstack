import { phoneIntl } from "@/utils/format";
import { shortDate } from "@/utils/date";

/** Motivo da recusa por limite de reservas, informado pelo servidor. */
export type LimitReason = "phone" | "ip";

/** Título do modal exibido para cada motivo. */
export const LIMIT_TITLE: Record<LimitReason, string> = {
  phone: "Limite de agendamentos atingido",
  ip: "Limite de reservas atingido",
};

export const isLimitReason = (value: unknown): value is LimitReason =>
  value === "phone" || value === "ip";

export interface LimitRequest {
  customer: string;
  services: string[];
  date: string | null;
  time: string | null;
  staffName?: string | undefined;
}

/** "Corte masculino + Barba em 04/03/2031 às 10:00 com Rafael". */
function describe({ services, date, time, staffName }: LimitRequest) {
  const parts = [services.join(" + ") || "um horário"];
  if (date) parts.push(`em ${shortDate(date)}`);
  if (time) parts.push(`às ${time}`);
  if (staffName) parts.push(`com ${staffName}`);
  return parts.join(" ");
}

/** Mensagem pré-preenchida no WhatsApp da barbearia, com os dados do pedido recusado. */
export function limitWhatsAppText(reason: LimitReason, request: LimitRequest) {
  const hello = request.customer.trim() ? `Olá! Sou ${request.customer.trim()}.` : "Olá!";
  const intro =
    reason === "phone"
      ? "Já tenho dois agendamentos ativos e gostaria de realizar mais um"
      : "Tentei agendar pelo site, mas atingi o limite de reservas por agora. Gostaria de marcar";
  return `${hello} ${intro}: ${describe(request)}. Poderiam verificar a disponibilidade para mim?`;
}

/** Link do WhatsApp da barbearia com a mensagem; vazio se o número não estiver cadastrado. */
export function limitWhatsAppLink(shopWhatsapp: unknown, text: string) {
  const number = phoneIntl(shopWhatsapp);
  return number.length >= 12 ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : "";
}
