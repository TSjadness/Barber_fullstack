import { css } from "styled-components";

/**
 * Estilos de SummaryBox (.summary-box, .confirm-card).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const summaryBoxStyles = css`
  .summary-box {
    background: #242321;
    border: 1px solid #53452e;
    padding: 20px;
    border-radius: 14px;
    display: grid;
    gap: 9px;
  }
  .confirm-card .summary-box {
    text-align: left;
    margin: 18px 0 22px;
  }
  .summary-box span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  body.theme-light .summary-box {
    background: #faf7f1;
    border-color: #e6dfd1;
    color: #1d1b17;
  }
`;
