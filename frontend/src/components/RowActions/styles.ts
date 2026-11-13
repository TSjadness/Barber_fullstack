import { css } from "styled-components";

/**
 * Estilos de RowActions (.bf-row-actions, .bf-row-action, .bf-row-action-label, .is-stacked).
 *
 * Mesmas medidas finais dos botões da Gestão de Profissionais (.bf-staff-actions):
 * desktop/tablet com botões quadrados de 44px só com ícone; no mobile, em listas
 * (`is-stacked`), botões na largura do item com ícone e texto (uma coluna até 420px).
 * Fica depois de Button e DataTable na cascata para vencer `.btn.small`.
 */
export const rowActionsStyles = css`
  .admin .bf-row-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 9px;
  }
  .admin .bf-row-actions > .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    min-width: 44px;
    height: 44px;
    min-height: 44px;
    padding: 0;
    border-radius: 12px;
  }
  .admin .bf-row-actions > .btn .ic {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
  }
  .admin .bf-row-actions .bf-row-action-label {
    display: none;
  }
  .admin .bf-row-actions > .btn:disabled {
    opacity: 0.42;
    cursor: not-allowed;
  }
  .admin .table td.bf-row-actions-cell {
    width: 1%;
    white-space: nowrap;
  }
  .admin .table .bf-row-actions {
    gap: 6px;
  }
  .admin .table .bf-row-actions > .btn {
    width: 38px;
    min-width: 38px;
    height: 38px;
    min-height: 38px;
    border-radius: 11px;
  }
  .admin .table .bf-row-actions > .btn .ic {
    width: 16px;
    height: 16px;
  }
  @media (max-width: 760px) {
    .admin .bf-row-actions.is-stacked {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      width: 100%;
    }
    .admin .bf-row-actions.is-stacked > .btn {
      width: 100%;
      min-width: 0;
      height: auto;
      min-height: 40px;
      padding: 8px 10px;
      border-radius: 11px;
      gap: 7px;
      font-size: 11px;
    }
    .admin .bf-row-actions.is-stacked > .btn .ic {
      width: 15px;
      height: 15px;
    }
    .admin .bf-row-actions.is-stacked .bf-row-action-label {
      display: inline;
      line-height: 1;
    }
  }
  @media (max-width: 420px) {
    .admin .bf-row-actions.is-stacked {
      grid-template-columns: minmax(0, 1fr);
    }
  }
`;
