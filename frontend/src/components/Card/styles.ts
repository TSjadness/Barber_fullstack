import { css } from "styled-components";

/**
 * Estilos de Card (.card).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const cardStyles = css`
  .card {
    border: 1px solid var(--line);
    background: var(--panel);
    border-radius: var(--radius);
    padding: 20px;
  }
  .card h3 {
    margin-bottom: 16px;
    font-size: 19px;
  }
  .card {
    box-shadow: 0 8px 25px #0001;
  }
  .card {
    background: linear-gradient(160deg, #232326, #18191b);
  }
  .card {
    transition:
      border-color 0.2s,
      transform 0.2s;
  }
  body.theme-light .card {
    background: #fff;
    border-color: #e2dccf;
    color: #1d1b17;
    box-shadow: 0 4px 18px #5a46200d;
  }
  .card {
    transition:
      background-color 0.25s,
      color 0.25s,
      border-color 0.25s;
  }
  .card {
    transition:
      transform 330ms var(--motion-smooth),
      border-color 330ms ease,
      box-shadow 330ms ease;
  }
`;
