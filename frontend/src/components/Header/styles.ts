import { css } from "styled-components";

/**
 * Estilos de Header (.brand, .topbar, .mark, .top-actions, .mobile-nav, .only-desktop, .brand-logo, .brand-name, .theme-toggle, .topbar-public, .nav-link, .bf-mobile-menu-button, ...).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const headerStyles = css`
  .brand {
    font-family: Outfit, sans-serif;
  }
  .topbar {
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 clamp(18px, 4vw, 62px);
    border-bottom: 1px solid #29292b;
    background: #111214;
    position: sticky;
    top: 0;
    z-index: 30;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.8px;
  }
  .mark {
    width: 37px;
    height: 37px;
    background: linear-gradient(135deg, var(--gold2), #a57a36);
    border-radius: 11px;
    display: grid;
    place-items: center;
    color: #131313;
    font-size: 23px;
    font-weight: 800;
  }
  .top-actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .mobile-nav {
    display: none;
  }
  @media (max-width: 700px) {
    .topbar {
      height: 65px;
      padding: 0 15px;
    }
    .brand {
      font-size: 17px;
    }
    .mark {
      height: 33px;
      width: 33px;
    }
    .top-actions .only-desktop {
      display: none;
    }
  }
  .topbar {
    backdrop-filter: blur(20px);
    background: #111113ed;
  }
  .topbar .brand {
    letter-spacing: 0.7px;
  }
  .mark {
    border-radius: 9px;
    box-shadow: 0 0 0 4px #d9b37313;
  }
  .topbar {
    background: #101114;
    border-bottom-color: #292623;
    box-shadow: 0 3px 28px #0004;
  }
  .brand {
    letter-spacing: 0.03em;
  }
  .mark {
    background: linear-gradient(140deg, #ffe4a5, #bc7d24);
    box-shadow: 0 0 20px #e9b65130;
  }
  .brand-logo {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
    border: 1px solid #3d3527;
    background: #000;
  }
  .brand-name {
    display: flex;
    flex-direction: column;
    line-height: 1;
    letter-spacing: 2px;
    font-size: 17px;
  }
  .brand-name small {
    font:
      600 9px "DM Sans",
      sans-serif;
    letter-spacing: 4px;
    color: var(--muted);
    text-transform: uppercase;
    margin-top: 5px;
  }
  @media (max-width: 600px) {
    .brand-name {
      font-size: 14px;
    }
    .brand-logo {
      width: 38px;
      height: 38px;
    }
  }
  .theme-toggle {
    padding: 10px 12px;
  }
  body.theme-light .topbar {
    background: #fffdf8;
    border-color: #e2dccf;
  }
  body.theme-light .brand-name {
    color: #1d1b17;
  }
  .topbar {
    transition:
      background-color 0.25s,
      color 0.25s,
      border-color 0.25s;
  }
  @media (min-width: 701px) {
    .topbar.topbar-public {
      padding: 0 max(25px, calc((100% - 1230px) / 2));
    }
  }
  .nav-link {
    transition:
      transform var(--motion-normal) var(--motion-smooth),
      background-color var(--motion-normal) ease,
      border-color var(--motion-normal) ease,
      box-shadow var(--motion-normal) ease,
      color var(--motion-fast) ease,
      opacity var(--motion-fast) ease;
  }
  .brand,
  .brand-name {
    font-family:
      "Manrope",
      -apple-system,
      BlinkMacSystemFont,
      sans-serif !important;
  }
  .bf-mobile-menu-button {
    display: none;
  }
  @media (max-width: 760px) {
    .topbar {
      z-index: 90;
    }
    .topbar:not(.topbar-public) .bf-mobile-menu-button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      width: 44px;
      height: 44px;
      border: 1px solid var(--line);
      background: var(--panel);
      color: var(--gold);
      border-radius: 13px;
      cursor: pointer;
      flex-shrink: 0;
    }
    .bf-mobile-menu-button span {
      width: 20px;
      height: 2px;
      background: currentColor;
      border-radius: 4px;
      transition:
        transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.2s ease;
    }
    .topbar:has(+ .admin.bf-mobile-open) .bf-mobile-menu-button span:first-child {
      transform: translateY(7px) rotate(45deg);
    }
    .topbar:has(+ .admin.bf-mobile-open) .bf-mobile-menu-button span:nth-child(2) {
      opacity: 0;
    }
    .topbar:has(+ .admin.bf-mobile-open) .bf-mobile-menu-button span:last-child {
      transform: translateY(-7px) rotate(-45deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .bf-mobile-menu-button span {
      transition: none !important;
    }
  }
  @media (max-width: 760px) {
    body.bf-mobile-menu-lock .topbar:not(.topbar-public) {
      position: fixed !important;
      top: 0 !important;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 90;
    }
  }
  .bf-mobile-icon {
    display: none;
  }
`;
