import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  AdminStateContext,
  emptyBookingFilters,
  emptyClientFilters,
  type AdminStateValue,
} from "./context";
import type { PagedSection } from "@/types/app";
import { todayIso } from "@/utils/date";

const firstPages = (): Record<PagedSection, number> => ({
  bookings: 1,
  clients: 1,
  services: 1,
  staff: 1,
  notices: 1,
});

export function AdminStateProvider({ children }: { children: ReactNode }) {
  const [bookingFilters, setBookingFilters] = useState(emptyBookingFilters);
  const [clientFilters, setClientFilters] = useState(emptyClientFilters);
  const [pages, setPages] = useState(firstPages);
  const [agendaDate, setAgendaDate] = useState(todayIso);
  const [agendaStaff, setAgendaStaff] = useState("all");
  const [hoursStaff, setHoursStaff] = useState<string | null>(null);
  const [expandedHoursDay, setExpandedHoursDay] = useState<number | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => todayIso().slice(0, 7));
  const [calendarDay, setCalendarDay] = useState(todayIso);

  const setPage = useCallback(
    (section: PagedSection, page: number) =>
      setPages((current) => ({ ...current, [section]: Math.max(1, Math.floor(page)) })),
    [],
  );

  const value = useMemo<AdminStateValue>(
    () => ({
      bookingFilters,
      setBookingFilters,
      clientFilters,
      setClientFilters,
      pages,
      setPage,
      agendaDate,
      setAgendaDate,
      agendaStaff,
      setAgendaStaff,
      hoursStaff,
      setHoursStaff,
      expandedHoursDay,
      setExpandedHoursDay,
      calendarMonth,
      setCalendarMonth,
      calendarDay,
      setCalendarDay,
    }),
    [
      bookingFilters,
      clientFilters,
      pages,
      setPage,
      agendaDate,
      agendaStaff,
      hoursStaff,
      expandedHoursDay,
      calendarMonth,
      calendarDay,
    ],
  );
  return <AdminStateContext.Provider value={value}>{children}</AdminStateContext.Provider>;
}
