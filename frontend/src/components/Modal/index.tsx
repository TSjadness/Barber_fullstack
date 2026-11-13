import type { ModalProps } from "./types";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

/** Diálogo sobre a página; fecha ao clicar fora ou no botão de fechar. */
export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <Button small variant="ghost" onClick={onClose} aria-label="Fechar">
            <Icon name="x" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
