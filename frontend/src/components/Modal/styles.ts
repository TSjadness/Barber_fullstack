import { css } from "styled-components";

/**
 * Estilos de Modal (.modal-bg, .modal, .modal-head).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const modalStyles = css`
  .modal-bg {
    position: fixed;
    inset: 0;
    background: #000a;
    display: grid;
    place-items: center;
    z-index: 90;
    padding: 18px;
  }
  .modal {
    width: min(100%, 540px);
    max-height: 90vh;
    overflow: auto;
    background: #1d1e20;
    border: 1px solid #454547;
    border-radius: 18px;
    padding: 25px;
    box-shadow: 0 20px 100px #0009;
  }
  .modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .modal-head h2 {
    margin: 0 0 20px;
  }
  .modal-bg {
    backdrop-filter: blur(10px);
  }
  body.theme-light .modal {
    background: #fff;
    border-color: #e2dccf;
    color: #1d1b17;
    box-shadow: 0 4px 18px #5a46200d;
  }
  body.theme-light .modal-bg {
    background: #2a221466;
  }
  .modal-bg {
    animation: bf-overlay-enter 220ms ease-out both;
  }
  .modal-bg > .modal {
    animation: bf-dialog-enter 340ms var(--bf-motion-ease) both;
    transform-origin: center;
  }
  @media (prefers-reduced-motion: reduce) {
    .modal-bg,
    .modal-bg > .modal {
      animation: none !important;
    }
  }
`;
