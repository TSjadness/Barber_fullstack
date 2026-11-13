import { css } from "styled-components";

/**
 * Estilos de TimeSlots (.times, .time-button, .selected, .times-empty, .ic, .booking-date-time, .booking-slots, .time-periods, .time-period, .time-period-title).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const timeSlotsStyles = css`
  .times {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 9px;
  }
  .time-button {
    border: 1px solid var(--line);
    border-radius: 9px;
    padding: 12px 7px;
    background: #212224;
    color: #f6f6f6;
  }
  .time-button.selected {
    background: #3c3020;
    border-color: var(--gold);
    color: var(--gold2);
  }
  @media (max-width: 700px) {
    .times {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .time-button {
    font-size: 16px;
    font-weight: 700;
    padding: 12px 6px;
    display: grid;
    gap: 3px;
    place-items: center;
  }
  .time-button small {
    font-size: 11px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .times-empty {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 22px;
    border: 1px dashed var(--line);
    border-radius: 6px;
    color: #c9c7c2;
    font-size: 15px;
  }
  .times-empty .ic {
    color: var(--gold);
    width: 22px;
    height: 22px;
    flex: none;
  }
  .time-button {
    transition:
      transform var(--motion-normal) var(--motion-smooth),
      background-color var(--motion-normal) ease,
      border-color var(--motion-normal) ease,
      box-shadow var(--motion-normal) ease,
      color var(--motion-fast) ease,
      opacity var(--motion-fast) ease;
  }
  .time-button {
    border-radius: 12px;
  }
  .time-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px #0002;
  }
  .time-button:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }
  .time-button:focus-visible {
    outline: 2px solid var(--gold2);
    outline-offset: 3px;
  }
  .booking-date-time .times {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }
  .time-button {
    border-radius: 13px;
    min-height: 52px;
  }
  @media (max-width: 900px) {
    .booking-date-time .times {
      grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
    }
  }
  @media (max-width: 430px) {
    .booking-date-time .times {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  .booking-slots .time-button.selected {
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }
  .booking-date-time .time-periods {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .booking-date-time .time-period {
    display: block;
    min-width: 0;
  }
  .booking-date-time .time-period-title {
    font:
      700 13px "DM Sans",
      sans-serif;
    letter-spacing: 0.1px;
    color: var(--muted);
    margin: 0 0 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--line);
  }
  .booking-date-time .time-period .times {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }
  .booking-date-time .time-period .time-button {
    width: 100%;
  }
  @media (max-width: 900px) {
    .booking-date-time .time-period .times {
      grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
    }
  }
  .time-period-title {
    font-family:
      "Manrope",
      -apple-system,
      BlinkMacSystemFont,
      sans-serif !important;
  }
`;
