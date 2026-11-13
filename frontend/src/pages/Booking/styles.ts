import { css } from "styled-components";

/**
 * Estilos de página Booking (.booking-pill, .booking-area, .steps, .step, .active, .choice, .selected, .booking-foot, .success, .success-icon, .availability-legend, .muted, ...).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const bookingStyles = css`
  .booking-pill {
    border: 1px solid #80643a;
    border-left: 3px solid var(--gold);
    border-radius: 8px;
    background: #30291d;
    padding: 7px;
    cursor: pointer;
    font-size: 11px;
    line-height: 1.4;
    min-height: 58px;
  }
  .booking-pill b {
    display: block;
    color: #f7e6c9;
  }
  .booking-pill span {
    color: #c7b9a3;
  }
  .booking-area {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px 90px;
  }
  .steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px;
    margin-bottom: 30px;
  }
  .step {
    padding: 10px 4px;
    border-bottom: 3px solid #3a3a3e;
    color: #76777a;
    text-align: center;
    font-size: 11px;
    font-weight: 800;
  }
  .step.active {
    border-color: var(--gold);
    color: var(--gold2);
  }
  .choice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 15px;
    border: 1px solid var(--line);
    background: #1b1c1e;
    border-radius: 12px;
    margin: 10px 0;
    cursor: pointer;
  }
  .choice:hover,
  .choice.selected {
    border-color: var(--gold);
    background: #29251e;
  }
  .choice p {
    margin: 4px 0 0;
    color: var(--muted);
    font-size: 12px;
  }
  .booking-foot {
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
    gap: 10px;
  }
  .success {
    padding: 35px 20px;
    text-align: center;
  }
  .success-icon {
    width: 75px;
    height: 75px;
    border: 2px solid var(--green);
    border-radius: 50%;
    margin: 0 auto 22px;
    display: grid;
    place-items: center;
    color: var(--green);
    font-size: 38px;
  }
  @media (max-width: 700px) {
    .steps .step {
      font-size: 9px;
    }
  }
  .availability-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 13px;
    margin: 16px 0 18px;
  }
  .availability-legend span {
    font-size: 12px;
    color: #c5c3bf;
    display: inline-flex;
    gap: 7px;
    align-items: center;
  }
  .availability-legend i {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    display: inline-block;
  }
  .success-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .booking-area h2 {
    font-size: 26px;
    margin-bottom: 6px;
  }
  .booking-area > .muted,
  .booking-area p.muted {
    font-size: 15px;
  }
  .sel-count {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin: 16px 0 6px;
    padding: 12px 15px;
    border: 1px solid #4a3d27;
    background: #1f1b14;
    border-radius: 6px;
    font-size: 15px;
    color: #e9dcc3;
  }
  .sel-count .ic {
    color: var(--gold);
  }
  .sel-count b {
    color: var(--gold2);
    font-size: 17px;
  }
  .sel-count em {
    font-style: normal;
    margin-left: auto;
    color: var(--gold2);
    font-weight: 700;
  }
  .choice {
    padding: 18px;
  }
  .choice strong {
    font-size: 17px;
  }
  .choice p {
    font-size: 14px;
  }
  .choice .price {
    font-size: 17px;
  }
  .choice-main {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .choice-check {
    width: 24px;
    height: 24px;
    flex: none;
    border: 1.5px solid #55565a;
    border-radius: 4px;
    display: grid;
    place-items: center;
    color: #17140f;
  }
  .choice.selected .choice-check {
    background: var(--gold);
    border-color: var(--gold);
  }
  .choice .avatar {
    width: 54px;
    height: 54px;
  }
  .availability-legend {
    gap: 18px;
  }
  .availability-legend span {
    font-size: 14px;
  }
  .availability-legend i {
    width: 12px !important;
    height: 12px !important;
  }
  .time-button.reserved {
    opacity: 1;
    border-color: #6b3237;
    background: #2a1719;
    color: #e88b92;
    cursor: not-allowed;
  }
  .time-button.reserved small {
    color: #ef6b75;
  }
  .time-button.reserved .ic {
    width: 12px;
    height: 12px;
  }
  @media (max-width: 700px) {
    .sel-count em {
      margin-left: 0;
    }
  }
  .choice p {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .booking-pill {
    font-size: 12.5px;
  }
  .choice {
    transition:
      transform var(--motion-normal) var(--motion-smooth),
      background-color var(--motion-normal) ease,
      border-color var(--motion-normal) ease,
      box-shadow var(--motion-normal) ease,
      color var(--motion-fast) ease,
      opacity var(--motion-fast) ease;
  }
  .booking-foot .btn {
    border-radius: 14px;
  }
  .booking-date-time {
    display: grid;
    grid-template-columns: minmax(0, 1.38fr) minmax(240px, 0.9fr);
    gap: 16px;
    align-items: start;
    margin-bottom: 15px;
  }
  .booking-date-time > .card {
    margin: 0 !important;
    height: 100%;
    min-width: 0;
  }
  .booking-date-time .booking-slots {
    max-height: 630px;
    overflow: auto;
    scrollbar-width: thin;
  }
  .booking-date-time h3 {
    font-size: 19px;
    margin-bottom: 13px;
  }
  @media (max-width: 900px) {
    .booking-date-time {
      grid-template-columns: 1fr;
    }
    .booking-date-time .booking-slots {
      max-height: none;
    }
  }
  .booking-slots {
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
  }
`;
