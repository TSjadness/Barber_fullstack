import { css } from "styled-components";

/**
 * Estilos de página Admin (.admin, .main, .bf-mobile-menu-lock).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const adminLayoutStyles = css`
  .admin {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
    min-height: calc(100vh - 72px);
  }
  .main {
    padding: 31px clamp(16px, 3vw, 43px);
    min-width: 0;
  }
  @media (max-width: 700px) {
    .admin {
      display: block;
    }
    .main {
      padding: 22px 14px;
    }
  }
  .admin {
    grid-template-columns: 240px minmax(0, 1fr);
  }
  .main {
    padding: 29px clamp(18px, 2.2vw, 40px);
  }
  @media (max-width: 760px) {
    .admin {
      grid-template-columns: 1fr;
    }
    .main {
      padding: 18px;
    }
  }
  body.theme-light .admin,
  body.theme-light .main {
    background: #f4f1ea;
    color: #1d1b17;
  }
  .main {
    transition:
      background-color 0.25s,
      color 0.25s,
      border-color 0.25s;
  }
  @media (min-width: 761px) {
    .admin {
      transition: grid-template-columns 0.2s ease;
    }
  }
  .admin {
    transition: grid-template-columns 420ms var(--motion-smooth);
  }
  @media (min-width: 761px) {
    .admin {
      min-width: 0;
      transition: grid-template-columns 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    }
  }
  @media (max-width: 760px) {
    .admin {
      display: block;
      min-width: 0;
      overflow: visible;
    }
    body.bf-mobile-menu-lock {
      overflow: hidden;
    }
    .admin .main {
      min-width: 0;
      padding: 20px 14px;
    }
    html.bf-mobile-menu-lock {
      overflow: hidden !important;
      overscroll-behavior: none;
    }
    body.bf-mobile-menu-lock {
      position: fixed !important;
      top: var(--bf-locked-scroll-top, 0px);
      left: 0;
      right: 0;
      width: 100%;
      overflow: hidden !important;
      overscroll-behavior: none;
    }
  }
`;
