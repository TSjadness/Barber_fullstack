import { css } from "styled-components";

/**
 * Tema claro da gestão aplicado a elementos genéricos (títulos, textos e campos).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const lightThemeStyles = css`
  body.theme-light h1,
  body.theme-light h2,
  body.theme-light h3,
  body.theme-light strong,
  body.theme-light b {
    color: #1d1b17;
  }
  body.theme-light input,
  body.theme-light select,
  body.theme-light textarea {
    background: #fff;
    color: #1d1b17;
    border-color: #d9d1c1;
  }
  body.theme-light label {
    color: #4d483f;
  }
  body.theme-light small {
    color: #6f6a60;
  }
`;
