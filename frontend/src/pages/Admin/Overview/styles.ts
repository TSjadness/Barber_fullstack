import { css } from "styled-components";

/**
 * Estilos de página Admin/Overview (.ov-panel, .overview-kpis, .ov-kpi, .highlight, .kpi-icon, .green, .ov-columns, .ov-panel-head, .next-list, .next-booking, .next-time, .next-name, ...).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const overviewStyles = css`
  .ov-panel {
    box-shadow: 0 8px 25px #0001;
  }
  .overview-kpis {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 23px;
  }
  .ov-kpi {
    min-height: 109px;
    display: flex;
    align-items: center;
    gap: 17px;
    background: linear-gradient(160deg, #242425, #18191b);
    border: 1px solid #434143;
    border-radius: 16px;
    padding: 17px 20px;
  }
  .ov-kpi.highlight {
    border-color: #a77b32;
    background: linear-gradient(130deg, #352a19, #1d1b1a);
    box-shadow: 0 0 16px #be8e3324;
  }
  .ov-kpi .kpi-icon {
    width: 55px;
    height: 55px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: #44331b;
    color: #f6c95f;
    font-size: 29px;
  }
  .ov-kpi .kpi-icon.green {
    background: #193124;
    color: #68d695;
  }
  .ov-kpi strong {
    display: block;
    font:
      700 clamp(21px, 2vw, 30px) Outfit,
      sans-serif;
    white-space: nowrap;
  }
  .ov-kpi span:last-child {
    color: #d1ceca;
    font-size: 13px;
  }
  .ov-columns {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 20px;
  }
  .ov-panel {
    border: 1px solid #414042;
    border-radius: 17px;
    background: linear-gradient(150deg, #242426, #17181a);
    padding: 23px;
    min-width: 0;
  }
  .ov-panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
  }
  .ov-panel-head h2 {
    font-size: 19px;
    margin: 0;
  }
  .next-list {
    display: grid;
  }
  .next-booking {
    width: 100%;
    background: transparent;
    color: inherit;
    border: 0;
    border-top: 1px solid #39383a;
    display: grid;
    grid-template-columns: 77px minmax(110px, 1fr) 90px auto;
    align-items: center;
    gap: 12px;
    text-align: left;
    padding: 13px 2px;
  }
  .next-booking:hover {
    background: #ffffff08;
  }
  .next-time {
    padding: 9px 10px;
    background: #303033;
    border: 1px solid #48484a;
    border-radius: 10px;
    text-align: center;
  }
  .next-name strong,
  .next-name small {
    display: block;
  }
  .next-name small {
    color: #b6b4b1;
    margin-top: 3px;
    font-size: 11px;
  }
  .next-staff {
    font-size: 12px;
  }
  .ov-chart {
    height: 241px;
    display: flex;
    align-items: flex-end;
    gap: 15px;
    padding: 10px 16px 25px;
    border-bottom: 1px solid #424041;
    background: repeating-linear-gradient(to top, transparent 0, transparent 49px, #3d3b3c 50px);
  }
  .ov-bar-col {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    position: relative;
  }
  .ov-bar {
    width: min(45px, 85%);
    min-height: 4px;
    background: linear-gradient(180deg, #ffe08c, #ac7622);
    border-radius: 5px 5px 0 0;
    box-shadow: 0 0 12px #efb94718;
  }
  .ov-bar-col small {
    position: absolute;
    bottom: -22px;
    color: #d6d4d1;
  }
  .ov-bottom {
    display: flex;
    justify-content: space-between;
    align-items: end;
    margin-top: 30px;
    gap: 12px;
  }
  .ov-bottom small,
  .ov-bottom strong {
    display: block;
  }
  .ov-bottom small {
    color: #c3c0bd;
  }
  .ov-bottom strong {
    color: #ffce66;
    font-size: 25px;
    margin-top: 5px;
  }
  .ov-shortcuts {
    margin-top: 24px;
    border: 1px solid #48423a;
    background: linear-gradient(130deg, #242324, #17181a);
    border-radius: 17px;
    padding: 17px 24px;
    display: flex;
    align-items: center;
    gap: 14px;
    justify-content: space-between;
  }
  .ov-shortcuts strong {
    font-size: 18px;
    margin-right: auto;
  }
  .ov-shortcuts .btn {
    min-width: 150px;
  }
  @media (max-width: 1100px) {
    .overview-kpis {
      grid-template-columns: repeat(2, 1fr);
    }
    .ov-columns {
      grid-template-columns: 1fr;
    }
    .ov-shortcuts {
      flex-wrap: wrap;
    }
    .ov-shortcuts strong {
      width: 100%;
    }
  }
  @media (max-width: 760px) {
    .overview-kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .ov-kpi {
      padding: 12px;
      gap: 10px;
    }
    .ov-kpi .kpi-icon {
      width: 34px;
      height: 34px;
      font-size: 19px;
    }
    .ov-kpi span:last-child {
      font-size: 11px;
    }
    .next-booking {
      grid-template-columns: 65px 1fr auto;
    }
    .next-staff {
      display: none;
    }
    .ov-shortcuts .btn {
      flex: 1;
    }
  }
  @media (max-width: 700px) {
    .premium-overview .ov-shortcuts {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: stretch;
      gap: 10px;
    }
    .premium-overview .ov-shortcuts > strong {
      display: block;
      width: 100%;
    }
    .premium-overview .ov-shortcuts > .btn {
      display: flex;
      width: 100%;
      max-width: 100%;
      min-height: 46px;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      text-align: center;
      white-space: normal;
      margin: 0;
    }
  }
  .kpi-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .kpi-icon .ic {
    width: 20px;
    height: 20px;
  }
  .next-staff {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  .ov-panel-head h2 .ic {
    color: var(--gold);
  }
  .ov-panel-head h2 {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ov-panel,
  .ov-kpi {
    transition:
      border-color 0.2s,
      transform 0.2s;
  }
  body.theme-light .ov-panel,
  body.theme-light .ov-kpi,
  body.theme-light [class*="ov-"] {
    background: #fff;
    border-color: #e2dccf;
    color: #1d1b17;
    box-shadow: 0 4px 18px #5a46200d;
  }
  body.theme-light .next-booking {
    background: #faf7f1;
    border-color: #e6dfd1;
    color: #1d1b17;
  }
  body.theme-light .ov-bar {
    background: linear-gradient(0deg, #b8862f, #e2bd74) !important;
    box-shadow: none;
  }
  body.theme-light .ov-bar-col {
    background: transparent;
    box-shadow: none;
    border: 0;
  }
  body.theme-light .next-time {
    background: #f3e6cc;
    color: #6e4c17;
    border-color: #e0c690;
  }
  body.theme-light .ov-kpi span {
    color: #6f6a60;
  }
  .ov-panel,
  .ov-kpi {
    transition:
      transform 330ms var(--motion-smooth),
      border-color 330ms ease,
      box-shadow 330ms ease;
  }
  @media (max-width: 700px) {
    .premium-overview .ov-columns > .ov-panel:first-child {
      min-width: 0;
      padding: 14px 12px;
    }
    .premium-overview .ov-columns > .ov-panel:first-child .ov-panel-head {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 12px;
    }
    .premium-overview .ov-columns > .ov-panel:first-child .ov-panel-head h2 {
      flex: 1 1 auto;
      min-width: 0;
      font-size: 16px;
      line-height: 1.35;
    }
    .premium-overview .ov-columns > .ov-panel:first-child .ov-panel-head .text-action {
      flex: 0 0 auto;
      max-width: 48%;
      font-size: 11px;
      line-height: 1.4;
      white-space: normal;
      text-align: right;
    }
    .premium-overview .next-booking {
      grid-template-columns: 62px minmax(0, 1fr) auto;
      gap: 9px;
      min-width: 0;
      padding: 12px 0;
      align-items: center;
    }
    .premium-overview .next-time {
      padding: 9px 5px;
      font-size: 13px;
      white-space: nowrap;
    }
    .premium-overview .next-name {
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .premium-overview .next-name strong {
      font-size: 12px;
      line-height: 1.35;
    }
    .premium-overview .next-name small {
      font-size: 10px;
      line-height: 1.4;
    }
    .premium-overview .next-staff {
      display: none;
    }
    .premium-overview .next-booking > .status {
      grid-column: 3;
      justify-self: end;
      align-self: center;
      margin: 0;
      white-space: nowrap;
      font-size: 10px;
      padding: 6px 8px;
    }
  }
  body.theme-light .premium-overview .ov-kpi .kpi-icon:not(.green) {
    background: #f7e8c5;
    color: #91631f;
    border: 1px solid #ead3a1;
  }
  body.theme-light .premium-overview .ov-kpi .kpi-icon.green {
    background: #e3f3e9;
    color: #267749;
    border: 1px solid #c4e5d0;
  }
  body.theme-light .premium-overview .ov-kpi .kpi-icon .ic {
    color: inherit;
  }
  .premium-overview .ov-kpi,
  .premium-overview .ov-panel,
  .next-booking {
    transition:
      background-color var(--bf-motion-soft) ease,
      border-color var(--bf-motion-soft) ease,
      box-shadow 320ms ease,
      transform 320ms var(--bf-motion-ease);
  }
  @media (hover: hover) and (pointer: fine) {
    .premium-overview .ov-kpi:hover,
    .premium-overview .ov-panel:hover {
      transform: translate3d(0, -2px, 0);
    }
    .next-booking:hover {
      transform: translate3d(0, -1px, 0);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .premium-overview .ov-kpi,
    .premium-overview .ov-panel,
    .next-booking {
      transition: none !important;
    }
  }
`;
