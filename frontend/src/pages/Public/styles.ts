import { css } from "styled-components";

/**
 * Estilos de página Public (.public-hero, .hero-inner, .hero-actions, .section, .section-title, .service-grid, .team-grid, .hero-ribbon, .ic, .eyebrow, .muted, .essence, ...).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const publicStyles = css`
  .public-hero {
    min-height: 490px;
    position: relative;
    display: flex;
    align-items: center;
    background:
      linear-gradient(
        90deg,
        rgba(7, 8, 9, 0.97) 0%,
        rgba(9, 9, 10, 0.89) 37%,
        rgba(10, 10, 11, 0.35) 100%
      ),
      url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1800&q=85")
        center/cover;
  }
  .hero-inner {
    max-width: 1280px;
    width: 100%;
    margin: auto;
    padding: 55px 40px;
  }
  .hero-inner h1 {
    font-size: clamp(42px, 6vw, 78px);
    letter-spacing: -3px;
    line-height: 0.99;
    margin: 20px 0;
    max-width: 580px;
  }
  .hero-inner p {
    max-width: 490px;
    color: #c5c3be;
    font-size: 16px;
    line-height: 1.8;
  }
  .hero-actions {
    display: flex;
    gap: 12px;
    margin-top: 28px;
    flex-wrap: wrap;
  }
  .section {
    padding-top: 62px;
    padding-bottom: 64px;
  }
  .section-title {
    display: flex;
    align-items: end;
    justify-content: space-between;
    margin-bottom: 25px;
    gap: 15px;
  }
  .section-title h2 {
    font-size: 31px;
    margin-bottom: 5px;
    letter-spacing: -0.8px;
  }
  .service-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
  .team-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  @media (max-width: 950px) {
    .service-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 700px) {
    .hero-inner {
      padding: 45px 22px;
    }
    .public-hero {
      min-height: 460px;
    }
    .service-grid,
    .team-grid {
      grid-template-columns: 1fr;
    }
    .section {
      padding-top: 45px;
      padding-bottom: 46px;
    }
    .hero-inner h1 {
      letter-spacing: -2px;
    }
  }
  .public-hero {
    min-height: 580px;
    background:
      linear-gradient(90deg, #08090afc 0%, #0b0b0be0 40%, #0b0b0b45 100%),
      url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1800&q=85")
        center/cover;
  }
  .hero-inner {
    padding-top: 90px;
    padding-bottom: 90px;
  }
  .hero-inner h1 {
    font-size: clamp(52px, 7vw, 94px);
    line-height: 1.02;
    letter-spacing: -3.8px;
    max-width: 790px;
  }
  .hero-inner p {
    font-size: 17px;
    line-height: 1.9;
  }
  .hero-ribbon {
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
    margin-top: 42px;
    color: #ddd4c6;
    font-size: 12px;
    font-weight: 700;
  }
  .hero-ribbon span {
    padding-left: 15px;
    border-left: 2px solid var(--gold);
  }
  .public-hero:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #caa46a, transparent);
  }
  .section-title h2 {
    font-size: clamp(30px, 4vw, 43px);
  }
  @media (max-width: 700px) {
    .public-hero {
      min-height: 580px;
      background-position: 60% center;
    }
    .hero-inner {
      padding: 65px 22px;
    }
    .hero-inner h1 {
      font-size: clamp(46px, 12vw, 66px);
      letter-spacing: -2.8px;
    }
    .hero-ribbon {
      gap: 10px;
    }
  }
  .hero-ribbon span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  .hero-ribbon .ic {
    color: var(--gold);
  }
  .service-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
  .public-hero .eyebrow {
    font-size: 13.5px;
  }
  .hero-inner p {
    font-size: 18.5px;
  }
  .hero-ribbon {
    font-size: 15px;
    gap: 26px;
    margin-top: 46px;
  }
  .hero-ribbon span {
    padding-left: 16px;
  }
  .hero-ribbon .ic {
    width: 20px;
    height: 20px;
  }
  .section .eyebrow {
    font-size: 13px;
  }
  .section-title .muted,
  .section > .muted {
    font-size: 17px;
    margin-top: 6px;
  }
  .section-title h2,
  .section h2 {
    font-size: clamp(32px, 4.4vw, 46px);
  }
  .essence p.muted {
    font-size: 17.5px;
    line-height: 1.7;
    max-width: 680px;
  }
  .essence-cta {
    margin-top: 22px;
  }
  @media (max-width: 700px) {
    .hero-ribbon {
      font-size: 14px;
      gap: 12px;
      flex-direction: column;
    }
    .hero-inner p {
      font-size: 16.5px;
    }
    .section-title {
      flex-direction: column;
      align-items: start;
    }
  }
  @media (min-width: 701px) {
    .hero-inner {
      padding-left: 25px;
      padding-right: 25px;
    }
  }
  .hero-actions .btn {
    border-radius: 14px;
  }
  .public-hero .eyebrow {
    display: inline-block;
    animation: bfFloat 5s ease-in-out infinite;
  }
  @media (max-width: 760px) {
    .hero-inner {
      text-align: center;
      padding-left: 17px;
      padding-right: 17px;
    }
    .hero-actions {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      width: min(100%, 360px);
      margin: 28px auto 0;
      gap: 10px;
    }
    .hero-actions .btn {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      min-height: 52px;
      min-width: 0;
      white-space: normal;
      text-align: center;
    }
  }
`;
