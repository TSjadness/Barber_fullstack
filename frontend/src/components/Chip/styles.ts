import { css } from "styled-components";

/**
 * Estilos de Chip (.chip, .mini-badge).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const chipStyles = css`
  .chip {
    border: 1px solid #59492e;
    background: #29241b;
    color: var(--gold2);
    padding: 6px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .mini-badge {
    padding: 5px 8px;
    border-radius: 8px;
    background: #292b2d;
    font-size: 11px;
  }
  .chip {
    font-size: 12.5px;
    padding: 8px 12px;
  }
  body.theme-light .chip,
  body.theme-light .mini-badge {
    background: #f3e6cc;
    border-color: #e0c690;
    color: #6e4c17;
  }
  .chip {
    font-size: 12.5px;
  }
  .chip {
    transition:
      background-color 240ms ease,
      color 240ms ease,
      border-color 240ms ease,
      box-shadow 280ms ease,
      transform 280ms var(--bf-motion-ease),
      opacity 200ms ease;
  }
  @media (prefers-reduced-motion: reduce) {
    .chip {
      transition: none !important;
    }
  }
`;
