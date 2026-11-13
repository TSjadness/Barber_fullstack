import { css } from "styled-components";

/**
 * Estilos de Icon (.ic, .ic-md, .ic-lg, .btn, .side-ic, .notice, .foot-line, .foot-social-link, .admin, .bf-finance-actions, .modal, .modal-head, ...).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const iconStyles = css`
  .ic {
    width: 1.05em;
    height: 1.05em;
    flex-shrink: 0;
    vertical-align: -0.18em;
    stroke-width: 1.75;
  }
  .ic-md {
    width: 24px;
    height: 24px;
  }
  .ic-lg {
    width: 34px;
    height: 34px;
    stroke-width: 2.2;
  }
  .btn .ic {
    width: 16px;
    height: 16px;
  }
  .side-ic .ic {
    width: 18px;
    height: 18px;
  }
  .notice strong .ic {
    color: var(--gold);
  }
  .foot-line .ic {
    color: var(--gold);
    flex: none;
    margin-top: 2px;
  }
  .foot-social-link .ic {
    width: 18px;
    height: 18px;
  }
  @media (max-width: 760px) {
    .admin .bf-finance-actions > .btn .ic {
      flex: 0 0 auto;
    }
  }
  .modal .modal-head .btn.small.ghost .ic {
    width: 18px;
    height: 18px;
  }
  @media (max-width: 760px) {
    .bf-pagination-mobile .bf-page-arrow .ic {
      width: 17px;
      height: 17px;
    }
  }
`;
