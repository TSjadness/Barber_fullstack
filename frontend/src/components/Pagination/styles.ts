import { css } from "styled-components";

/**
 * Estilos de Pagination (.bf-pagination, .bf-pagination-summary, .bf-pagination-actions, .bf-pagination-page, .bf-pagination-mobile, .bf-pagination-desktop, .bf-page-number, .bf-page-arrow, .bf-page-ellipsis, .is-current).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const paginationStyles = css`
  .bf-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid rgba(205, 186, 150, 0.18);
  }
  .bf-pagination-summary {
    font-size: 12px;
    color: var(--muted);
  }
  .bf-pagination-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .bf-pagination-page {
    min-width: 108px;
    text-align: center;
    font-size: 12px;
    color: var(--muted);
  }
  @media (max-width: 760px) {
    .bf-pagination {
      flex-direction: column;
      align-items: stretch;
    }
    .bf-pagination-actions {
      justify-content: stretch;
    }
    .bf-pagination-page {
      width: 100%;
    }
  }
  .bf-pagination-mobile {
    display: none;
  }
  @media (max-width: 760px) {
    .bf-pagination {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .bf-pagination-actions.bf-pagination-desktop {
      display: none;
    }
    .bf-pagination-mobile {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: nowrap;
      gap: clamp(3px, 1.3vw, 7px);
      width: 100%;
      min-width: 0;
    }
    .bf-pagination-mobile .bf-page-number,
    .bf-pagination-mobile .bf-page-arrow,
    .bf-pagination-mobile .bf-page-ellipsis {
      display: inline-flex;
      flex: 0 1 auto;
      align-items: center;
      justify-content: center;
      width: clamp(25px, 8.2vw, 34px);
      height: clamp(30px, 8.7vw, 36px);
      min-width: 0;
      padding: 0;
      border: 1px solid var(--line);
      border-radius: 50%;
      background: var(--panel2);
      color: var(--text);
      font-size: 12px;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
    }
    .bf-pagination-mobile .bf-page-ellipsis {
      background: transparent;
      border-color: transparent;
      cursor: default;
      font-size: 17px;
    }
    .bf-pagination-mobile .bf-page-number.is-current {
      background: var(--gold);
      border-color: var(--gold);
      color: #221a0d;
    }
    .bf-pagination-mobile .bf-page-arrow {
      background: transparent;
      border-color: transparent;
      color: var(--gold2);
    }
    .bf-pagination-mobile button:disabled {
      opacity: 0.28;
      cursor: not-allowed;
    }
    body.theme-light .bf-pagination-mobile .bf-page-number {
      background: #fff;
      border-color: #ded2bf;
      color: #4b3c28;
    }
    body.theme-light .bf-pagination-mobile .bf-page-number.is-current {
      background: #b9862e;
      border-color: #b9862e;
      color: #fff;
    }
    body.theme-light .bf-pagination-mobile .bf-page-arrow {
      color: #9b6b21;
      background: transparent;
      border-color: transparent;
    }
    body.theme-light .bf-pagination-mobile .bf-page-ellipsis {
      background: transparent;
      border-color: transparent;
    }
  }
  .bf-pagination-mobile .bf-page-number,
  .bf-pagination-mobile .bf-page-arrow {
    transition:
      background-color var(--bf-motion-soft) ease,
      border-color var(--bf-motion-soft) ease,
      box-shadow 320ms ease,
      transform 320ms var(--bf-motion-ease);
  }
  @media (hover: hover) and (pointer: fine) {
    .bf-pagination-mobile button:not(:disabled):hover {
      transform: translate3d(0, -2px, 0);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .bf-pagination-mobile .bf-page-number,
    .bf-pagination-mobile .bf-page-arrow {
      transition: none !important;
    }
  }
`;
