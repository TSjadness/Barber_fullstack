import type { IconName } from "@/components/Icon/types";
import type { AdminSection, PagedSection } from "@/types/app";
import type { BookingStatus } from "@/types/barber";

export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

export const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

export const WEEKDAYS_LONG = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const;

export const DEFAULT_SHOP_NAME = "Barbearia - Rafael Úzeda";

export const LOGO_SRC = "/assets/images/logo_rafael_uzeda.png";

/** Ícones disponíveis no cadastro de serviço. */
export const SERVICE_ICON_OPTIONS: ReadonlyArray<readonly [IconName, string]> = [
  ["scissors", "Tesoura"],
  ["brush", "Pincel"],
  ["combo", "Corte + barba"],
  ["spray", "Finalização"],
  ["star", "Destaque"],
];

/** Emojis usados por registros antigos de serviço, convertidos para ícones. */
export const SERVICE_EMOJI_ICONS: Readonly<Record<string, IconName>> = {
  "✂️": "scissors",
  "✂": "scissors",
  "🪒": "brush",
  "💈": "combo",
  "✨": "spray",
};

export const BOOKING_STATUS_OPTIONS: ReadonlyArray<readonly [BookingStatus, string]> = [
  ["pendente", "Pendente"],
  ["confirmado", "Confirmado"],
  ["concluido", "Concluído"],
  ["cancelado", "Cancelado"],
];

export const BOOKING_STATUS_LABEL: Readonly<Record<string, string>> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

/** Classe visual de um agendamento no calendário e na agenda. */
export const BOOKING_TONE: Readonly<Record<string, "done" | "pending">> = {
  concluido: "done",
  pendente: "pending",
};

export const PAYMENT_METHODS = [
  "Pix",
  "Dinheiro",
  "Cartão de crédito",
  "Cartão de débito",
] as const;

export const PAGE_SIZE = 10;

export const PAGED_SECTIONS: readonly PagedSection[] = [
  "bookings",
  "clients",
  "services",
  "staff",
  "notices",
];

export const ADMIN_MENU: ReadonlyArray<readonly [AdminSection, IconName, string]> = [
  ["overview", "layout", "Visão geral"],
  ["agenda", "calendar", "Agenda"],
  ["calendar", "calendarRange", "Calendário"],
  ["bookings", "list", "Agendamentos"],
  ["clients", "users", "Clientes"],
  ["finance", "wallet", "Financeiro"],
  ["services", "scissors", "Serviços"],
  ["staff", "userCog", "Profissionais"],
  ["hours", "clock", "Horários da semana"],
  ["notices", "flag", "Avisos e bloqueios"],
  ["settings", "settings", "Configurações"],
];

/** Largura máxima (px) considerada mobile pelo layout. */
export const MOBILE_QUERY = "(max-width: 760px)";

export const STORAGE_KEYS = {
  theme: "barberTheme",
  sidebar: "barberSide",
  mockToken: "barberflow_mock_token",
} as const;
