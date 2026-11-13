import type { ReactNode } from "react";

interface LoadingOverlayProps {
  title: string;
  subtitle: string;
}

/** Camada de espera com indicador giratório (login, confirmação de reserva, recuperação de senha). */
export function LoadingOverlay({ title, subtitle }: LoadingOverlayProps) {
  return (
    <ConfirmLayer role="status">
      <div className="spinner"></div>
      <h2>{title}</h2>
      <p className="muted">{subtitle}</p>
    </ConfirmLayer>
  );
}

interface ConfirmLayerProps {
  role: "status" | "dialog";
  children: ReactNode;
}

/** Cartão centralizado sobre a página, usado pela espera e pela confirmação de agendamento. */
export function ConfirmLayer({ role, children }: ConfirmLayerProps) {
  return (
    <div className="confirm-layer">
      {role === "status" ? (
        <div className="confirm-card" role="status" aria-live="polite">
          {children}
        </div>
      ) : (
        <div className="confirm-card" role="dialog" aria-modal="true">
          {children}
        </div>
      )}
    </div>
  );
}
