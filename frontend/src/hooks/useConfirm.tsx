import { useCallback } from "react";
import { ConfirmDialog, type ConfirmDialogProps } from "@/components/ConfirmDialog";
import { useOverlay } from "@/hooks/useOverlay";

export interface ConfirmOptions extends Omit<ConfirmDialogProps, "onCancel" | "onConfirm"> {
  /** Título do modal. */
  title: string;
  /** Executado depois que o modal é fechado. */
  onConfirm: () => void;
}

/**
 * Abre o modal de confirmação padrão (substitui `window.confirm`). O modal fecha ao
 * cancelar, ao clicar fora ou ao confirmar; neste caso a ação roda em seguida.
 */
export function useConfirm() {
  const { openModal, closeModal } = useOverlay();
  return useCallback(
    ({ title, onConfirm, ...dialog }: ConfirmOptions) =>
      openModal(
        title,
        <ConfirmDialog
          {...dialog}
          onCancel={closeModal}
          onConfirm={() => {
            closeModal();
            onConfirm();
          }}
        />,
      ),
    [openModal, closeModal],
  );
}
