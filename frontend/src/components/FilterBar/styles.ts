import { css } from "styled-components";

/**
 * Estilos de FilterBar (.filter-bar, .filter-actions, .filter-count, .filter-clear).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const filterBarStyles = css`
  .filter-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
    align-items: end;
    margin-bottom: 10px;
  }
  .filter-actions {
    display: flex;
    gap: 8px;
  }
  .filter-count {
    margin: 4px 2px 12px;
    font-size: 13px;
  }
  .filter-clear {
    border-radius: 12px;
  }
  .filter-actions .filter-clear {
    min-height: 44px;
    background: #edba4d;
    color: #30210b;
    border: 1px solid #e3a83e;
    font-weight: 800;
    box-shadow: none;
    opacity: 1;
  }
  .filter-actions .filter-clear:hover:not(:disabled) {
    background: #f3cb70;
    color: #241807;
  }
  .filter-actions .filter-clear:disabled {
    opacity: 0.43;
    background: #957b4c;
    color: #30281c;
    border-color: #8b744d;
    cursor: not-allowed;
    box-shadow: none;
  }
  body.theme-light .filter-actions .filter-clear {
    background: #e5ae43;
    color: #29200d;
  }
  body.theme-light .filter-actions .filter-clear:disabled {
    background: #dccca7;
    color: #8e805f;
    opacity: 0.7;
  }
  @media (max-width: 760px) {
    /* Mobile: pares de filtros em 2 colunas; busca (.filter-wide) e Limpar em linha inteira. */
    .filter-bar {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px 12px;
    }
    .filter-bar > .filter-wide,
    .filter-bar > .filter-actions {
      grid-column: 1 / -1;
    }
    .filter-bar > .filter-actions > .filter-clear {
      width: 100%;
      min-height: 44px;
    }
  }
  .filter-clear {
    transition:
      background-color 240ms ease,
      color 240ms ease,
      border-color 240ms ease,
      box-shadow 280ms ease,
      transform 280ms var(--bf-motion-ease),
      opacity 200ms ease;
  }
  /* Campos de texto com a mesma altura dos selects e do botão Limpar. */
  .filter-bar input {
    min-height: 44px;
  }
  .filter-bar input,
  .filter-bar select {
    transition:
      border-color 240ms ease,
      box-shadow 240ms ease,
      background-color 240ms ease;
  }
  @media (prefers-reduced-motion: reduce) {
    .filter-clear,
    .filter-bar input,
    .filter-bar select {
      transition: none !important;
    }
  }
`;
