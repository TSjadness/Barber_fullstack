import { css } from "styled-components";

/**
 * Estilos de Form (.forms, .form-row, .toggle, .form-actions).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const formStyles = css`
  .forms {
    display: grid;
    gap: 14px;
  }
  .form-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .toggle {
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .toggle input {
    accent-color: var(--gold);
    width: 17px;
    height: 17px;
  }
  @media (max-width: 700px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
  .form-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .forms input,
  .forms textarea,
  .forms select {
    transition:
      border-color 240ms ease,
      box-shadow 240ms ease,
      background-color 240ms ease;
  }
  @media (prefers-reduced-motion: reduce) {
    .forms input,
    .forms textarea,
    .forms select {
      transition: none !important;
    }
  }
`;
