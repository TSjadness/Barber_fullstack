import { css } from "styled-components";

/**
 * Estilos de página Admin/Calendar (.bcal-shell, .bcal-toolbar, .bcal-nav, .bcal-legend, .bcal-total, .bcal-full-btn, .bcal-body, .bcal-main, .bcal-weekdays, .bcal-grid, .bcal-day, .blank, ...).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const calendarStyles = css`
  .bcal-shell {
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--panel);
    padding: 16px;
    min-width: 0;
  }
  .bcal-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }
  .bcal-nav {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .bcal-nav select {
    min-height: 38px;
    border-radius: 10px;
    padding: 6px 28px 6px 10px;
    background: var(--panel2);
    color: var(--text);
    border: 1px solid var(--line);
    font-weight: 600;
  }
  .bcal-legend {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    color: var(--muted);
    font-size: 12.5px;
  }
  .bcal-legend span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .bcal-total {
    color: var(--text);
    font-size: 13px;
  }
  .bcal-full-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  .bcal-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
  .bcal-main {
    min-width: 0;
  }
  .bcal-weekdays,
  .bcal-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 6px;
  }
  .bcal-weekdays {
    margin-bottom: 6px;
  }
  .bcal-weekdays span {
    text-align: center;
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--muted);
    padding: 4px 0;
  }
  .bcal-day {
    min-height: 132px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 6px;
    border-radius: 12px;
    border: 1px solid var(--line);
    background: var(--panel2);
    min-width: 0;
  }
  .bcal-day.blank {
    background: transparent;
    border-style: dashed;
    opacity: 0.3;
  }
  .bcal-day.past .bcal-day-num {
    color: var(--muted);
  }
  .bcal-day.selected {
    border-color: var(--gold);
    box-shadow: 0 0 0 1px var(--gold) inset;
  }
  .bcal-day-num {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 2px 3px;
    border: 0;
    border-radius: 8px;
    background: none;
    color: var(--text);
    font: inherit;
    font-weight: 800;
    font-size: 13px;
    cursor: pointer;
    text-align: left;
  }
  .bcal-day-num:hover {
    background: color-mix(in srgb, var(--gold) 14%, transparent);
  }
  .bcal-day.today .bcal-day-num > span:first-child {
    display: inline-grid;
    place-items: center;
    min-width: 24px;
    height: 24px;
    border-radius: 999px;
    background: var(--gold);
    color: #17181b;
  }
  .bcal-flag {
    display: inline-flex;
    color: var(--gold);
  }
  .bcal-flag .ic {
    width: 13px;
    height: 13px;
  }
  .bcal-count {
    margin-left: auto;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 999px;
    display: inline-grid;
    place-items: center;
    font-size: 11px;
    background: color-mix(in srgb, var(--gold) 22%, transparent);
    color: var(--gold2);
  }
  .bcal-events {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
  }
  .bcal-event {
    display: flex;
    flex-direction: column;
    gap: 1px;
    width: 100%;
    padding: 5px 7px;
    text-align: left;
    border-radius: 8px;
    border: 1px solid var(--line);
    border-left: 3px solid var(--blue);
    background: color-mix(in srgb, var(--blue) 14%, var(--panel));
    color: var(--text);
    font: inherit;
    font-size: 11.5px;
    line-height: 1.3;
    cursor: pointer;
    min-width: 0;
  }
  .bcal-event.pending,
  .bcal-item.pending {
    border-left-color: #e0a63a;
    background: color-mix(in srgb, #e0a63a 15%, var(--panel));
  }
  .bcal-event.done,
  .bcal-item.done {
    border-left-color: var(--green);
    background: color-mix(in srgb, var(--green) 14%, var(--panel));
  }
  .bcal-event:hover,
  .bcal-item:hover {
    filter: brightness(1.12);
  }
  .bcal-ev-line {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }
  .bcal-ev-time {
    font-variant-numeric: tabular-nums;
  }
  .bcal-ev-name {
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bcal-ev-sub {
    color: var(--muted);
    font-size: 10.5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bcal-more {
    align-self: flex-start;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--gold2);
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }
  .bcal-dots {
    display: none;
    gap: 3px;
    flex-wrap: wrap;
    padding: 0 3px;
  }
  .bcal-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--blue);
  }
  .bcal-dot.pending {
    background: #e0a63a;
  }
  .bcal-dot.done {
    background: var(--green);
  }
  .bcal-panel {
    border: 1px solid var(--line);
    border-radius: 14px;
    background: var(--panel2);
    padding: 14px;
    min-width: 0;
  }
  .bcal-panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }
  .bcal-panel-head h3 {
    margin: 4px 0 2px;
    font-size: 17px;
  }
  .bcal-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .bcal-item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 10px;
    align-items: start;
    width: 100%;
    padding: 10px;
    text-align: left;
    border-radius: 10px;
    border: 1px solid var(--line);
    border-left: 3px solid var(--blue);
    background: color-mix(in srgb, var(--blue) 12%, var(--panel));
    color: var(--text);
    font: inherit;
    cursor: pointer;
  }
  .bcal-item-time {
    font-size: 15px;
    font-variant-numeric: tabular-nums;
  }
  .bcal-item-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    font-size: 12.5px;
  }
  .bcal-item-info span {
    color: var(--muted);
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .bcal-item-info .ic {
    display: inline-block;
    width: 13px;
    height: 13px;
    vertical-align: -2px;
  }
  .bcal-panel .empty {
    padding: 18px 8px;
  }
  body.bf-cal-lock {
    overflow: hidden;
  }
  .bcal-shell.bcal-full {
    position: fixed;
    inset: 0;
    z-index: 88;
    border: 0;
    border-radius: 0;
    background: var(--bg);
    padding: 16px clamp(12px, 2vw, 28px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .bcal-full .bcal-body {
    flex: 1;
    min-height: 0;
    grid-template-columns: minmax(0, 1fr) 360px;
  }
  .bcal-full .bcal-main {
    min-height: 0;
    overflow: auto;
  }
  .bcal-full .bcal-weekdays {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--bg);
    padding-bottom: 6px;
    margin-bottom: 0;
  }
  .bcal-full .bcal-day {
    min-height: clamp(132px, 16vh, 200px);
  }
  .bcal-full .bcal-panel {
    overflow: auto;
    min-height: 0;
  }
  @media (max-width: 1000px) {
    .bcal-full .bcal-body {
      display: flex;
      flex-direction: column;
      overflow: auto;
    }
    .bcal-full .bcal-main {
      overflow: visible;
    }
    .bcal-full .bcal-panel {
      overflow: visible;
      flex: none;
    }
  }
  @media (max-width: 760px) {
    .bcal-shell {
      padding: 12px;
    }
    .bcal-toolbar {
      gap: 10px;
    }
    .bcal-legend {
      gap: 10px;
      font-size: 12px;
    }
    .bcal-weekdays,
    .bcal-grid {
      gap: 4px;
    }
    .bcal-day {
      min-height: 58px;
      padding: 4px;
      gap: 3px;
      border-radius: 10px;
    }
    .bcal-events {
      display: none;
    }
    .bcal-dots {
      display: flex;
    }
    .bcal-day-num {
      padding: 1px 2px;
      font-size: 12.5px;
    }
    .bcal-count {
      display: none;
    }
    .bcal-item {
      grid-template-columns: auto minmax(0, 1fr);
    }
    .bcal-item .status {
      grid-column: 2;
      justify-self: start;
    }
  }
  @media (max-width: 1000px) {
    .bcal-shell.bcal-full {
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }
    .bcal-full .bcal-body {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      flex: 0 0 auto;
      min-height: auto;
      gap: 16px;
      overflow: visible;
    }
    .bcal-full .bcal-main,
    .bcal-full .bcal-panel {
      min-width: 0;
      min-height: auto;
      overflow: visible;
    }
    .bcal-full .bcal-panel {
      position: relative;
      inset: auto;
      width: 100%;
      max-height: none;
      flex: none;
      z-index: auto;
    }
  }
  @media (max-width: 760px) {
    .bcal-shell.bcal-full {
      padding: 12px 10px 24px;
      height: 100dvh;
      max-height: 100dvh;
    }
    .bcal-full .bcal-toolbar {
      flex: 0 0 auto;
      align-items: flex-start;
      gap: 10px;
    }
    .bcal-full .bcal-nav {
      width: 100%;
      display: grid;
      grid-template-columns: 36px minmax(0, 1fr) minmax(0, 0.85fr) 36px;
      gap: 7px;
      align-items: center;
    }
    .bcal-full .bcal-nav > button,
    .bcal-full .bcal-nav > select {
      width: 100%;
      min-width: 0;
      max-width: 100%;
      margin: 0;
    }
    .bcal-full .bcal-nav > button:nth-child(5) {
      grid-column: 1 / -1;
      justify-self: start;
      width: auto;
    }
    .bcal-full .bcal-legend {
      flex: 1 1 auto;
      gap: 8px;
      align-items: center;
      min-width: 0;
    }
    .bcal-full .bcal-full-btn {
      flex: 0 0 auto;
      white-space: nowrap;
    }
    .bcal-full .bcal-weekdays {
      position: static;
      margin-bottom: 6px;
      padding: 0;
    }
    .bcal-full .bcal-day {
      min-height: 58px;
      padding: 4px;
      gap: 3px;
    }
    .bcal-full .bcal-events {
      display: none;
    }
    .bcal-full .bcal-dots {
      display: flex;
    }
    .bcal-full .bcal-body {
      gap: 14px;
    }
    .bcal-full .bcal-panel {
      padding: 12px;
      scroll-margin-top: 12px;
    }
    .bcal-full .bcal-panel-head {
      flex-wrap: wrap;
    }
    .bcal-full .bcal-list {
      min-width: 0;
    }
    .bcal-full .bcal-item {
      grid-template-columns: auto minmax(0, 1fr);
      overflow-wrap: anywhere;
    }
    .bcal-full .bcal-item .status {
      grid-column: 2;
      justify-self: start;
      margin: 0;
    }
  }
  @media (max-width: 360px) {
    .bcal-full .bcal-nav {
      grid-template-columns: 34px minmax(0, 1fr) minmax(0, 0.8fr) 34px;
      gap: 5px;
    }
    .bcal-full .bcal-legend {
      font-size: 11px;
    }
    .bcal-full .bcal-panel {
      padding: 10px;
    }
  }
  .bcal-day,
  .bcal-event,
  .bcal-item {
    transition:
      background-color var(--bf-motion-soft) ease,
      border-color var(--bf-motion-soft) ease,
      box-shadow 320ms ease,
      transform 320ms var(--bf-motion-ease);
  }
  .bcal-count,
  .bcal-day-num {
    transition:
      background-color 240ms ease,
      color 240ms ease,
      border-color 240ms ease,
      box-shadow 280ms ease,
      transform 280ms var(--bf-motion-ease),
      opacity 200ms ease;
  }
  @media (hover: hover) and (pointer: fine) {
    .bcal-event:hover,
    .bcal-item:hover {
      transform: translate3d(0, -1px, 0);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .bcal-day,
    .bcal-event,
    .bcal-item,
    .bcal-count,
    .bcal-day-num {
      transition: none !important;
    }
  }
`;
