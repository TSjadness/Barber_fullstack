import { BOOKING_TONE } from "@/constants/barber";

/** Classe de cor do agendamento na agenda e no calendário (`done`, `pending` ou `scheduled`). */
export const bookingTone = (status: string) => BOOKING_TONE[status] || "scheduled";
