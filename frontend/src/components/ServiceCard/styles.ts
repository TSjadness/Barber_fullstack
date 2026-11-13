import { css } from "styled-components";

/**
 * Estilos de ServiceCard (.service-card, .service-icon, .service-meta, .btn, .svc-top, .svc-index, .svc-duration, .svc-foot, .svc-price, .svc-cta, .ic).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const serviceCardStyles = css`
  .service-card {
    border: 1px solid var(--line);
    background: var(--panel);
    border-radius: var(--radius);
    padding: 20px;
  }
  .service-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 205px;
  }
  .service-icon {
    font-size: 29px;
  }
  .service-card h3 {
    margin: 0;
    font-size: 20px;
  }
  .service-meta {
    display: flex;
    justify-content: space-between;
    color: var(--muted);
    font-size: 13px;
  }
  .service-card .btn {
    margin-top: auto;
  }
  .service-card {
    background: linear-gradient(155deg, #242321, #171718 72%);
    border-color: #3b352c;
    padding: 26px;
    min-height: 240px;
    transition:
      transform 0.2s,
      border 0.2s,
      box-shadow 0.2s;
  }
  .service-card:hover {
    transform: translateY(-5px);
    border-color: #bd945a;
    box-shadow: 0 12px 50px #0005;
  }
  .service-icon {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 15px;
    background: #d2a95b20;
    font-size: 29px;
  }
  .service-card h3 {
    font-size: 22px;
  }
  .service-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
  }
  .service-meta span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  .service-card {
    transition:
      border-color 0.2s,
      transform 0.2s;
  }
  .service-card:hover {
    border-color: color-mix(in oklab, var(--gold) 45%, transparent);
  }
  .service-card {
    cursor: pointer;
    min-height: 0;
    gap: 0;
    padding: 24px;
    background: linear-gradient(180deg, #1a1b1e, #141517);
    transition:
      border-color 0.2s,
      transform 0.2s,
      box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }
  .service-card::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .service-card:hover {
    border-color: #5a4a2f;
    transform: translateY(-3px);
    box-shadow: 0 18px 40px -20px rgba(0, 0, 0, 0.8);
  }
  .service-card:hover::before {
    opacity: 1;
  }
  .svc-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 22px;
  }
  .service-card .service-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    border: 1px solid #4a3d27;
    background: #211d16;
    color: var(--gold2);
  }
  .svc-index {
    font:
      600 12px Outfit,
      sans-serif;
    letter-spacing: 2px;
    color: #5d5e62;
  }
  .service-card h3 {
    font-size: 19px;
    letter-spacing: -0.3px;
    margin: 0 0 8px;
  }
  .svc-duration {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--muted);
    font-size: 12.5px;
  }
  .svc-foot {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    margin-top: 26px;
    padding-top: 18px;
    border-top: 1px solid #2a2b2f;
  }
  .svc-price small {
    display: block;
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #6f7075;
    font-weight: 700;
    margin-bottom: 3px;
  }
  .svc-price strong {
    font:
      700 22px Outfit,
      sans-serif;
    color: var(--text);
    letter-spacing: -0.5px;
  }
  .svc-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 14px;
    border-radius: 999px;
    border: 1px solid #5a4a2f;
    background: transparent;
    color: var(--gold2);
    font-weight: 700;
    font-size: 12.5px;
    letter-spacing: 0.2px;
    transition:
      background 0.2s,
      color 0.2s,
      border-color 0.2s;
  }
  .service-card:hover .svc-cta,
  .svc-cta:hover {
    background: var(--gold);
    border-color: var(--gold);
    color: #17140f;
  }
  .svc-cta .ic {
    transition: transform 0.2s;
  }
  .service-card:hover .svc-cta .ic {
    transform: translate(2px, -2px);
  }
  .svc-cta {
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 11.5px;
    font-weight: 700;
    box-shadow: none;
  }
  .svc-cta {
    padding: 10px 14px;
    border: 1px solid #4a3f2c;
    font-size: 10.5px;
  }
  .svc-cta .ic {
    transition: none;
  }
  .service-card:hover .svc-cta .ic {
    transform: none;
  }
  .service-card {
    border-radius: 6px;
  }
  .service-card .service-icon {
    border-radius: 4px;
    background: transparent;
  }
  .service-card h3 {
    font-size: 23px;
  }
  .svc-duration {
    font-size: 14.5px;
  }
  .service-card {
    transition:
      transform var(--motion-normal) var(--motion-smooth),
      background-color var(--motion-normal) ease,
      border-color var(--motion-normal) ease,
      box-shadow var(--motion-normal) ease,
      color var(--motion-fast) ease,
      opacity var(--motion-fast) ease;
  }
  .svc-cta {
    border-radius: 12px;
  }
  .service-card {
    transition:
      transform 330ms var(--motion-smooth),
      border-color 330ms ease,
      box-shadow 330ms ease;
  }
  .service-card:hover {
    transform: translateY(-4px);
  }
  .service-card h3 {
    font-size: 20px;
  }
  .svc-duration {
    font-size: 13.5px;
  }
  .svc-price strong {
    font-size: 23px;
  }
`;
