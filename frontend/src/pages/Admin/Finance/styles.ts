import { css } from "styled-components";

/**
 * Estilos de página Admin/Finance (.stats, .stat, .two-cols, .bar-chart, .bar, .premium-finance, .head-actions, .finance-page, .btn).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const financeStyles = css`
  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 26px;
  }
  .stat {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 20px;
  }
  .stat small {
    color: var(--muted);
    font-size: 12px;
  }
  .stat strong {
    display: block;
    font:
      700 29px Outfit,
      sans-serif;
    margin: 9px 0 3px;
  }
  .stat span {
    font-size: 11px;
    color: var(--gold);
  }
  .two-cols {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 18px;
  }
  .bar-chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    gap: 12px;
    height: 190px;
    border-bottom: 1px solid #36383a;
    padding-top: 10px;
  }
  .bar {
    background: linear-gradient(0deg, #9d7739, #ecc781);
    width: 35px;
    min-height: 5px;
    border-radius: 6px 6px 0 0;
    position: relative;
  }
  .bar span {
    position: absolute;
    bottom: -27px;
    left: 50%;
    transform: translateX(-50%);
    color: var(--muted);
    font-size: 11px;
  }
  @media (max-width: 950px) {
    .stats {
      grid-template-columns: repeat(2, 1fr);
    }
    .two-cols {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 700px) {
    .stat {
      padding: 14px;
    }
    .stat strong {
      font-size: 23px;
    }
  }
  @media (max-width: 420px) {
    .stats {
      gap: 8px;
    }
    .stat {
      padding: 12px;
    }
  }
  .stat {
    box-shadow: 0 8px 25px #0001;
  }
  body.theme-light .stat {
    background: #fff;
    border-color: #e2dccf;
    color: #1d1b17;
    box-shadow: 0 4px 18px #5a46200d;
  }
  body.theme-light .stat span {
    color: #8a6020;
  }
  .stat {
    transition:
      background-color 0.25s,
      color 0.25s,
      border-color 0.25s;
  }
  body.theme-light .bar {
    background: linear-gradient(0deg, #b8862f, #e2bd74) !important;
    box-shadow: none;
  }
  .stat small {
    font-size: 13.5px;
  }
  .stat span {
    font-size: 13px;
  }
  @media (max-width: 760px) {
    .premium-finance .head-actions,
    .finance-page .head-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 9px;
      width: 100%;
    }
    .premium-finance .head-actions .btn,
    .finance-page .head-actions .btn {
      width: 100%;
      min-width: 0;
      white-space: normal;
      min-height: 44px;
      justify-content: center;
      text-align: center;
    }
  }
`;
