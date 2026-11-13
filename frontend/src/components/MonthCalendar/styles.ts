import { css } from "styled-components";

/**
 * Estilos de MonthCalendar (.calendar, .cal-grid, .cal-head, .dates, .date-button, .selected, .available, .partial, .full, .mcal-head, .cal-selects, .cal-grid-month, ...).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const monthCalendarStyles = css`
  .calendar {
    overflow-x: auto;
    border: 1px solid var(--line);
    border-radius: 15px;
    background: #17181b;
  }
  .cal-grid {
    display: grid;
    grid-template-columns: 70px repeat(var(--n), minmax(190px, 1fr));
    min-width: 550px;
  }
  .cal-head {
    padding: 15px;
    text-align: center;
    border-bottom: 1px solid var(--line);
    border-left: 1px solid var(--line);
    color: var(--gold2);
    font-weight: 800;
  }
  .dates {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 7px;
  }
  .date-button {
    padding: 11px 3px;
    border: 1px solid var(--line);
    background: #202124;
    border-radius: 9px;
    color: #eee;
    font-size: 12px;
    display: grid;
    gap: 7px;
    place-items: center;
  }
  .date-button strong {
    font-size: 17px;
  }
  .date-button.selected {
    background: var(--gold);
    border-color: var(--gold);
    color: #17110a;
  }
  .date-button:disabled {
    opacity: 0.24;
  }
  @media (max-width: 700px) {
    .dates {
      gap: 3px;
    }
    .date-button {
      font-size: 10px;
    }
    .date-button strong {
      font-size: 14px;
    }
  }
  .date-button {
    min-height: 83px;
    position: relative;
    border-radius: 12px;
    transition:
      transform 0.15s,
      border 0.15s;
    gap: 4px;
  }
  .date-button small {
    font-size: 9px;
    font-weight: 800;
    white-space: nowrap;
  }
  .date-button.available {
    background: #17382b;
    border-color: #3e9870;
    color: #aaf1c9;
  }
  .date-button.partial {
    background: #443a18;
    border-color: #af9741;
    color: #ffdc86;
  }
  .date-button.full {
    background: #482c1d;
    border-color: #c2793e;
    color: #ffba86;
  }
  .date-button.selected {
    outline: 2px solid var(--gold2);
    outline-offset: 2px;
    box-shadow: 0 0 0 3px #000;
  }
  .date-button:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
  .date-button:hover:not(:disabled) {
    transform: translateY(-3px);
  }
  @media (max-width: 700px) {
    .dates {
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: 4px;
    }
    .date-button {
      min-height: 71px;
      padding: 7px 1px;
    }
    .date-button small {
      font-size: 8px;
    }
  }
  @media (max-width: 420px) {
    .dates {
      grid-template-columns: repeat(7, minmax(0, 1fr));
    }
    .date-button {
      font-size: 9px;
    }
    .date-button strong {
      font-size: 15px;
    }
    .date-button small {
      font-size: 7px;
      letter-spacing: -0.3px;
    }
  }
  .dates {
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 6px;
    max-width: 620px;
  }
  .date-button {
    padding: 7px 2px;
    gap: 3px;
    font-size: 12px;
  }
  .date-button strong {
    font-size: 16px;
  }
  .date-button small {
    font-size: 10px;
  }
  @media (max-width: 700px) {
    .dates {
      gap: 3px;
    }
    .date-button small {
      display: none;
    }
  }
  .mcal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
    max-width: 620px;
  }
  .cal-selects {
    display: flex;
    gap: 8px;
  }
  .cal-selects select {
    padding: 8px 10px;
    font-weight: 700;
  }
  .cal-grid-month {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
  .cal-wd {
    text-align: center;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 4px 0;
  }
  .cal-blank {
    min-height: 1px;
  }
  .date-button.past {
    opacity: 0.25;
    background: transparent;
  }
  .date-button {
    transition:
      transform var(--motion-normal) var(--motion-smooth),
      background-color var(--motion-normal) ease,
      border-color var(--motion-normal) ease,
      box-shadow var(--motion-normal) ease,
      color var(--motion-fast) ease,
      opacity var(--motion-fast) ease;
  }
  .date-button {
    border-radius: 12px;
  }
  .date-button:focus-visible {
    outline: 2px solid var(--gold2);
    outline-offset: 3px;
  }
  .mcal-head {
    max-width: none;
    gap: 12px;
    margin-bottom: 20px;
  }
  .cal-selects {
    flex: 1;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 105px;
    max-width: 400px;
    gap: 9px;
  }
  .cal-selects select {
    width: 100%;
    padding: 11px 34px 11px 14px;
    min-height: 45px;
    border-radius: 12px;
    border-color: color-mix(in srgb, var(--gold) 28%, var(--line));
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d6ac62' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }
  .date-button {
    border-radius: 12px;
    min-height: 52px;
  }
  .date-button:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  @media (max-width: 760px) {
    .cal-selects {
      grid-template-columns: minmax(0, 1fr) 90px;
    }
    .mcal-head {
      gap: 5px;
    }
    .mcal-head > .btn {
      min-width: 35px;
      padding: 9px;
    }
  }
  @media (max-width: 430px) {
    .cal-selects select {
      padding-left: 9px;
      padding-right: 25px;
      background-position: right 7px center;
    }
  }
`;
