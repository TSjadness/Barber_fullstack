import { css } from "styled-components";

/**
 * Estilos de StatusBadge (.status, .confirmado, .pendente, .concluido, .cancelado).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const statusBadgeStyles = css`
  .status {
    font-size: 11px;
    padding: 5px 9px;
    border-radius: 20px;
    display: inline-block;
    background: #323234;
    color: #ddd;
  }
  .status.confirmado {
    background: #1d3b2b;
    color: #81dca9;
  }
  .status.pendente {
    background: #47391c;
    color: #f5d38c;
  }
  .status.concluido {
    background: #243549;
    color: #a8c7ff;
  }
  .status.cancelado {
    background: #42272b;
    color: #f9a1a6;
  }
  .status.concluido {
    background: #1d3b2b;
    color: #81dca9;
  }
  .status.confirmado {
    background: #203d30;
    color: #85e6aa;
  }
  .status {
    font-size: 12.5px;
  }
  .status {
    transition:
      background-color 240ms ease,
      color 240ms ease,
      border-color 240ms ease,
      box-shadow 280ms ease,
      transform 280ms var(--bf-motion-ease),
      opacity 200ms ease;
  }
  @media (prefers-reduced-motion: reduce) {
    .status {
      transition: none !important;
    }
  }
`;
