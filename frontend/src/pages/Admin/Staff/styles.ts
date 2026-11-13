import { css } from "styled-components";

/**
 * Estilos de página Admin/Staff (.bf-staff-remove, .bf-staff-content, .bf-staff-main, .bf-staff-details, .bf-staff-role, .bf-staff-days, .bf-staff-meta, .bf-staff-badge, .is-active, .is-inactive, .bf-staff-hours, .ic, ...).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const staffStyles = css`
  .bf-staff-remove {
    display: none;
  }
  .bf-staff-content {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  .bf-staff-main,
  .bf-staff-details {
    min-width: 0;
  }
  .bf-staff-role,
  .bf-staff-days {
    overflow-wrap: break-word;
  }
  .bf-staff-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }
  .bf-staff-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 26px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
  }
  .bf-staff-badge.is-active {
    background: #1d3b2b;
    color: #81dca9;
  }
  .bf-staff-badge.is-inactive {
    background: #42272b;
    color: #f9a1a6;
  }
  .bf-staff-hours {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--muted);
  }
  .bf-staff-hours .ic {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
  }
  .bf-action-icon {
    display: none;
  }
  @media (max-width: 760px) {
    .admin .bf-staff-list {
      padding: 12px;
      min-width: 0;
    }
    .admin .bf-staff-row:last-child {
      margin-bottom: 0;
    }
    .admin .bf-staff-row {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      padding: 14px 13px;
      min-width: 0;
      margin-bottom: 10px;
      border-radius: 16px;
    }
    .admin .bf-staff-main {
      display: flex;
      flex-direction: column;
      gap: 9px;
      min-width: 0;
    }
    .admin .bf-staff-content {
      gap: 12px;
      min-width: 0;
      align-items: center;
    }
    .admin .bf-staff-content > .avatar,
    .admin .bf-staff-content > .avatar-img {
      flex: 0 0 60px;
      width: 60px;
      height: 60px;
      border-radius: 15px;
      object-fit: cover;
    }
    .admin .bf-staff-details strong {
      display: block;
      line-height: 1.3;
      font-size: 14px;
      overflow-wrap: break-word;
    }
    .admin .bf-staff-role {
      margin: 4px 0 0;
      font-size: 12px;
      line-height: 1.45;
      color: #6d6e73;
    }
    .admin .bf-staff-meta {
      gap: 7px;
    }
    .admin .bf-staff-days {
      margin: 0;
      font-size: 12px;
      line-height: 1.5;
      color: #6d6e73;
    }
    .admin .bf-staff-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      width: 100%;
    }
    .admin .bf-staff-actions > .btn {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      min-height: 40px;
      width: 100%;
      min-width: 0;
      padding: 8px 10px;
      border-radius: 11px;
      gap: 7px;
      font-size: 11px;
    }
    .admin .bf-staff-actions .bf-action-icon,
    .admin .bf-staff-actions .bf-staff-remove {
      display: inline-flex;
    }
    .admin .bf-staff-actions .bf-action-icon .ic,
    .admin .bf-staff-actions > .btn .ic {
      width: 15px;
      height: 15px;
      flex: 0 0 auto;
    }
    .admin .bf-staff-actions .bf-action-label {
      line-height: 1;
    }
    .admin .bf-staff-actions .bf-staff-remove:disabled {
      opacity: 0.42;
      cursor: not-allowed;
    }
  }
  @media (max-width: 420px) {
    .admin .bf-staff-actions {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 760px) {
    .admin .bf-staff-row {
      position: relative;
    }
    .admin .bf-staff-content {
      padding-right: 73px;
    }
    .admin .bf-staff-meta .bf-staff-badge {
      position: absolute;
      top: 15px;
      right: 13px;
      max-width: 74px;
      z-index: 1;
    }
    .admin .bf-staff-meta {
      min-height: 20px;
    }
  }
  @media (min-width: 761px) {
    .admin .bf-staff-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 24px;
      row-gap: 8px;
      padding: 16px 18px;
      margin-bottom: 10px;
    }
    .admin .bf-staff-main {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(135px, 0.7fr) minmax(165px, 0.9fr);
      align-items: center;
      gap: 14px 22px;
      min-width: 0;
    }
    .admin .bf-staff-content {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .admin .bf-staff-content > .avatar,
    .admin .bf-staff-content > .avatar-img {
      width: 58px;
      height: 58px;
      flex: 0 0 58px;
      border-radius: 13px;
      object-fit: cover;
    }
    .admin .bf-staff-details strong {
      display: block;
      font-size: 14px;
      line-height: 1.4;
    }
    .admin .bf-staff-role {
      margin: 4px 0 0;
      font-size: 12px;
      line-height: 1.45;
    }
    .admin .bf-staff-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .admin .bf-staff-days {
      margin: 0;
      font-size: 12px;
      line-height: 1.5;
    }
    .admin .bf-staff-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }
    .admin .bf-staff-actions .bf-staff-edit {
      min-height: 40px;
      padding: 9px 16px;
      white-space: nowrap;
    }
    .admin .bf-staff-actions .bf-action-icon {
      display: none;
    }
    .admin .bf-staff-actions .bf-staff-remove {
      display: none;
    }
  }
  @media (min-width: 761px) and (max-width: 1180px) {
    .admin .bf-staff-main {
      grid-template-columns: minmax(0, 1fr) minmax(130px, auto);
      gap: 7px 12px;
    }
    .admin .bf-staff-days {
      grid-column: 1 / -1;
    }
  }
  .bf-staff-name-line {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .bf-staff-inline-meta {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }
  @media (min-width: 761px) {
    .admin .bf-staff-list {
      padding: 18px;
    }
    .admin .bf-staff-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 18px;
      padding: 18px 20px;
      border-radius: 18px;
    }
    .admin .bf-staff-main {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
      min-width: 0;
    }
    .admin .bf-staff-content {
      align-items: center;
      gap: 16px;
    }
    .admin .bf-staff-content > .avatar,
    .admin .bf-staff-content > .avatar-img {
      width: 68px;
      height: 68px;
      flex: 0 0 68px;
      border-radius: 16px;
    }
    .admin .bf-staff-details strong {
      font-size: 18px;
      line-height: 1.25;
    }
    .admin .bf-staff-role {
      margin: 0;
      font-size: 14px;
      line-height: 1.45;
    }
    .admin .bf-staff-days {
      margin: 0;
      font-size: 13px;
      line-height: 1.55;
    }
    .admin .bf-staff-meta {
      display: contents;
    }
    .admin .bf-staff-badge {
      position: static;
      max-width: none;
    }
    .admin .bf-staff-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .admin .bf-staff-actions > .btn {
      width: 44px;
      min-width: 44px;
      height: 44px;
      min-height: 44px;
      padding: 0;
      border-radius: 12px;
      justify-content: center;
    }
    .admin .bf-staff-actions .bf-action-icon,
    .admin .bf-staff-actions .bf-staff-remove {
      display: inline-flex;
    }
    .admin .bf-staff-actions .bf-action-icon .ic,
    .admin .bf-staff-actions > .btn .ic {
      width: 18px;
      height: 18px;
    }
    .admin .bf-staff-actions .bf-action-label {
      display: none;
    }
  }
  @media (max-width: 760px) {
    .admin .bf-staff-row {
      position: relative;
    }
    .admin .bf-staff-name-line {
      padding-right: 78px;
    }
    .admin .bf-staff-name-line .bf-staff-badge {
      position: absolute;
      top: 14px;
      right: 14px;
      max-width: 74px;
      z-index: 1;
    }
  }
  @media (min-width: 761px) {
    .admin .bf-staff-row .bf-staff-actions {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      gap: 9px;
    }
  }
  .admin .bf-staff-row {
    transition:
      background-color var(--bf-motion-soft) ease,
      border-color var(--bf-motion-soft) ease,
      box-shadow 320ms ease,
      transform 320ms var(--bf-motion-ease);
  }
  .bf-staff-badge {
    transition:
      background-color 240ms ease,
      color 240ms ease,
      border-color 240ms ease,
      box-shadow 280ms ease,
      transform 280ms var(--bf-motion-ease),
      opacity 200ms ease;
  }
  @media (hover: hover) and (pointer: fine) {
    .admin .bf-staff-row:hover {
      transform: translate3d(0, -2px, 0);
      box-shadow: 0 9px 24px rgba(0, 0, 0, 0.09);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .admin .bf-staff-row,
    .bf-staff-badge {
      transition: none !important;
    }
  }
`;
