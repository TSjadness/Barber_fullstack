import { css } from "styled-components";

/**
 * Estilos de página Admin/Agenda (.calendar-tools, .btn, .day-nav, .time-col, .slot-cell, .blocked-pill, .agenda-controls, .agenda-sheet, .agenda-sheet-top, .agenda-sheet-metrics, .agenda-scroll, .agenda-timeline, ...).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const agendaStyles = css`
  .calendar-tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }
  .calendar-tools .btn {
    padding: 8px 12px;
  }
  .day-nav {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .time-col {
    border-bottom: 1px solid #2a2b2d;
    text-align: center;
    color: #777;
    font-size: 11px;
    padding-top: 12px;
    min-height: 73px;
  }
  .slot-cell {
    min-height: 73px;
    border-left: 1px solid #303134;
    border-bottom: 1px solid #303134;
    padding: 4px;
    position: relative;
  }
  .slot-cell:hover {
    background: #202125;
  }
  .blocked-pill {
    border: 1px solid #5a4142;
    border-radius: 8px;
    color: #e6a6a6;
    background: #332427;
    padding: 10px;
    font-size: 11px;
  }
  .agenda-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 17px;
  }
  .agenda-sheet {
    background: #f9f9fa;
    color: #1a1a1d;
    border-radius: 20px;
    padding: 23px;
    border: 1px solid #eee;
    box-shadow: 0 20px 48px #0005;
  }
  .agenda-sheet-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    margin-bottom: 22px;
  }
  .agenda-sheet-top h2 {
    margin: 0;
    font-size: 23px;
  }
  .agenda-sheet-metrics {
    display: flex;
    gap: 20px;
    font-size: 13px;
  }
  .agenda-scroll {
    overflow: auto;
    max-width: 100%;
    border-radius: 12px;
    border: 1px solid #e0dede;
    max-height: 68vh;
  }
  .agenda-timeline {
    display: grid;
    grid-template-columns: 91px repeat(var(--professionals), minmax(245px, 1fr));
    min-width: max-content;
  }
  .timeline-corner,
  .timeline-person {
    position: sticky;
    top: 0;
    z-index: 3;
    background: #f3f0ed;
    border-bottom: 1px solid #e3dcd4;
    height: 73px;
    display: flex;
    align-items: center;
    padding: 12px;
    gap: 12px;
  }
  .timeline-corner {
    left: 0;
    z-index: 5;
    font-weight: 700;
    justify-content: center;
  }
  .timeline-person {
    border-left: 1px solid #dedcda;
    min-width: 245px;
  }
  .timeline-person .avatar {
    width: 43px;
    height: 43px;
    border-radius: 50%;
    background: #dac4a6;
    color: #4c3017;
  }
  .timeline-person b,
  .timeline-person small {
    display: block;
  }
  .timeline-person small {
    font-size: 11px;
    color: #696663;
  }
  .timeline-hour {
    position: sticky;
    left: 0;
    z-index: 2;
    min-height: 85px;
    background: #f6f5f4;
    border-bottom: 1px solid #e7e5e4;
    padding: 15px;
    text-align: center;
    font-weight: 600;
  }
  .timeline-cell {
    height: 85px;
    min-width: 245px;
    border-left: 1px solid #e7e5e4;
    border-bottom: 1px solid #e7e5e4;
    padding: 5px;
    cursor: pointer;
    background: #fff;
  }
  .timeline-cell:hover {
    background: #fff6e7;
  }
  .timeline-booking {
    display: block;
    width: 100%;
    height: 100%;
    padding: 8px 10px;
    text-align: left;
    border-radius: 9px;
    border: 1px solid #bbd3f4;
    border-left: 4px solid #2773ce;
    background: linear-gradient(125deg, #eff5ff, #dce9ff);
    color: #162741;
    position: relative;
  }
  .timeline-booking.done {
    background: linear-gradient(125deg, #edfbef, #d7efdf);
    border-color: #b2d7ba;
    border-left-color: #2c9655;
    color: #163c22;
  }
  .timeline-booking.pending {
    background: linear-gradient(125deg, #fff8ec, #ffebc8);
    border-color: #f4d8a3;
    border-left-color: #c88e22;
    color: #6b4513;
  }
  .book-main {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
    font-size: 12px;
  }
  .book-sub {
    display: block;
    font-size: 11px;
    margin-top: 4px;
  }
  .book-status {
    position: absolute;
    bottom: 5px;
    right: 6px;
    font-size: 10px;
    font-weight: 700;
    background: #ffffff9e;
    border-radius: 6px;
    padding: 2px 5px;
  }
  .timeline-closed {
    color: #a19d97;
    font-size: 11px;
  }
  .premium-agenda .agenda-controls input {
    max-width: 175px;
  }
  @media (max-width: 760px) {
    .agenda-sheet {
      padding: 10px;
    }
    .agenda-sheet-top {
      flex-wrap: wrap;
    }
    .agenda-sheet-metrics {
      flex-wrap: wrap;
    }
  }
  .agenda-sheet-metrics span,
  .book-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  .agenda-sheet-top h2 .ic {
    color: var(--gold);
  }
  .agenda-sheet-top h2 {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  body.theme-light .agenda-sheet {
    background: #fff;
    border-color: #e2dccf;
    color: #1d1b17;
    box-shadow: 0 4px 18px #5a46200d;
  }
  body.theme-light .timeline-hour,
  body.theme-light .timeline-cell,
  body.theme-light .timeline-person,
  body.theme-light .timeline-corner {
    background: #fff;
    border-color: #ece5d8;
    color: #4d483f;
  }
  .agenda-controls .day-nav select {
    padding: 9px 10px;
  }
  .time-col {
    font-size: 12.5px;
  }
  .blocked-pill {
    font-size: 12.5px;
  }
  .timeline-person .avatar,
  .timeline-person .avatar-img {
    width: 54px !important;
    height: 54px !important;
    flex: 0 0 54px !important;
    min-width: 54px;
    border-radius: 50% !important;
    object-fit: cover;
    display: grid;
    place-items: center;
    font-size: 20px;
  }
  .timeline-person {
    height: 82px;
  }
  .day-nav {
    gap: 10px;
    flex-wrap: wrap;
  }
  .day-nav select {
    min-width: 118px;
    max-width: 180px;
    padding-right: 34px;
    border-radius: 11px;
  }
  .day-nav select[aria-label="Mês"] {
    min-width: 145px;
  }
  .day-nav input[type="date"] {
    min-width: 145px;
  }
  .timeline-person .avatar-img {
    object-fit: cover;
    object-position: center;
  }
  @media (max-width: 760px) {
    .day-nav select[aria-label="Mês"] {
      min-width: 133px;
    }
  }
  .bf-agenda-staff-filter {
    display: none;
  }
  @media (max-width: 760px) {
    .premium-agenda .page-head {
      gap: 14px;
    }
    .premium-agenda .page-head .head-actions {
      display: grid;
      width: 100%;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 9px;
    }
    .premium-agenda .head-actions .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      width: 100%;
      min-height: 44px;
      padding: 10px 9px;
      white-space: normal;
      font-size: 12px;
      text-align: center;
    }
    .premium-agenda .agenda-controls {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      min-width: 0;
    }
    .premium-agenda .day-nav {
      display: grid;
      grid-template-columns: 40px minmax(0, 1fr) minmax(0, 1fr) 40px;
      gap: 8px;
      width: 100%;
      align-items: stretch;
    }
    .premium-agenda .day-nav > * {
      min-width: 0 !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0;
    }
    .premium-agenda .day-nav > button:first-child {
      grid-column: 1;
      grid-row: 1;
    }
    .premium-agenda .day-nav > input[type="date"] {
      grid-column: 2 / 4;
      grid-row: 1;
      min-height: 44px;
    }
    .premium-agenda .day-nav > button:last-child {
      grid-column: 4;
      grid-row: 1;
    }
    .premium-agenda .day-nav > select[aria-label="Mês"] {
      grid-column: 1 / 3;
      grid-row: 2;
    }
    .premium-agenda .day-nav > select[aria-label="Ano"] {
      grid-column: 3 / 5;
      grid-row: 2;
    }
    .premium-agenda .day-nav select {
      min-height: 44px;
      padding: 9px 32px 9px 12px;
      text-overflow: ellipsis;
    }
    .bf-agenda-staff-filter {
      display: flex;
      flex-direction: column;
      gap: 7px;
      width: 100%;
      font-size: 12px;
      color: var(--muted);
      font-weight: 700;
    }
    .bf-agenda-staff-filter select {
      width: 100%;
      min-height: 46px;
      border-radius: 12px;
      padding: 10px 34px 10px 14px;
      color: var(--text);
      background: var(--panel);
      border: 1px solid var(--line);
      font-size: 14px;
      font-weight: 600;
    }
    .bf-agenda-swipe-hint {
      font-size: 11px;
      line-height: 1.4;
      align-self: flex-start;
    }
    .premium-agenda .agenda-sheet {
      min-width: 0;
      overflow: hidden;
    }
    .premium-agenda .agenda-scroll {
      max-width: 100%;
      overflow-x: auto;
      overscroll-behavior-x: contain;
    }
    .premium-agenda .agenda-sheet-top {
      gap: 12px;
    }
    .premium-agenda .agenda-sheet-metrics {
      gap: 9px;
    }
  }
  @media (max-width: 390px) {
    .premium-agenda .page-head .head-actions {
      grid-template-columns: 1fr 1fr;
    }
    .premium-agenda .day-nav {
      gap: 6px;
    }
    .premium-agenda .day-nav select {
      font-size: 12px;
    }
  }
  .premium-agenda .agenda-controls {
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: end;
    gap: 12px;
  }
  .premium-agenda .agenda-controls .day-nav {
    flex: 1 1 520px;
    min-width: 0;
  }
  .premium-agenda .bf-agenda-staff-filter {
    display: flex;
    flex: 0 1 270px;
    flex-direction: column;
    min-width: 190px;
    gap: 7px;
    font-size: 12px;
    font-weight: 700;
    color: var(--muted);
  }
  .premium-agenda .bf-agenda-staff-filter select {
    width: 100%;
    min-height: 44px;
    border-radius: 12px;
    border: 1px solid var(--line);
    background: var(--panel);
    color: var(--text);
    padding: 10px 34px 10px 12px;
    font-size: 13px;
  }
  .premium-agenda .bf-agenda-swipe-hint {
    display: none;
  }
  @media (max-width: 760px) {
    .premium-agenda .page-head > div:first-child {
      min-width: 0;
    }
    .premium-agenda .page-head p {
      overflow-wrap: anywhere;
    }
    .premium-agenda .page-head .head-actions {
      grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
      gap: 8px;
    }
    .premium-agenda .head-actions .btn {
      min-height: 46px;
      padding: 10px 8px;
      line-height: 1.25;
      font-size: 11px;
    }
    .premium-agenda .agenda-controls {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }
    .premium-agenda .agenda-controls .day-nav {
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr) minmax(0, 1fr) 38px;
      flex: none;
      width: 100%;
      gap: 8px;
      min-width: 0;
    }
    .premium-agenda .day-nav > button,
    .premium-agenda .day-nav > select,
    .premium-agenda .day-nav > input {
      min-width: 0;
      max-width: 100%;
      width: 100%;
      box-sizing: border-box;
      font-size: 13px;
    }
    .premium-agenda .day-nav > input[type="date"] {
      min-height: 44px;
      padding: 8px 10px;
    }
    .premium-agenda .day-nav select {
      min-height: 44px;
      padding: 8px 28px 8px 12px;
    }
    .premium-agenda .bf-agenda-staff-filter {
      display: flex;
      flex: none;
      width: 100%;
      min-width: 0;
      gap: 6px;
    }
    .premium-agenda .bf-agenda-staff-filter select {
      width: 100%;
      min-height: 46px;
    }
    .premium-agenda .bf-agenda-swipe-hint {
      display: inline-flex;
      align-items: center;
      align-self: start;
      gap: 7px;
      width: 100%;
      min-width: 0;
      font-size: 11px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }
    .premium-agenda .bf-agenda-swipe-hint svg {
      flex: 0 0 15px;
      width: 15px;
      height: 15px;
    }
    .premium-agenda .agenda-sheet {
      min-width: 0;
    }
    .premium-agenda .agenda-scroll {
      overflow-x: auto;
      overscroll-behavior-x: contain;
      -webkit-overflow-scrolling: touch;
    }
  }
  @media (max-width: 360px) {
    .premium-agenda .page-head .head-actions {
      grid-template-columns: 1fr 1.15fr;
    }
    .premium-agenda .day-nav {
      gap: 6px;
    }
  }
`;
