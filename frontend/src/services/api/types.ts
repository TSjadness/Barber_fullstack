/** Rotas lógicas da API usadas pela aplicação (mesmas nos modos mock e Supabase). */
export type ApiRoute =
  "/public" | "/admin/state" | "/bookings" | "/login" | "/logout" | "/forgot" | "/reset";

export type HttpMethod = "GET" | "POST" | "PUT";

export interface ApiRequest {
  method?: HttpMethod;
  /** Corpo já serializado em JSON. */
  body?: string;
}

export interface LoginResponse {
  token: string;
  user: { email: string | undefined; role: string };
}

export interface OkResponse {
  ok: true;
  message?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPayload {
  email: string;
  code: string;
  password: string;
}

export interface NewBookingPayload {
  date: string;
  time: string;
  customer: string;
  phone: string;
  serviceId: string;
  serviceIds: string[];
  staffId: string;
}
