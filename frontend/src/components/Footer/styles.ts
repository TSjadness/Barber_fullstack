import { css } from "styled-components";

/**
 * Estilos de Footer (.footer, .site-footer, .foot-grid, .foot-brand, .foot-line, .foot-bottom, .foot-social, .foot-social-link).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const footerStyles = css`
  .footer {
    border-top: 1px solid var(--line);
    padding: 30px 20px;
    text-align: center;
    color: var(--muted);
  }
  .site-footer {
    border-top: 1px solid var(--line);
    background: #0b0b0c;
    padding: 56px 0 0;
  }
  .foot-grid {
    display: grid;
    grid-template-columns: 1.2fr 1.4fr 1fr 1fr;
    gap: 36px;
  }
  .foot-brand img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    background: #000;
  }
  .foot-brand p {
    color: var(--muted);
    margin-top: 14px;
    max-width: 240px;
    line-height: 1.6;
  }
  .site-footer h4 {
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold2);
    margin-bottom: 18px;
  }
  .foot-line {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    color: #c9c6c0;
    margin: 0 0 12px;
    line-height: 1.5;
  }
  a.foot-line:hover {
    color: var(--gold2);
  }
  .foot-bottom {
    border-top: 1px solid #222;
    margin-top: 40px;
    padding: 20px;
    text-align: center;
    color: #6f7075;
    font-size: 12px;
  }
  @media (max-width: 950px) {
    .foot-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (max-width: 600px) {
    .foot-grid {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 760px) {
    .site-footer,
    .site-footer .foot-grid,
    .site-footer .foot-grid > div,
    .site-footer .foot-brand {
      text-align: center;
      justify-items: center;
      align-items: center;
    }
    .site-footer .foot-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }
    .site-footer .foot-line {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 9px;
    }
    .site-footer .foot-brand p {
      max-width: 330px;
      margin-left: auto;
      margin-right: auto;
    }
    .site-footer .foot-bottom {
      text-align: center;
      padding-left: 12px;
      padding-right: 12px;
    }
  }
  .foot-social {
    display: flex;
    gap: 10px;
    margin-top: 16px;
  }
  .foot-social-link {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border: 1px solid #2c2c2c;
    border-radius: 50%;
    color: var(--gold);
    transition:
      background 0.2s,
      color 0.2s,
      border-color 0.2s;
  }
  .foot-social-link:hover {
    background: var(--gold);
    border-color: var(--gold);
    color: #111;
  }
`;
