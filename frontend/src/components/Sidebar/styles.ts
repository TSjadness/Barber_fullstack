import { css } from "styled-components";

/**
 * Estilos de Sidebar (.sidebar, .side-label, .side-btn, .active, .side-menu, .side-ic, .side-foot, .side-exit, .side-top, .side-toggle, .admin, .side-collapsed, ...).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const sidebarStyles = css`
  .sidebar {
    background: #141517;
    border-right: 1px solid var(--line);
    padding: 24px 14px;
  }
  .side-label {
    padding: 7px 14px 15px;
    color: #77787d;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 10px;
    font-weight: 800;
  }
  .side-btn {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 11px;
    padding: 13px 15px;
    color: #a5a5a8;
    border: 0;
    background: transparent;
    border-radius: 11px;
    text-align: left;
    font-weight: 700;
    margin: 4px 0;
  }
  .side-btn:hover {
    background: #252527;
    color: #fff;
  }
  .side-btn.active {
    background: #30291d;
    color: var(--gold2);
  }
  @media (max-width: 700px) {
    .sidebar {
      display: flex;
      overflow-x: auto;
      padding: 7px;
      gap: 4px;
      position: sticky;
      top: 65px;
      z-index: 20;
      border-bottom: 1px solid var(--line);
    }
    .side-label {
      display: none;
    }
    .side-btn {
      white-space: nowrap;
      width: auto;
      padding: 11px;
      font-size: 12px;
    }
  }
  .sidebar {
    background: linear-gradient(165deg, #171718, #101011 65%, #281e12);
    padding-top: 27px;
  }
  .side-btn {
    margin: 6px 0;
    padding: 14px 17px;
    font-weight: 600;
  }
  .side-btn.active {
    color: #fff;
    background: linear-gradient(125deg, #906a31, #33271a);
    border: 1px solid #c0934b;
    box-shadow: 0 4px 16px #e7b05e20;
  }
  @media (max-width: 760px) {
    .sidebar {
      display: block;
      overflow: visible;
      padding: 8px;
    }
    .side-menu {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .sidebar .side-label {
      display: none;
    }
    .side-btn {
      min-width: max-content;
      width: auto;
    }
  }
  .side-btn {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .side-ic {
    display: inline-flex;
    width: 20px;
    justify-content: center;
    opacity: 0.85;
  }
  .side-btn.active .side-ic {
    opacity: 1;
    color: var(--gold2);
  }
  body.theme-light .sidebar {
    background: #fffdf8;
    border-color: #e2dccf;
  }
  body.theme-light .side-btn {
    color: #5c574d;
  }
  body.theme-light .side-btn:hover {
    background: #f1ebdf;
    color: #1d1b17;
  }
  body.theme-light .side-btn.active {
    background: #f3e6cc;
    color: #6e4c17;
    border-color: #d8b77a;
    box-shadow: none;
  }
  .sidebar {
    transition:
      background-color 0.25s,
      color 0.25s,
      border-color 0.25s;
  }
  .sidebar {
    display: flex;
    flex-direction: column;
  }
  .side-menu {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }
  .side-foot {
    flex: none;
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid var(--line);
  }
  .side-exit {
    color: #e9a0a0;
  }
  .side-exit:hover {
    background: #2d2022;
    color: #ffb3b3;
  }
  .side-label {
    font-size: 12px;
  }
  .side-btn {
    font-size: 14.5px;
  }
  @media (max-width: 900px) {
    .side-foot {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .side-foot .side-btn {
      width: auto;
    }
  }
  @media (min-width: 761px) {
    .sidebar {
      position: sticky;
      top: 72px;
      height: calc(100vh - 72px);
      overflow: hidden;
    }
  }
  .side-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  }
  .side-toggle {
    flex: none;
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border: 1px solid var(--line);
    border-radius: 4px;
    background: transparent;
    color: var(--gold);
    cursor: pointer;
    margin: 0 6px 10px 0;
  }
  .side-toggle svg {
    width: 17px;
    height: 17px;
  }
  .side-toggle:hover {
    border-color: var(--gold);
  }
  @media (min-width: 761px) {
    .admin.side-collapsed {
      grid-template-columns: 76px minmax(0, 1fr);
    }
    .side-collapsed .side-label,
    .side-collapsed .side-txt {
      display: none;
    }
    .side-collapsed .side-top {
      justify-content: center;
    }
    .side-collapsed .side-toggle {
      margin: 0 0 10px;
    }
    .side-collapsed .side-btn {
      justify-content: center;
      padding-left: 0;
      padding-right: 0;
    }
  }
  @media (max-width: 760px) {
    .side-toggle {
      display: none;
    }
  }
  .side-btn,
  .side-toggle {
    transition:
      transform var(--motion-normal) var(--motion-smooth),
      background-color var(--motion-normal) ease,
      border-color var(--motion-normal) ease,
      box-shadow var(--motion-normal) ease,
      color var(--motion-fast) ease,
      opacity var(--motion-fast) ease;
  }
  .side-toggle {
    border-radius: 12px;
  }
  .side-btn:active {
    transform: translateY(0) scale(0.98);
  }
  .side-btn:focus-visible {
    outline: 2px solid var(--gold2);
    outline-offset: 3px;
  }
  .sidebar {
    transition:
      width 420ms var(--motion-smooth),
      background-color 300ms ease;
  }
  .side-btn {
    border-radius: 12px;
    min-height: 43px;
  }
  .side-btn:hover {
    transform: translateX(3px);
  }
  .side-collapsed .side-btn:hover {
    transform: translateY(-2px);
  }
  .side-txt {
    white-space: nowrap;
  }
  @media (max-width: 760px) {
    .admin .sidebar .side-btn:hover {
      transform: none;
    }
  }
  @media (min-width: 761px) {
    .sidebar {
      min-width: 0;
      max-width: 100%;
      overflow: hidden;
    }
    .sidebar .side-menu {
      overflow-x: hidden;
      overflow-y: auto;
      scrollbar-width: none;
      overscroll-behavior: contain;
      min-width: 0;
      padding-inline: 3px;
    }
    .sidebar .side-menu::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
    }
    .sidebar .side-btn {
      width: 100%;
      min-width: 0;
      max-width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      transform-origin: left center;
    }
    .sidebar .side-btn:hover {
      transform: translateY(-1px);
    }
    .side-txt {
      min-width: 0;
      max-width: 170px;
      opacity: 1;
      transition:
        max-width 0.38s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.22s ease,
        margin 0.35s ease;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .side-collapsed .side-txt {
      display: inline-block;
      max-width: 0;
      opacity: 0;
      margin: 0;
    }
    .side-collapsed .side-btn {
      gap: 0;
    }
    .side-collapsed .side-menu {
      padding-inline: 0;
    }
    .sidebar .side-label {
      overflow: hidden;
      white-space: normal;
      transition: opacity 0.22s ease;
    }
    .side-collapsed .side-label {
      display: block;
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }
  }
  .bf-mobile-backdrop {
    display: none;
  }
  @media (max-width: 760px) {
    .admin .sidebar {
      display: flex !important;
      flex-direction: column;
      gap: 8px;
      position: fixed;
      top: 65px;
      bottom: 0;
      left: 0;
      width: min(330px, 86vw);
      max-width: 86vw;
      height: calc(100dvh - 65px);
      padding: 19px 15px max(18px, env(safe-area-inset-bottom));
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      scrollbar-width: thin;
      border-right: 1px solid var(--line);
      border-bottom: 0;
      z-index: 85;
      transform: translate3d(-105%, 0, 0);
      visibility: hidden;
      pointer-events: none;
      transition:
        transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
        visibility 0s linear 0.42s;
      box-shadow: 20px 0 55px #0005;
    }
    .admin.bf-mobile-open .sidebar {
      transform: translate3d(0, 0, 0);
      visibility: visible;
      pointer-events: auto;
      transition:
        transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
        visibility 0s;
    }
    .sidebar .side-top {
      display: flex !important;
      justify-content: space-between;
      align-items: center;
    }
    .sidebar .side-label {
      display: block !important;
      padding: 7px 10px 12px;
    }
    .sidebar .side-toggle {
      display: none !important;
    }
    .sidebar .side-menu {
      display: flex !important;
      flex-direction: column;
      gap: 3px;
      overflow: visible !important;
      min-height: auto;
      padding: 0;
      margin: 0;
      flex: 0 0 auto;
    }
    .sidebar .side-menu .side-btn,
    .sidebar .side-foot .side-btn {
      display: flex !important;
      align-items: center;
      gap: 12px;
      white-space: normal;
      width: 100% !important;
      min-width: 0 !important;
      max-width: 100%;
      margin: 2px 0;
      padding: 13px 14px;
      font-size: 14px;
      flex-shrink: 0;
      text-align: left;
      transform: none;
    }
    .sidebar .side-txt {
      display: inline !important;
      white-space: normal !important;
      overflow: visible !important;
      opacity: 1 !important;
      max-width: none !important;
    }
    .sidebar .side-foot {
      display: flex !important;
      flex-direction: column;
      flex: 0 0 auto;
      gap: 3px;
      margin-top: auto;
      padding-top: 14px;
      border-top: 1px solid var(--line);
      width: 100%;
    }
    .sidebar .side-btn:hover {
      transform: translateX(3px);
    }
    .bf-mobile-backdrop {
      display: block;
      position: fixed;
      inset: 65px 0 0;
      background: rgba(0, 0, 0, 0.52);
      border: 0;
      border-radius: 0;
      z-index: 80;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition:
        opacity 0.35s ease,
        visibility 0s linear 0.35s;
      backdrop-filter: blur(0px);
    }
    .admin.bf-mobile-open .bf-mobile-backdrop {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transition:
        opacity 0.35s ease,
        visibility 0s;
      backdrop-filter: blur(2px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .admin .sidebar,
    .bf-mobile-backdrop {
      transition: none !important;
    }
  }
  @media (min-width: 761px) {
    .admin.side-collapsed .sidebar .side-top {
      display: flex;
      width: 100%;
      min-width: 0;
      justify-content: center;
      align-items: center;
      gap: 0;
    }
    .admin.side-collapsed .sidebar .side-top .side-label {
      display: none !important;
      padding: 0 !important;
      margin: 0 !important;
      width: 0 !important;
      min-width: 0 !important;
    }
    .admin.side-collapsed .sidebar .side-toggle {
      flex: 0 0 32px;
      width: 32px;
      height: 32px;
      margin: 0 auto 10px !important;
    }
  }
  @media (max-width: 760px) {
    .admin.bf-mobile-open .sidebar {
      position: fixed !important;
      top: 65px !important;
      bottom: 0 !important;
      height: auto !important;
      max-height: calc(100dvh - 65px);
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
    }
    .admin.bf-mobile-open .sidebar .side-top {
      flex: 0 0 auto !important;
    }
    .admin.bf-mobile-open .sidebar .side-menu {
      flex: 1 1 auto !important;
      min-height: 0 !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
    }
    .admin.bf-mobile-open .sidebar .side-foot {
      flex: 0 0 auto !important;
    }
    .admin.bf-mobile-open .bf-mobile-backdrop {
      position: fixed !important;
      top: 65px !important;
      bottom: 0 !important;
    }
  }
`;
