import { css } from "styled-components";

/**
 * Estilos de página Admin/Notices (.notice-row, .admin).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const noticesStyles = css`
  .notice-row {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    align-items: center;
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 10px;
    background: #1b1c1e;
  }
  .notice-row p {
    margin: 5px 0;
    color: var(--muted);
    font-size: 12px;
  }
  @media (max-width: 700px) {
    .notice-row {
      align-items: start;
    }
  }
  body.theme-light .notice-row {
    background: #faf7f1;
    border-color: #e6dfd1;
    color: #1d1b17;
  }
  .admin .notice-row {
    transition:
      background-color var(--bf-motion-soft) ease,
      border-color var(--bf-motion-soft) ease,
      box-shadow 320ms ease,
      transform 320ms var(--bf-motion-ease);
  }
  @media (hover: hover) and (pointer: fine) {
    .admin .notice-row:hover {
      transform: translate3d(0, -2px, 0);
      box-shadow: 0 9px 24px rgba(0, 0, 0, 0.09);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .admin .notice-row {
      transition: none !important;
    }
  }
`;
