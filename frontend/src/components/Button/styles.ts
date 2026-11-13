import { css } from "styled-components";

/**
 * Estilos de Button (.btn, .primary, .ghost, .danger, .small, .top-actions, .text-action, .filter-actions, .form-actions, .topbar, .topbar-public, .bf-finance-actions, ...).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const buttonStyles = css`
  .btn {
    border: 1px solid var(--line);
    background: #222326;
    color: var(--text);
    padding: 11px 17px;
    border-radius: 10px;
    font-weight: 700;
    display: inline-flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    transition: 0.15s;
  }
  .btn:hover {
    filter: brightness(1.15);
  }
  .btn.primary {
    background: var(--gold);
    border-color: var(--gold);
    color: #17140f;
  }
  .btn.ghost {
    background: transparent;
  }
  .btn.danger {
    border-color: #713b3b;
    color: #ff9999;
    background: #2d2022;
  }
  .btn.small {
    padding: 8px 12px;
    font-size: 12px;
  }
  @media (max-width: 420px) {
    .top-actions .btn {
      padding: 9px;
    }
    .top-actions .btn span {
      display: none;
    }
  }
  .btn {
    transition:
      transform 0.2s,
      background 0.2s,
      border-color 0.2s,
      box-shadow 0.2s;
  }
  .btn:hover {
    transform: translateY(-2px);
    filter: none;
    box-shadow: 0 6px 28px #0003;
  }
  .btn.primary {
    background: linear-gradient(115deg, #edc98d, #c79a52);
    box-shadow: 0 6px 25px #c1974f19;
  }
  .btn {
    border-radius: 12px;
  }
  .btn.primary {
    background: linear-gradient(180deg, #ffdf8e, #dba33e);
    border-color: #f6ca73;
    color: #24190b;
    box-shadow: 0 4px 16px #d9a13d20;
  }
  .btn:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }
  .text-action {
    border: 0;
    background: transparent;
    color: #f0c35e;
    text-decoration: underline;
    text-underline-offset: 4px;
    font-weight: 700;
    white-space: nowrap;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .text-action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
  .btn {
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 11.5px;
    font-weight: 700;
    box-shadow: none;
  }
  .btn:hover {
    transform: none;
    box-shadow: none;
  }
  .btn.primary {
    background: var(--gold);
    border-color: var(--gold);
    color: #121110;
    box-shadow: none;
  }
  .btn.primary:hover {
    background: transparent;
    color: var(--gold2);
  }
  .btn.ghost {
    border-color: #3a3631;
  }
  .btn.ghost:hover {
    border-color: var(--gold);
    color: var(--gold2);
  }
  .btn.small {
    font-size: 10.5px;
    padding: 9px 13px;
  }
  body.theme-light .btn {
    background: #fff;
    color: #1d1b17;
    border-color: #d9d1c1;
  }
  body.theme-light .btn.ghost {
    background: transparent;
  }
  body.theme-light .btn.primary {
    background: #b8862f;
    border-color: #b8862f;
    color: #fff;
  }
  body.theme-light .btn.danger {
    background: #fbeceb;
    color: #a33a3a;
    border-color: #e7b9b6;
  }
  .filter-actions .btn {
    flex: 1;
  }
  .form-actions .btn {
    flex: 1 1 180px;
  }
  .btn.small {
    font-size: 13px;
  }
  .btn,
  .text-action {
    transition:
      transform var(--motion-normal) var(--motion-smooth),
      background-color var(--motion-normal) ease,
      border-color var(--motion-normal) ease,
      box-shadow var(--motion-normal) ease,
      color var(--motion-fast) ease,
      opacity var(--motion-fast) ease;
  }
  .btn,
  .btn.small {
    border-radius: 12px;
  }
  .btn.primary,
  .btn.ghost {
    border-radius: 14px;
  }
  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px #0002;
  }
  .btn:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }
  .btn:focus-visible {
    outline: 2px solid var(--gold2);
    outline-offset: 3px;
  }
  @media (max-width: 760px) {
    .topbar:not(.topbar-public) .top-actions > .btn {
      display: none !important;
    }
    .bf-finance-actions .btn {
      width: 100%;
      min-width: 0;
      min-height: 48px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      white-space: normal;
      padding: 10px;
      font-size: 12px;
    }
    .admin .bf-finance-actions > .btn {
      width: 100%;
      min-width: 0;
      min-height: 46px;
      padding: 11px 14px;
      font-size: 12px;
      line-height: 1.35;
      white-space: normal;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 9px;
    }
  }
  @media (min-width: 761px) {
    .admin .bf-calendar-actions > .btn {
      width: 100%;
      min-width: 0;
      min-height: 44px;
      padding: 9px 12px;
      justify-content: center;
      text-align: center;
      gap: 7px;
      white-space: normal;
      line-height: 1.25;
    }
  }
  @media (max-width: 760px) {
    .admin .bf-calendar-actions > .btn {
      width: 100%;
      min-width: 0;
      min-height: 44px;
      padding: 10px 8px;
      justify-content: center;
      white-space: normal;
      text-align: center;
      font-size: 11px;
      line-height: 1.3;
    }
  }
  .modal .modal-head .btn.small.ghost {
    width: 44px;
    min-width: 44px;
    height: 44px;
    padding: 0;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-color: rgba(212, 190, 145, 0.42);
    color: #f3ede3;
  }
  body.theme-light .modal .modal-head .btn.small.ghost {
    color: #2f2821;
    border-color: #d6c4a2;
  }
  @media (max-width: 760px) {
    .bf-pagination-actions > .btn {
      flex: 1 1 0;
    }
  }
`;
