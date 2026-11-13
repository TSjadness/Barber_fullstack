import { css } from "styled-components";

/**
 * Estilos de DataTable (.tablewrap, .table).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const dataTableStyles = css`
  .tablewrap {
    overflow-x: auto;
  }
  .table {
    border-collapse: collapse;
    width: 100%;
    min-width: 510px;
  }
  .table th {
    text-align: left;
    color: var(--muted);
    font-size: 11px;
    font-weight: 700;
    padding: 12px 10px;
    border-bottom: 1px solid var(--line);
  }
  .table td {
    padding: 13px 10px;
    border-bottom: 1px solid #2c2d30;
    font-size: 12px;
  }
  .table tr:last-child td {
    border-bottom: none;
  }
  body.theme-light .table th {
    color: #6f6a60;
    border-color: #e2dccf;
  }
  body.theme-light .table td {
    border-color: #eee8dc;
    color: #1d1b17;
  }
  .table th {
    font-size: 13px;
  }
  .table td {
    font-size: 14px;
  }
`;
