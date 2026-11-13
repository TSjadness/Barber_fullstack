import { BOOKING_STATUS_LABEL } from "@/constants/barber";

interface StatusBadgeProps {
  status: string;
  /** Rótulos próprios da tela; por padrão usa os nomes dos status. */
  labels?: Readonly<Record<string, string>>;
}

/** Selo colorido com o status do agendamento. */
export function StatusBadge({ status, labels = BOOKING_STATUS_LABEL }: StatusBadgeProps) {
  return <span className={`status ${status}`}>{labels[status] || status}</span>;
}
