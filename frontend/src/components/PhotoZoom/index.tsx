import { Icon } from "@/components/Icon";

interface PhotoZoomProps {
  src: string;
  name: string;
  onClose: () => void;
}

/** Foto do profissional ampliada; fecha ao clicar fora, no botão ou com Esc. */
export function PhotoZoom({ src, name, onClose }: PhotoZoomProps) {
  return (
    <div className="photo-zoom" onClick={onClose} role="dialog" aria-modal="true" aria-label={name}>
      <button className="photo-zoom-close" onClick={onClose} aria-label="Fechar">
        <Icon name="x" />
      </button>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={name} />
        <figcaption>{name}</figcaption>
      </figure>
    </div>
  );
}
