import { css } from "styled-components";

/**
 * Estilos de página Admin/Staff/StaffEditor (.photo-field, .avatar, .bf-staff-photo-actions, .btn, .bf-staff-photo-copy, .bf-staff-photo-body, .bf-photo-action, .modal, .bf-staff-photo-field, .bf-staff-photo-preview, .avatar-img, .ic, ...).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const staffEditorStyles = css`
  .photo-field {
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 14px;
    border: 1px solid var(--line);
    border-radius: 6px;
  }
  .photo-field .avatar {
    width: 72px;
    height: 72px;
    font-size: 26px;
  }
  .photo-field p {
    margin: 4px 0 10px;
    font-size: 12px;
  }
  .bf-staff-photo-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .bf-staff-photo-actions .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .bf-staff-photo-copy strong {
    display: block;
  }
  .bf-staff-photo-body {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .bf-photo-action span {
    min-width: 0;
  }
  @media (max-width: 760px) {
    .modal .bf-staff-photo-field {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 14px;
      padding: 14px;
      min-width: 0;
      border-radius: 14px;
    }
    .modal .bf-staff-photo-copy {
      min-width: 0;
    }
    .modal .bf-staff-photo-copy > strong {
      display: block;
      line-height: 1.35;
    }
    .modal .bf-staff-photo-copy p {
      margin: 5px 0 0;
      line-height: 1.45;
    }
    .modal .bf-staff-photo-body {
      display: grid;
      grid-template-columns: 96px minmax(0, 1fr);
      align-items: center;
      gap: 14px;
      min-width: 0;
    }
    .modal .bf-staff-photo-preview {
      width: 96px;
      min-width: 96px;
    }
    .modal .bf-staff-photo-preview .avatar,
    .modal .bf-staff-photo-preview .avatar-img {
      width: 96px;
      height: 96px;
      max-width: 100%;
      object-fit: cover;
      border-radius: 16px;
      font-size: 32px;
    }
    .modal .bf-staff-photo-actions {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 9px;
      width: 100%;
    }
    .modal .bf-staff-photo-actions > .btn {
      width: 100%;
      min-width: 0;
      min-height: 42px;
      padding: 9px 12px;
      text-align: center;
      font-size: 11px;
      line-height: 1.25;
      white-space: normal;
      gap: 7px;
      justify-content: center;
    }
    .modal .bf-staff-photo-actions > .btn .ic {
      flex: 0 0 auto;
      width: 14px;
      height: 14px;
    }
  }
  @media (max-width: 420px) {
    .modal .bf-staff-photo-body {
      grid-template-columns: minmax(0, 1fr);
      justify-items: center;
      gap: 12px;
    }
    .modal .bf-staff-photo-preview,
    .modal .bf-staff-photo-preview .avatar,
    .modal .bf-staff-photo-preview .avatar-img {
      width: 88px;
      height: 88px;
      min-width: 0;
    }
    .modal .bf-staff-photo-actions {
      width: 100%;
      gap: 8px;
    }
    .modal .bf-staff-photo-actions > .btn {
      min-height: 40px;
      font-size: 11px;
    }
  }
  @media (min-width: 761px) {
    .modal .bf-staff-photo-field {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.55fr);
      gap: 15px;
      align-items: center;
      padding: 14px;
      min-width: 0;
    }
    .modal .bf-staff-photo-copy {
      min-width: 0;
    }
    .modal .bf-staff-photo-copy strong {
      font-size: 13px;
    }
    .modal .bf-staff-photo-copy p {
      margin: 6px 0 0;
      font-size: 11px;
      line-height: 1.5;
    }
    .modal .bf-staff-photo-body {
      display: grid;
      grid-template-columns: 76px minmax(0, 1fr);
      gap: 12px;
      align-items: center;
      min-width: 0;
    }
    .modal .bf-staff-photo-preview {
      width: 76px;
      min-width: 76px;
    }
    .modal .bf-staff-photo-preview .avatar,
    .modal .bf-staff-photo-preview .avatar-img {
      width: 76px;
      height: 76px;
      border-radius: 12px;
      object-fit: cover;
    }
    .modal .bf-staff-photo-actions {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 7px;
    }
    .modal .bf-staff-photo-actions > .btn {
      min-width: 0;
      width: 100%;
      min-height: 36px;
      padding: 8px 7px;
      justify-content: center;
      gap: 5px;
      font-size: 10px;
      white-space: normal;
      line-height: 1.3;
    }
    .modal .bf-staff-photo-actions .ic {
      width: 14px;
      height: 14px;
      flex: 0 0 auto;
    }
  }
  .modal:has(.bf-staff-editor) {
    width: min(100%, 760px);
    padding: 26px;
  }
  .modal:has(.bf-staff-editor) .modal-head {
    margin-bottom: 18px;
  }
  .modal:has(.bf-staff-editor) .modal-head h2 {
    margin: 0;
    font-size: 28px;
  }
  .modal .bf-staff-editor {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .modal .bf-staff-editor-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .modal .bf-staff-photo-field {
    display: grid;
    grid-template-columns: minmax(220px, 260px) minmax(0, 1fr);
    gap: 18px;
    align-items: stretch;
    padding: 18px;
    border-radius: 18px;
  }
  .modal .bf-staff-photo-copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .modal .bf-staff-photo-copy strong {
    font-size: 16px;
    line-height: 1.35;
  }
  .modal .bf-staff-photo-copy p {
    margin: 8px 0 0;
    font-size: 13px;
    line-height: 1.55;
  }
  .modal .bf-staff-photo-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .modal .bf-staff-photo-preview {
    width: 150px;
    max-width: 100%;
  }
  .modal .bf-staff-photo-preview .avatar,
  .modal .bf-staff-photo-preview .avatar-img {
    width: 150px;
    height: 150px;
    border-radius: 20px;
    object-fit: cover;
  }
  .modal .bf-staff-photo-actions {
    width: 100%;
    display: grid;
    gap: 10px;
  }
  .modal .bf-staff-photo-actions > .btn {
    width: 100%;
    min-height: 44px;
    padding: 10px 14px;
    justify-content: center;
    gap: 8px;
    font-size: 12px;
    letter-spacing: 0.08em;
  }
  .modal .bf-staff-days-block strong {
    display: block;
    margin-bottom: 10px;
  }
  .modal .bf-staff-days-checks {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 14px;
  }
  .modal .bf-staff-editor-actions {
    justify-content: flex-start;
  }
  .modal .bf-staff-editor-actions .btn {
    width: 100%;
    min-height: 46px;
  }
  @media (max-width: 760px) {
    .modal:has(.bf-staff-editor) {
      width: min(100%, 420px);
      padding: 20px;
    }
    .modal:has(.bf-staff-editor) .modal-head h2 {
      font-size: 16px;
    }
    .modal .bf-staff-editor-grid {
      grid-template-columns: minmax(0, 1fr);
    }
    .modal .bf-staff-photo-field {
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
      padding: 14px;
    }
    .modal .bf-staff-photo-body {
      align-items: center;
    }
    .modal .bf-staff-photo-preview,
    .modal .bf-staff-photo-preview .avatar,
    .modal .bf-staff-photo-preview .avatar-img {
      width: 102px;
      height: 102px;
    }
  }
  .bf-staff-editor-cancel {
    display: none;
  }
  .bf-staff-days-heading > p,
  .bf-staff-days-heading p {
    display: none;
  }
  .bf-staff-days-symbol {
    display: none;
  }
  @media (min-width: 761px) {
    .modal .bf-staff-photo-field {
      display: grid;
      grid-template-columns: minmax(180px, 225px) minmax(0, 1fr);
      grid-template-rows: auto auto;
      align-items: stretch;
      column-gap: 24px;
      row-gap: 18px;
      padding: 22px;
      border-radius: 18px;
    }
    .modal .bf-staff-photo-body {
      display: contents;
    }
    .modal .bf-staff-photo-preview {
      grid-column: 1;
      grid-row: 1 / 3;
      align-self: stretch;
      width: 100%;
      min-width: 0;
      min-height: 220px;
      aspect-ratio: 1;
      border-radius: 20px;
      overflow: hidden;
    }
    .modal .bf-staff-photo-preview .avatar,
    .modal .bf-staff-photo-preview .avatar-img {
      width: 100%;
      height: 100%;
      min-height: 220px;
      max-width: none;
      border-radius: 20px;
      object-fit: cover;
      font-size: 56px;
    }
    .modal .bf-staff-photo-copy {
      grid-column: 2;
      grid-row: 1;
      justify-content: flex-end;
      align-self: end;
      padding-top: 14px;
    }
    .modal .bf-staff-photo-copy strong {
      font-size: 17px;
    }
    .modal .bf-staff-photo-copy p {
      margin: 7px 0 0;
      font-size: 12.5px;
    }
    .modal .bf-staff-photo-actions {
      grid-column: 2;
      grid-row: 2;
      align-self: start;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
      width: 100%;
    }
    .modal .bf-staff-photo-actions > .btn {
      min-height: 44px;
    }
    .modal .bf-staff-days-block {
      padding: 16px 18px;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: color-mix(in srgb, var(--panel2) 38%, var(--panel));
    }
    .modal .bf-staff-days-heading {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }
    .modal .bf-staff-days-heading strong {
      margin: 0 0 4px;
      font-size: 15px;
    }
    .modal .bf-staff-days-heading p {
      display: block;
      color: var(--muted);
      margin: 0;
      font-size: 12px;
      font-weight: 400;
    }
    .modal .bf-staff-days-symbol {
      display: inline-flex;
      color: var(--gold);
      padding-top: 2px;
    }
    .modal .bf-staff-days-symbol .ic {
      width: 22px;
      height: 22px;
    }
    .modal .bf-staff-editor-actions {
      display: flex;
      justify-content: flex-end;
      flex-wrap: nowrap;
      gap: 10px;
    }
    .modal .bf-staff-editor-actions > .btn {
      flex: 0 1 auto;
      width: auto;
      min-height: 46px;
      padding: 12px 18px;
    }
    .modal .bf-staff-editor-actions > .btn.primary {
      flex: 0 0 245px;
    }
    .modal .bf-staff-editor-actions .bf-staff-editor-cancel {
      display: inline-flex;
    }
  }
  /*
   * Dias de atendimento e status: o mesmo padrão do desktop em todas as larguras
   * (cartões com área de toque de 42px e um único select de status). Antes, o mobile
   * usava uma lista solta de caixas e uma caixa "Profissional ativo" à parte.
   */
  .modal .bf-staff-days-checks {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 7px;
  }
  .modal .bf-staff-days-checks .bf-staff-day-option {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 0;
    min-height: 42px;
    padding: 8px 3px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--panel);
    color: var(--text);
    cursor: pointer;
    font-weight: 700;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;
  }
  .modal .bf-staff-days-checks .bf-staff-day-option:has(input:checked) {
    background: color-mix(in srgb, var(--gold) 17%, var(--panel));
    border-color: color-mix(in srgb, var(--gold) 35%, var(--line));
  }
  .modal .bf-staff-days-checks input {
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: var(--gold);
  }
  .modal .bf-staff-status-select {
    display: grid;
    gap: 8px;
    width: 100%;
    font-size: 14px;
  }
  .modal .bf-staff-status-select select {
    width: 100%;
    min-height: 48px;
    padding: 10px 14px;
  }
  @media (min-width: 901px) {
    .modal .bf-staff-days-checks {
      grid-template-columns: repeat(7, minmax(0, 1fr));
    }
  }
  @media (max-width: 760px) {
    .modal .bf-staff-editor-actions .bf-staff-editor-cancel {
      display: none;
    }
  }
`;
