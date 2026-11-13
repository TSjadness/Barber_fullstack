import { css } from "styled-components";

/**
 * Estilos de PageHead (.page-head, .head-actions, .eyebrow, .bf-finance-actions, .admin, .bf-today-btn, .btn, .ghost, .bf-calendar-actions).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const pageHeadStyles = css`
  .page-head {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 27px;
  }
  .page-head h1 {
    font-size: 32px;
    letter-spacing: -1px;
    margin-bottom: 6px;
  }
  .head-actions {
    display: flex;
    align-items: center;
    gap: 9px;
    flex-wrap: wrap;
  }
  @media (max-width: 700px) {
    .page-head h1 {
      font-size: 27px;
    }
  }
  .page-head h1 {
    font-size: 37px;
    font-weight: 700;
  }
  .page-head .eyebrow {
    color: #d6a956;
  }
  .page-head {
    margin-bottom: 27px;
  }
  @media (max-width: 760px) {
    .page-head h1 {
      font-size: 30px;
    }
    .bf-finance-actions {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 10px;
      width: 100%;
    }
    .admin .bf-finance-actions {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) !important;
      width: 100%;
      gap: 9px;
    }
  }
  .admin .bf-today-btn,
  .admin .btn.ghost.bf-today-btn {
    background: #3d3020;
    border: 1px solid #ad8344;
    color: #f3cb86;
    font-weight: 800;
    opacity: 1;
  }
  .admin .bf-today-btn:hover:not(:disabled),
  .admin .btn.ghost.bf-today-btn:hover:not(:disabled) {
    background: #574127;
    border-color: #d6ac62;
    color: #fff2d6;
  }
  body.theme-light .admin .bf-today-btn,
  body.theme-light .admin .btn.ghost.bf-today-btn {
    background: #f3e3c6;
    border-color: #c69a54;
    color: #744713;
  }
  body.theme-light .admin .bf-today-btn:hover:not(:disabled),
  body.theme-light .admin .btn.ghost.bf-today-btn:hover:not(:disabled) {
    background: #e9cf9d;
    border-color: #b58338;
    color: #51330c;
  }
  @media (min-width: 761px) {
    .admin .bf-calendar-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      width: min(100%, 375px);
    }
  }
  @media (max-width: 760px) {
    .admin .bf-calendar-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
      gap: 9px;
    }
  }
`;
