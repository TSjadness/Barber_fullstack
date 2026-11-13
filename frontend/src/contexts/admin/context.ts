import { createContext } from "react";
import type { BookingFilters, ClientFilters, PagedSection } from "@/types/app";

/**
 * Estado das telas da gestão que deve persistir ao trocar de seção
 * (filtros, páginas, dia da agenda, mês do calendário, profissional selecionado).
 */
export interface AdminStateValue {
  bookingFilters: BookingFilters;
  setBookingFilters: (filters: BookingFilters) => void;
  clientFilters: ClientFilters;
  setClientFilters: (filters: ClientFilters) => void;
  pages: Record<PagedSection, number>;
  setPage: (section: PagedSection, page: number) => void;
  /** Dia exibido na Agenda. */
  agendaDate: string;
  setAgendaDate: (date: string) => void;
  /** `all` ou id do profissional filtrado na Agenda. */
  agendaStaff: string;
  setAgendaStaff: (staffId: string) => void;
  hoursStaff: string | null;
  setHoursStaff: (staffId: string | null) => void;
  expandedHoursDay: number | null;
  setExpandedHoursDay: (day: number | null) => void;
  /** Mês (`AAAA-MM`) e dia selecionados no Calendário geral. */
  calendarMonth: string;
  setCalendarMonth: (month: string) => void;
  calendarDay: string;
  setCalendarDay: (day: string) => void;
}

export const AdminStateContext = createContext<AdminStateValue | null>(null);

export const emptyBookingFilters = (): BookingFilters => ({
  date: "",
  service: "",
  staff: "",
  name: "",
  status: "",
});

export const emptyClientFilters = (): ClientFilters => ({ name: "", staff: "" });
