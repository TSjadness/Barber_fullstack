import { css } from "styled-components";

/**
 * Estilos de página Admin/Settings (.set-social, .admin, .bf-settings-card, .bf-settings-form, .bf-settings-social, .bf-settings-address, .bf-settings-save).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const settingsStyles = css`
  .set-social {
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 14px 16px 16px;
    margin: 0;
    display: grid;
    gap: 12px;
  }
  .set-social legend {
    padding: 0 8px;
    font-weight: 600;
    font-size: 0.9rem;
  }
  .admin .bf-settings-card {
    width: 100%;
    max-width: 1120px;
  }
  .admin .bf-settings-form {
    min-width: 0;
  }
  .admin .bf-settings-form > label,
  .admin .bf-settings-social {
    min-width: 0;
  }
  @media (min-width: 1024px) {
    .admin .bf-settings-form {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: start;
      gap: 18px 20px;
    }
    .admin .bf-settings-social,
    .admin .bf-settings-address,
    .admin .bf-settings-save {
      grid-column: 1 / -1;
    }
    .admin .bf-settings-social {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px 18px;
      min-width: 0;
    }
    .admin .bf-settings-social > small {
      grid-column: 1 / -1;
    }
    .admin .bf-settings-save {
      width: 100%;
      min-height: 44px;
    }
  }
  .bf-settings-form input,
  .bf-settings-form textarea {
    transition:
      border-color 240ms ease,
      box-shadow 240ms ease,
      background-color 240ms ease;
  }
  @media (prefers-reduced-motion: reduce) {
    .bf-settings-form input,
    .bf-settings-form textarea {
      transition: none !important;
    }
  }
`;
