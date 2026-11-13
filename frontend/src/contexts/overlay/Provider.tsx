import { useCallback, useMemo, useState, type ReactNode } from "react";
import { OverlayContext, type OverlayValue } from "./context";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Modal } from "@/components/Modal";
import { PhotoZoom } from "@/components/PhotoZoom";

type Layer = { kind: "modal" | "busy" | "photo" | "custom"; node: ReactNode } | null;

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [layer, setLayer] = useState<Layer>(null);
  const closeModal = useCallback(() => setLayer(null), []);

  const openModal = useCallback(
    (title: string, body: ReactNode) =>
      setLayer({
        kind: "modal",
        node: (
          <Modal title={title} onClose={closeModal}>
            {body}
          </Modal>
        ),
      }),
    [closeModal],
  );
  const showBusy = useCallback(
    (title: string, subtitle: string) =>
      setLayer({ kind: "busy", node: <LoadingOverlay title={title} subtitle={subtitle} /> }),
    [],
  );
  const showPhoto = useCallback(
    (src: string, name: string) =>
      setLayer({ kind: "photo", node: <PhotoZoom src={src} name={name} onClose={closeModal} /> }),
    [closeModal],
  );
  const show = useCallback((node: ReactNode) => setLayer({ kind: "custom", node }), []);

  const value = useMemo<OverlayValue>(
    () => ({
      content: layer?.node ?? null,
      isOpen: !!layer,
      isPhotoOpen: layer?.kind === "photo",
      openModal,
      showBusy,
      showPhoto,
      show,
      closeModal,
    }),
    [layer, openModal, showBusy, showPhoto, show, closeModal],
  );
  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
}
