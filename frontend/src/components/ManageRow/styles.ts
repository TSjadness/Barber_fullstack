import { css } from "styled-components";

/**
 * Estilos de ManageRow (.manage-row).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const manageRowStyles = css`
  .manage-row {
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
  .manage-row p {
    margin: 5px 0;
    color: var(--muted);
    font-size: 12px;
  }
  @media (max-width: 700px) {
    .manage-row {
      align-items: start;
    }
  }
  body.theme-light .manage-row {
    background: #faf7f1;
    border-color: #e6dfd1;
    color: #1d1b17;
  }
  .manage-row p {
    font-size: 14px;
  }
`;
