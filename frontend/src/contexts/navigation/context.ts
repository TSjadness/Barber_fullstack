import { createContext } from "react";
import type { AdminSection, AuthMode, StartView, View } from "@/types/app";
import type { BookingFlow, BookingStep } from "@/types/barber";

/** Ponto de partida do fluxo de agendamento (definido pelo botão que o iniciou). */
export interface BookingEntry {
  flow: BookingFlow;
  step: BookingStep;
  /** Muda a cada novo início para recriar o fluxo do zero. */
  id: number;
}

/** Tela atual, seção da gestão, modo do login e menu mobile. */
export interface NavigationValue {
  view: View;
  section: AdminSection;
  authMode: AuthMode;
  resetEmail: string;
  startView: StartView;
  bookingEntry: BookingEntry;
  /** Mês exibido no calendário do agendamento (`AAAA-MM`). */
  bookingMonth: string;
  mobileMenuOpen: boolean;
  /** Troca de tela, fecha o menu mobile e volta ao topo. */
  go: (view: View) => void;
  setView: (view: View) => void;
  setSection: (section: AdminSection) => void;
  setAuthMode: (mode: AuthMode) => void;
  setResetEmail: (email: string) => void;
  setStartView: (view: StartView) => void;
  setBookingMonth: (month: string) => void;
  /** Novo agendamento a partir do passo 1 (serviço). */
  newBooking: () => void;
  /** Agendamento de um serviço específico, começando pela escolha do profissional. */
  startBooking: (serviceId: string) => void;
  /** Agendamento com um profissional já escolhido. */
  chooseProfessional: (staffId: string) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const NavigationContext = createContext<NavigationValue | null>(null);

export const emptyFlow = (patch: Partial<BookingFlow> = {}): BookingFlow => ({
  serviceIds: [],
  staffId: null,
  date: null,
  time: null,
  confirmStaff: null,
  customer: "",
  phone: "",
  ...patch,
});
