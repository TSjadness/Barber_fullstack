export type DayMode = "default" | "custom" | "closed";

export interface DaySchedule {
  mode: DayMode;
  start?: string;
  end?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  icon?: string;
  active: boolean;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  start: string;
  end: string;
  days: number[];
  active: boolean;
  photo?: string;
  owner?: boolean;
  weekly?: Record<string, DaySchedule>;
}

export type BookingStatus = "pendente" | "confirmado" | "concluido" | "cancelado";

export interface Booking {
  id: string;
  date: string;
  time: string;
  customer: string;
  phone: string;
  serviceId: string;
  serviceIds?: string[];
  staffId: string;
  status: BookingStatus;
  paid: boolean;
  paymentMethod: string | null;
  createdAt?: string;
}

export interface Notice {
  id: string;
  date: string;
  staffId: string;
  type: "block" | "info";
  title: string;
  detail: string;
}

export interface Shop {
  name: string;
  tagline: string;
  whatsapp: string;
  address: string;
  phone?: string;
  instagram?: string;
}

export interface DB {
  shop: Shop;
  services: Service[];
  staff: Staff[];
  bookings: Booking[];
  notices: Notice[];
  payments: unknown[];
}

export type View = "public" | "booking" | "admin";

export type AdminSection =
  | "overview"
  | "agenda"
  | "bookings"
  | "clients"
  | "finance"
  | "services"
  | "staff"
  | "hours"
  | "notices"
  | "settings";

export interface NewBooking {
  date: string;
  time: string;
  customer: string;
  phone: string;
  serviceId: string;
  serviceIds: string[];
  staffId: string;
}

/** "any" = sem preferência de profissional. */
export type StaffChoice = string | "any";

export type MockDatabase = DB;
