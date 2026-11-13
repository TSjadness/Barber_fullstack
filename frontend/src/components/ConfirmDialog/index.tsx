import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import type { IconName } from "@/components/Icon/types";

export interface ConfirmDialogProps {
  /** Frase principal (ex.: "<b>Nome</b> será removido da equipe."). */
  message: ReactNode;
  /** Explicação das consequências, em texto secundário. */
  detail?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: IconName;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Confirmação padrão das ações destrutivas da gestão (exclusões, cancelamentos e
 * substituições). Visual herdado da confirmação de remoção de profissional.
 */
export function ConfirmDialog({
  message,
  detail,
  confirmLabel = "Confirmar exclusão",
  cancelLabel = "Cancelar",
  icon = "trash",
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <div className="bf-confirm-delete" role="alertdialog" aria-describedby="bfConfirmMessage">
      <div className="bf-confirm-delete-icon" aria-hidden="true">
        <Icon name={icon} size="ic-lg" />
      </div>
      <p id="bfConfirmMessage">{message}</p>
      {detail && <p className="muted">{detail}</p>}
      <div className="form-actions bf-confirm-delete-actions">
        <button type="button" className="btn ghost" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="button" className="btn danger" onClick={onConfirm}>
          <Icon name={icon} /> {confirmLabel}
        </button>
      </div>
    </div>
  );
}
