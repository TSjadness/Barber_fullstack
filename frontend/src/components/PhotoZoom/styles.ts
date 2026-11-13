import { css } from "styled-components";

/**
 * Estilos de PhotoZoom (.photo-zoom, .photo-zoom-close).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const photoZoomStyles = css`
  .photo-zoom {
    position: fixed;
    inset: 0;
    z-index: 260;
    background: #050505ee;
    backdrop-filter: blur(8px);
    display: grid;
    place-items: center;
    padding: 24px;
    cursor: zoom-out;
    animation: showUp 0.2s ease-out;
  }
  .photo-zoom figure {
    margin: 0;
    cursor: default;
    text-align: center;
  }
  .photo-zoom img {
    max-width: min(92vw, 720px);
    max-height: 80vh;
    border-radius: 6px;
    border: 1px solid #3d3527;
    object-fit: contain;
    display: block;
  }
  .photo-zoom figcaption {
    margin-top: 14px;
    font:
      600 18px Outfit,
      sans-serif;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold2);
  }
  .photo-zoom-close {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border: 1px solid #3a3631;
    border-radius: 3px;
    background: #17181b;
    color: var(--text);
  }
  .photo-zoom-close:hover {
    border-color: var(--gold);
    color: var(--gold2);
  }
`;
