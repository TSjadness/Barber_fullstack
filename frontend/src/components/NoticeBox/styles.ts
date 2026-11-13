import { css } from "styled-components";

/**
 * Estilos de NoticeBox (.notice).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const noticeBoxStyles = css`
  .notice {
    padding: 14px;
    background: #292217;
    border: 1px solid #6b5430;
    border-radius: 12px;
    margin-bottom: 17px;
    color: #f7d9a2;
  }
  .notice strong {
    display: block;
    margin-bottom: 4px;
  }
  .notice strong {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  body.theme-light .notice {
    background: #fbf3e3;
    border-color: #e6cf9f;
    color: #6e4c17;
  }
`;
