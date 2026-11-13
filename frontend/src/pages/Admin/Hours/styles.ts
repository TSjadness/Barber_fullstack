import { css } from "styled-components";

/**
 * Estilos de página Admin/Hours (.date-button, .closed, .weekly-table, .weekly-row, .hours-pair, .off, .hours-intro, .staff-schedule-card, .staff-schedule-head, .mini-days, .schedule-layout, .schedule-main, ...).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const hoursStyles = css`
  .date-button.closed {
    background: #442023;
    border-color: #bc525b;
    color: #ffa6ae;
  }
  .weekly-table {
    display: grid;
    gap: 9px;
  }
  .weekly-row {
    display: grid;
    grid-template-columns: 80px minmax(130px, 1fr) minmax(160px, 1.3fr);
    gap: 9px;
    align-items: center;
    background: #232323;
    border: 1px solid #3a3938;
    padding: 10px;
    border-radius: 12px;
  }
  .weekly-row strong {
    color: #e2d9cb;
  }
  .weekly-row .hours-pair {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .weekly-row .hours-pair input {
    width: 100%;
    padding: 9px 5px;
  }
  .weekly-row select {
    width: 100%;
  }
  .weekly-row.off {
    opacity: 0.65;
  }
  .weekly-row.off .hours-pair {
    display: none;
  }
  .hours-intro {
    background: #252017;
    border: 1px solid #59442b;
    padding: 15px 17px;
    border-radius: 12px;
    color: #e6cfaa;
    margin-bottom: 17px;
  }
  .staff-schedule-card {
    border: 1px solid var(--line);
    padding: 22px;
    border-radius: 16px;
    background: #1a1b1c;
    margin-bottom: 16px;
  }
  .staff-schedule-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 19px;
  }
  .mini-days {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .mini-days span {
    background: #3c3120;
    color: #efd19b;
    border: 1px solid #6c512e;
    padding: 5px 9px;
    border-radius: 7px;
    font-size: 11px;
  }
  .mini-days span.off {
    background: #292426;
    border-color: #553437;
    color: #a88586;
  }
  @media (max-width: 700px) {
    .weekly-row {
      grid-template-columns: 65px 1fr;
      gap: 7px;
    }
    .weekly-row .hours-pair {
      grid-column: 1/-1;
    }
  }
  .schedule-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 285px;
    gap: 18px;
    align-items: start;
  }
  .schedule-main {
    display: grid;
    gap: 16px;
    min-width: 0;
  }
  .schedule-panel,
  .schedule-side-card {
    background: #18191b;
    border: 1px solid #323235;
    border-radius: 18px;
    padding: 23px;
  }
  .schedule-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }
  .schedule-heading h3,
  .schedule-side-card h3 {
    font-size: 21px;
    letter-spacing: -0.4px;
    margin: 7px 0 0;
  }
  .schedule-kicker {
    color: #d6ac62;
    font-size: 10px;
    letter-spacing: 1.7px;
    font-weight: 800;
  }
  .schedule-subtle {
    font-size: 12px;
    color: #96969b;
  }
  .schedule-persons {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }
  .schedule-person {
    flex: 1 1 190px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #222326;
    color: #f4f1ec;
    border: 1px solid #3b3c40;
    border-radius: 13px;
    padding: 12px;
    text-align: left;
  }
  .schedule-person.current {
    border-color: #d6ac62;
    background: #2e281e;
  }
  .schedule-person-avatar {
    height: 39px;
    width: 39px;
    border-radius: 11px;
    background: #51412b;
    color: #f3d69b;
    display: grid;
    place-items: center;
    font-weight: 800;
  }
  .schedule-person strong,
  .schedule-person small {
    display: block;
  }
  .schedule-person small {
    color: #96969b;
    font-size: 11px;
    margin-top: 3px;
  }
  .schedule-person-check {
    margin-left: auto;
    color: #eaca8e;
    font-size: 18px;
  }
  .base-hours {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
    background: #202124;
    border: 1px solid #353538;
    border-radius: 13px;
    padding: 17px;
  }
  .base-time span,
  .base-copy small {
    display: block;
    font-size: 11px;
    color: #a8a8ae;
  }
  .base-time strong {
    display: block;
    font: 700 27px Outfit;
    margin-top: 4px;
  }
  .base-arrow {
    color: #c7a467;
    font-size: 24px;
  }
  .base-copy {
    margin-left: auto;
    max-width: 235px;
  }
  .base-copy strong {
    font-size: 12px;
  }
  .base-copy small {
    line-height: 1.5;
    margin: 5px 0 10px;
  }
  .schedule-days {
    display: grid;
    gap: 8px;
  }
  .schedule-day {
    border: 1px solid #36373a;
    border-radius: 13px;
    background: #202124;
    overflow: hidden;
  }
  .schedule-day.is-off {
    background: #1b1c1e;
    opacity: 0.8;
  }
  .schedule-day.expanded {
    border-color: #b99257;
  }
  .schedule-day-main {
    padding: 15px;
    display: grid;
    grid-template-columns: minmax(130px, 1fr) minmax(115px, auto) auto;
    align-items: center;
    gap: 12px;
  }
  .schedule-day-label {
    display: flex;
    align-items: center;
    gap: 11px;
  }
  .schedule-day-label strong,
  .schedule-day-label small {
    display: block;
  }
  .schedule-day-label strong {
    font-size: 13px;
  }
  .schedule-day-label small {
    color: #9e9fa3;
    font-size: 11px;
    margin-top: 3px;
  }
  .schedule-day-icon {
    color: #65bf91;
  }
  .is-off .schedule-day-icon {
    color: #7e7f85;
  }
  .schedule-day-time {
    color: #f2ebdf;
    font-weight: 800;
    font-size: 13px;
    white-space: nowrap;
  }
  .schedule-day-time span {
    font-weight: 400;
    color: #999;
  }
  .is-off .schedule-day-time {
    color: #888;
  }
  .schedule-day-actions {
    display: flex;
    align-items: center;
    gap: 11px;
  }
  .schedule-edit {
    font-weight: 700;
    font-size: 11px;
    color: #eacb91;
    background: #342c20;
    border: 1px solid #655135;
    border-radius: 8px;
    padding: 8px 10px;
    min-width: 80px;
  }
  .schedule-edit:disabled {
    opacity: 0.35;
  }
  .schedule-expand {
    border-top: 1px solid #494033;
    background: #25231f;
    padding: 17px;
  }
  .schedule-expand p {
    font-weight: 700;
    font-size: 12px;
    margin: 0 0 12px;
  }
  .schedule-mode {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .schedule-mode button {
    padding: 10px 12px;
    border-radius: 9px;
    background: #303033;
    color: #aaa;
    border: 1px solid #45464a;
    font-weight: 700;
    font-size: 12px;
  }
  .schedule-mode button.active {
    background: #4b3920;
    color: #f4d49b;
    border-color: #ac8650;
  }
  .schedule-times {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 16px;
  }
  .schedule-times label {
    flex: 1 1 120px;
  }
  .schedule-tip {
    color: #b9a989;
    font-size: 12px;
    margin-top: 12px;
  }
  .schedule-save-note {
    color: #86c6a2;
    font-size: 11px;
    margin-top: 16px;
  }
  .schedule-side-card {
    margin-bottom: 16px;
  }
  .schedule-summary-person {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 18px 0;
    border-bottom: 1px solid #38383b;
  }
  .schedule-summary-person strong,
  .schedule-summary-person small {
    display: block;
  }
  .schedule-summary-person small {
    color: #999;
    font-size: 11px;
    margin-top: 4px;
  }
  .schedule-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding: 17px 0;
  }
  .schedule-metrics > div {
    background: #222326;
    padding: 14px;
    border-radius: 11px;
  }
  .schedule-metrics strong {
    display: block;
    font: 700 29px Outfit;
  }
  .schedule-metrics strong small {
    font-size: 13px;
    color: #999;
  }
  .schedule-metrics span {
    font-size: 11px;
    color: #999;
  }
  .schedule-mini-week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }
  .schedule-mini-week > div {
    display: grid;
    text-align: center;
    gap: 8px;
    font-size: 10px;
    color: #999;
  }
  .schedule-mini-week i,
  .schedule-key i {
    height: 21px;
    border-radius: 5px;
    background: #b99153;
  }
  .schedule-mini-week i.custom,
  .schedule-key i.custom {
    background: #5e937e;
  }
  .schedule-mini-week i.closed,
  .schedule-key i.closed {
    background: #564348;
  }
  .schedule-key {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 15px;
    font-size: 10px;
    color: #b0b0b3;
  }
  .schedule-key span {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .schedule-key i {
    height: 8px;
    width: 8px;
    display: block;
    border-radius: 3px;
  }
  .schedule-help p {
    color: #aaa;
    font-size: 12px;
    line-height: 1.8;
  }
  .schedule-help p b {
    color: #ddd;
  }
  @media (max-width: 1100px) {
    .schedule-layout {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 620px) {
    .schedule-panel,
    .schedule-side-card {
      padding: 16px;
    }
    .schedule-day-main {
      grid-template-columns: 1fr auto;
      gap: 10px;
    }
    .schedule-day-time {
      grid-column: 1;
      grid-row: 2;
      padding-left: 25px;
    }
    .schedule-day-actions {
      grid-column: 2;
      grid-row: 1 / span 2;
    }
    .base-copy {
      margin-left: 0;
      max-width: 100%;
      flex-basis: 100%;
      border-top: 1px solid #39393c;
      padding-top: 14px;
    }
  }
  .schedule-save-note {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  .schedule-day-icon {
    display: inline-flex;
    color: var(--gold);
  }
  .schedule-person-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
  body.theme-light .schedule-panel,
  body.theme-light .schedule-side-card {
    background: #fff;
    border-color: #e2dccf;
    color: #1d1b17;
    box-shadow: 0 4px 18px #5a46200d;
  }
  body.theme-light .schedule-day,
  body.theme-light .schedule-person,
  body.theme-light .base-hours {
    background: #faf7f1;
    border-color: #e6dfd1;
    color: #1d1b17;
  }
  .schedule-person-avatar {
    height: 64px;
    width: 64px;
    flex: 0 0 64px;
    border-radius: 12px;
    overflow: hidden;
    font-size: 22px;
  }
  .schedule-person small {
    font-size: 12.5px;
  }
  body.theme-light .schedule-day-time {
    color: #111;
  }
  body.theme-light .schedule-day-time span {
    color: #555;
  }
  body.theme-light .is-off .schedule-day-time {
    color: #777;
  }
  body.theme-light .base-time,
  body.theme-light .base-time * {
    color: #111;
  }
  .schedule-edit,
  .schedule-mode button,
  .schedule-person {
    transition:
      transform var(--motion-normal) var(--motion-smooth),
      background-color var(--motion-normal) ease,
      border-color var(--motion-normal) ease,
      box-shadow var(--motion-normal) ease,
      color var(--motion-fast) ease,
      opacity var(--motion-fast) ease;
  }
  .schedule-edit {
    border-radius: 12px;
  }
  .schedule-edit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px #0002;
  }
  .schedule-day-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    min-width: 170px;
  }
  .schedule-edit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    white-space: nowrap;
    min-width: 112px;
    flex-shrink: 0;
  }
  .schedule-edit span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .schedule-edit .ic {
    display: block;
    width: 15px;
    height: 15px;
  }
  .schedule-day-main {
    grid-template-columns: minmax(145px, 1fr) minmax(110px, auto) minmax(175px, auto);
  }
  .schedule-summary-person .avatar-img {
    object-fit: cover;
    object-position: center;
  }
  @media (max-width: 760px) {
    .schedule-day-main {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px;
    }
    .schedule-day-time {
      grid-column: 1;
      grid-row: 2;
    }
    .schedule-day-actions {
      grid-column: 2;
      grid-row: 1 / span 2;
      min-width: auto;
      gap: 8px;
    }
    .schedule-edit {
      min-width: 94px;
    }
  }
  @media (max-width: 430px) {
    .schedule-day-main {
      padding: 12px;
    }
    .schedule-day-actions {
      gap: 6px;
    }
    .schedule-edit {
      min-width: 84px;
      padding: 8px;
    }
  }
  body.theme-light .schedule-metrics > div {
    background: #f8f3e8;
    border: 1px solid #e7d9bd;
    box-shadow: none;
  }
  body.theme-light .schedule-metrics strong,
  body.theme-light .schedule-metrics strong small {
    color: #624719;
  }
  body.theme-light .schedule-metrics span {
    color: #675d4e;
  }
  body.theme-light .schedule-help p {
    color: #5f594e;
  }
  body.theme-light .schedule-help p b {
    color: #29231c;
  }
  body.theme-light .schedule-key {
    color: #5e574e;
  }
  @media (max-width: 760px) {
    .schedule-help > .btn {
      display: flex;
      width: 100%;
      min-width: 0;
      min-height: 44px;
      margin-top: 18px;
      padding: 10px 14px;
      align-items: center;
      justify-content: center;
      gap: 9px;
      text-align: center;
      white-space: normal;
    }
    .schedule-help > .btn .ic {
      flex: 0 0 auto;
    }
    .schedule-help p:last-of-type {
      margin-bottom: 0;
    }
  }
  @media (min-width: 761px) {
    .schedule-help > .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      width: auto;
      max-width: 100%;
      min-height: 38px;
      margin-top: 10px;
      padding: 8px 10px;
      white-space: normal;
      text-align: center;
      font-size: 10px;
      line-height: 1.3;
      letter-spacing: 0;
    }
    .schedule-help > .btn .ic {
      width: 13px;
      height: 13px;
      flex: 0 0 auto;
    }
  }
  .schedule-day,
  .schedule-person {
    transition:
      background-color var(--bf-motion-soft) ease,
      border-color var(--bf-motion-soft) ease,
      box-shadow 320ms ease,
      transform 320ms var(--bf-motion-ease);
  }
  .schedule-day-icon,
  .schedule-mode button {
    transition:
      background-color 240ms ease,
      color 240ms ease,
      border-color 240ms ease,
      box-shadow 280ms ease,
      transform 280ms var(--bf-motion-ease),
      opacity 200ms ease;
  }
  @media (hover: hover) and (pointer: fine) {
    .schedule-person:hover {
      transform: translate3d(0, -2px, 0);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .schedule-day,
    .schedule-person,
    .schedule-day-icon,
    .schedule-mode button {
      transition: none !important;
    }
  }
`;
