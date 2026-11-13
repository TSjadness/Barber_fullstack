import { css } from "styled-components";

/**
 * Estilos de LoadingOverlay (.confirm-layer, .confirm-card, .confirm-check, .spinner).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const loadingOverlayStyles = css`
  .confirm-layer {
    position: fixed;
    inset: 0;
    z-index: 250;
    background: #050505c9;
    backdrop-filter: blur(10px);
    display: grid;
    place-items: center;
    padding: 20px;
  }
  .confirm-card {
    width: min(100%, 470px);
    padding: 38px 32px;
    text-align: center;
    border-radius: 23px;
    background: linear-gradient(150deg, #282522, #151516);
    border: 1px solid #6d5a3f;
    box-shadow: 0 25px 90px #000c;
    animation: showUp 0.28s ease-out;
  }
  .confirm-card h2 {
    font-size: 27px;
    margin: 18px 0 10px;
  }
  .confirm-card p {
    line-height: 1.7;
  }
  .confirm-check {
    display: grid;
    place-items: center;
    width: 85px;
    height: 85px;
    border: 2px solid #5ecb94;
    border-radius: 50%;
    background: #143b2c;
    color: #76e6af;
    font-size: 44px;
    margin: auto;
  }
  .spinner {
    width: 55px;
    height: 55px;
    margin: 15px auto 25px;
    border: 4px solid #5a5042;
    border-top-color: var(--gold2);
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
  @media (max-width: 700px) {
    .confirm-card {
      padding: 26px 20px;
    }
  }
  .confirm-check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;
