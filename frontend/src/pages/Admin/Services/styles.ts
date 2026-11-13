import { css } from "styled-components";

/**
 * Estilos de página Admin/Services (.admin, .bf-service-list, .bf-service-row, .bf-service-details, .ic, .bf-row-actions).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const servicesStyles = css`
  @media (max-width: 760px) {
    .admin .bf-service-list {
      padding: 12px;
      min-width: 0;
    }
    .admin .bf-service-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
      margin-bottom: 9px;
      padding: 14px 12px;
      min-width: 0;
    }
    .admin .bf-service-row:last-child {
      margin-bottom: 0;
    }
    .admin .bf-service-details {
      min-width: 0;
    }
    .admin .bf-service-details strong {
      display: flex;
      align-items: center;
      gap: 7px;
      line-height: 1.4;
    }
    .admin .bf-service-details strong .ic {
      flex: 0 0 auto;
    }
    .admin .bf-service-details p {
      margin: 5px 0 0;
      line-height: 1.5;
      overflow-wrap: break-word;
    }
    /* Ações embaixo, na largura do item, como na Gestão de Profissionais. */
    .admin .bf-service-row .bf-row-actions {
      grid-column: 1 / -1;
    }
  }
  .admin .bf-service-row {
    transition:
      background-color var(--bf-motion-soft) ease,
      border-color var(--bf-motion-soft) ease,
      box-shadow 320ms ease,
      transform 320ms var(--bf-motion-ease);
  }
  @media (hover: hover) and (pointer: fine) {
    .admin .bf-service-row:hover {
      transform: translate3d(0, -2px, 0);
      box-shadow: 0 9px 24px rgba(0, 0, 0, 0.09);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .admin .bf-service-row {
      transition: none !important;
    }
  }
`;
