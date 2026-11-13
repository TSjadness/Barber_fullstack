import { apiRequest, ApiError } from "./api";
import type { NewBookingPayload } from "./api";
import type { Booking } from "@/types/barber";

/** Reserva feita pelo cliente no site público; o servidor confere o horário antes de gravar. */
export async function createPublicBooking(payload: NewBookingPayload): Promise<Booking> {
  const data = await apiRequest("/bookings", { method: "POST", body: JSON.stringify(payload) });
  const booking =
    data && typeof data === "object" ? (data as Record<string, unknown>)["booking"] : null;
  if (!booking || typeof booking !== "object") throw new ApiError("Resposta inválida do servidor.");
  return booking as Booking;
}
