import { css } from "styled-components";

/**
 * Estilos de página Login (.auth-link, .auth-row, .auth-card, .forms).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const loginStyles = css`
  .auth-link {
    background: none;
    border: 0;
    color: var(--gold);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 6px 0;
    margin-top: 14px;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .auth-link:hover {
    opacity: 0.8;
  }
  .auth-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .auth-card h1 {
    font: 700 30px Outfit;
    margin: 12px 0 8px !important;
  }
  .auth-card .forms {
    margin-top: 16px;
  }
  .auth-link {
    border-radius: 12px;
  }
  .auth-card h1 {
    font-family:
      "Manrope",
      -apple-system,
      BlinkMacSystemFont,
      sans-serif !important;
  }
`;
