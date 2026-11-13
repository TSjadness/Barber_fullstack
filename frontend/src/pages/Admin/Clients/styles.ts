import { css } from "styled-components";

/**
 * Estilos de página Admin/Clients (.admin, .bf-client-filter, .filter-actions, .filter-clear).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const clientsStyles = css`
  @media (max-width: 760px) {
    .admin .bf-client-filter > .filter-actions {
      grid-column: 1 / -1;
      display: block;
      width: 100%;
      min-width: 0;
    }
    .admin .bf-client-filter > .filter-actions > .filter-clear {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-width: 0;
      min-height: 42px;
    }
  }
`;
