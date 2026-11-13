/** Tela principal exibida dentro de `#app`. */
export type View = "public" | "booking" | "admin";

/** Modo do formulário de acesso à gestão. */
export type AuthMode = "login" | "forgot" | "reset";

/**
 * Tela inicial pedida pela rota: `public` (/), `admin` (/login) ou `reset-link`
 * (link de recuperação de senha do Supabase, com `type=recovery` na URL).
 */
export type StartView = "public" | "admin" | "reset-link";

export type AdminSection =
  | "overview"
  | "agenda"
  | "calendar"
  | "bookings"
  | "clients"
  | "finance"
  | "services"
  | "staff"
  | "hours"
  | "notices"
  | "settings";

export type Theme = "dark" | "light";

/** Seções com listagem paginada. */
export type PagedSection = "bookings" | "clients" | "services" | "staff" | "notices";

export interface BookingFilters {
  date: string;
  service: string;
  staff: string;
  name: string;
  status: string;
}

export interface ClientFilters {
  name: string;
  staff: string;
}

/** Linha consolidada da aba Clientes. */
export interface ClientSummary {
  /** Chave do cliente: nome sem espaços nas pontas, em minúsculas. */
  key: string;
  name: string;
  phone: string;
  count: number;
  spent: number;
  last: string;
}
