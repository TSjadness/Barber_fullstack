import { css } from "styled-components";

/**
 * Estilos de ConfirmDialog (.bf-confirm-delete, .bf-confirm-delete-icon, .bf-confirm-delete-actions, .btn, .modal, .modal-head).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 * Antes ficava em Admin/Staff/ConfirmRemoveStaff; agora atende todas as confirmações.
 */
export const confirmDialogStyles = css`
  .bf-confirm-delete {
    text-align: center;
  }
  .bf-confirm-delete-icon {
    width: 58px;
    height: 58px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    margin: 0 auto 14px;
    background: #2d2022;
    color: #ff9d9d;
    border: 1px solid #713b3b;
  }
  .bf-confirm-delete > p {
    margin: 0 0 10px;
    line-height: 1.5;
  }
  .bf-confirm-delete-actions {
    justify-content: center;
  }
  @media (max-width: 420px) {
    .bf-confirm-delete-actions {
      flex-direction: column;
    }
    .bf-confirm-delete-actions .btn {
      width: 100%;
    }
  }
  .modal .bf-confirm-delete {
    max-width: 100%;
  }
  .modal .bf-confirm-delete-actions {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    width: 100%;
  }
  .modal .bf-confirm-delete-actions > .btn {
    flex: 0 1 auto;
    width: auto;
    height: 42px;
    min-height: 42px;
    max-height: 42px;
    padding: 0 15px;
    font-size: 11px;
    line-height: 1.2;
    white-space: nowrap;
    border-radius: 10px;
  }
  .modal .bf-confirm-delete-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
  }
  @media (max-width: 760px) {
    .modal:has(.bf-confirm-delete) {
      width: min(100%, 390px);
      padding: 20px;
    }
    .modal:has(.bf-confirm-delete) .modal-head h2 {
      margin-bottom: 12px;
      font-size: 16px;
    }
    .modal .bf-confirm-delete-actions > .btn {
      min-width: 0;
      flex: 1 1 0;
      font-size: 10px;
      padding: 0 8px;
    }
  }
  @media (max-width: 360px) {
    .modal .bf-confirm-delete-actions {
      flex-direction: column;
      gap: 8px;
    }
    .modal .bf-confirm-delete-actions > .btn {
      flex: 0 0 42px;
      width: 100%;
    }
  }
  .modal:has(.bf-confirm-delete) {
    width: min(100%, 500px);
    padding: 24px;
  }
  .modal:has(.bf-confirm-delete) .modal-head {
    margin-bottom: 10px;
  }
  .modal:has(.bf-confirm-delete) .modal-head h2 {
    margin: 0;
    font-size: 18px;
  }
  .modal .bf-confirm-delete {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
  }
  .modal .bf-confirm-delete > p {
    max-width: 380px;
    margin: 0;
  }
  .modal .bf-confirm-delete-icon {
    width: 58px;
    height: 58px;
    margin: 0;
  }
  .modal .bf-confirm-delete-actions {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 8px;
  }
  .modal .bf-confirm-delete-actions > .btn {
    width: 100%;
    min-width: 0;
    height: 44px;
    min-height: 44px;
    justify-content: center;
    padding: 0 12px;
    border-radius: 12px;
    white-space: nowrap;
  }
  @media (max-width: 760px) {
    .modal .bf-confirm-delete-actions {
      grid-template-columns: minmax(0, 1fr);
    }
    .modal .bf-confirm-delete-actions > .btn {
      white-space: normal;
      height: auto;
      min-height: 44px;
      padding: 10px 12px;
    }
  }
`;
