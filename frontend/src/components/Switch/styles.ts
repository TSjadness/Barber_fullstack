import { css } from "styled-components";

/**
 * Estilos de Switch (.switch, .switch-track).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const switchStyles = css`
  .switch {
    display: inline-flex;
    cursor: pointer;
  }
  .switch input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }
  .switch-track {
    width: 39px;
    height: 23px;
    border-radius: 30px;
    background: #54545a;
    position: relative;
    transition: 0.2s;
  }
  .switch-track:before {
    content: "";
    position: absolute;
    left: 3px;
    top: 3px;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: #fff;
    transition: 0.2s;
  }
  .switch input:checked + .switch-track {
    background: #b68c4c;
  }
  .switch input:checked + .switch-track:before {
    transform: translateX(16px);
  }
  .switch input:focus-visible + .switch-track {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }
  .switch-track,
  .switch-track::before {
    transition:
      background-color 240ms ease,
      color 240ms ease,
      border-color 240ms ease,
      box-shadow 280ms ease,
      transform 280ms var(--bf-motion-ease),
      opacity 200ms ease;
  }
  @media (prefers-reduced-motion: reduce) {
    .switch-track,
    .switch-track::before {
      transition: none !important;
    }
  }
`;
