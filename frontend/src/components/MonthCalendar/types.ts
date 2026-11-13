import type { DayAvailability } from "@/types/barber";

export interface MonthCalendarProps {
  /** Mês exibido (`AAAA-MM`). */
  month: string;
  today: string;
  selected: string | null;
  availabilityOf: (date: string) => DayAvailability;
  onMonthChange: (month: string) => void;
  onSelect: (date: string) => void;
}
