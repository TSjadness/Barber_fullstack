import type { BookingFlow, BookingStep } from "@/types/barber";

/** Props comuns aos passos do agendamento. */
export interface StepProps {
  flow: BookingFlow;
  setFlow: (patch: Partial<BookingFlow>) => void;
  goToStep: (step: BookingStep) => void;
}
