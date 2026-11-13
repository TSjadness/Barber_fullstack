/**
 * Contratos de dados da barbearia.
 *
 * Estes formatos são persistidos como JSON (SQLite local e Supabase) e trocados com a API;
 * por isso os nomes das propriedades não podem ser alterados.
 */

export type BookingStatus = "pendente" | "confirmado" | "concluido" | "cancelado";

export interface Shop {
  name: string;
  tagline: string;
  whatsapp: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
  address: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  /** Chave de ícone (`scissors`, `brush`...) ou emoji legado (`✂️`, `🪒`...). */
  icon?: string;
  active: boolean;
}

export type DayMode = "default" | "custom" | "closed";

export interface DaySchedule {
  mode: DayMode;
  start?: string;
  end?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  start: string;
  end: string;
  /** Dias da semana atendidos (0 = domingo). */
  days: number[];
  active: boolean;
  photo?: string;
  owner?: boolean;
  /** Ajustes por dia da semana; a chave é o índice do dia (0-6). */
  weekly?: Record<string, DaySchedule>;
}

export interface Booking {
  id: string;
  date: string;
  time: string;
  customer: string;
  phone: string;
  /** Primeiro serviço; mantido para registros antigos de serviço único. */
  serviceId: string;
  serviceIds?: string[];
  staffId: string;
  status: BookingStatus | string;
  paid: boolean;
  paymentMethod: string | null;
  /**
   * Cliente excluído pela gestão: nome e telefone foram apagados (anonimização) e o
   * registro fica só para o histórico de agenda e financeiro.
   */
  anonymized?: boolean;
}

export type NoticeType = "block" | "info";

export interface Notice {
  id: string;
  date: string;
  /** Id do profissional ou `all` para a barbearia inteira. */
  staffId: string;
  type: NoticeType | string;
  title: string;
  detail: string;
}

export interface AppState {
  /**
   * Versão do estado na gestão (vem do servidor). Cada gravação a envia e o servidor recusa
   * (409) se outra aba ou aparelho gravou antes. Ausente no site público.
   */
  version?: string;
  shop: Shop;
  services: Service[];
  staff: Staff[];
  notices: Notice[];
  payments: unknown[];
  bookings: Booking[];
}

/** Serviços somados de um agendamento (nome combinado, duração e preço totais). */
export interface ServiceTotal {
  name: string;
  duration: number;
  price: number;
}

/** Horário livre de um profissional, usado na escolha "sem preferência". */
export interface TimeOption {
  time: string;
  staffId: string;
}

export type AvailabilityCode = "available" | "partial" | "full" | "closed";

export interface DayAvailability {
  code: AvailabilityCode;
  label: string;
}

/** Estado do fluxo público de agendamento. */
export interface BookingFlow {
  serviceIds: string[];
  /** Id do profissional, `any` (sem preferência) ou null. */
  staffId: string | null;
  date: string | null;
  time: string | null;
  /** Profissional que realmente atenderá o horário escolhido. */
  confirmStaff: string | null;
  customer: string;
  phone: string;
}

export type BookingStep = 1 | 2 | 3 | 4;
