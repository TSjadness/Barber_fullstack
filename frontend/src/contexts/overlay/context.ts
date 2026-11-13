import { createContext, type ReactNode } from "react";

/**
 * Camada única sobre a página (`#overlay`): modais, telas de carregamento,
 * confirmações e a foto ampliada do profissional. Abrir algo substitui o que
 * estava aberto, como no comportamento original.
 */
export interface OverlayValue {
  content: ReactNode;
  isOpen: boolean;
  isPhotoOpen: boolean;
  openModal: (title: string, body: ReactNode) => void;
  showBusy: (title: string, subtitle: string) => void;
  showPhoto: (src: string, name: string) => void;
  /** Exibe um conteúdo próprio (ex.: confirmação de agendamento). */
  show: (content: ReactNode) => void;
  closeModal: () => void;
}

export const OverlayContext = createContext<OverlayValue | null>(null);
