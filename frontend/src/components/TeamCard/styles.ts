import { css } from "styled-components";

/**
 * Estilos de TeamCard (.team-card, .team-photo, .team-photo-btn, .team-photo-zoom, .ic, .btn, .avatar-img).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const teamCardStyles = css`
  .team-card {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  .team-card p {
    margin: 3px 0;
    color: var(--muted);
  }
  .team-photo {
    width: 72px;
    height: 72px;
    border-radius: 6px;
    object-fit: cover;
    object-position: center top;
    border: 1px solid #3d3527;
    flex: none;
  }
  .team-card {
    padding: 22px;
    gap: 22px;
  }
  .team-card h3 {
    font-size: 24px;
  }
  .team-card p {
    font-size: 15.5px;
  }
  .team-photo-btn {
    position: relative;
    padding: 0;
    border: 0;
    background: none;
    flex: none;
    border-radius: 6px;
    cursor: zoom-in;
    overflow: hidden;
  }
  .team-photo {
    width: 130px;
    height: 150px;
    display: block;
    transition: transform 0.25s;
  }
  .team-photo-btn:hover .team-photo {
    transform: scale(1.05);
  }
  .team-photo-zoom {
    position: absolute;
    right: 6px;
    bottom: 6px;
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 3px;
    background: #0d0e10cc;
    color: var(--gold2);
  }
  .team-photo-zoom .ic {
    width: 15px;
    height: 15px;
  }
  @media (max-width: 700px) {
    .team-photo {
      width: 96px;
      height: 112px;
    }
    .team-card {
      flex-wrap: wrap;
      gap: 16px;
    }
    .team-card .btn {
      margin-left: 0 !important;
      width: 100%;
    }
  }
  .team-card {
    transition:
      transform var(--motion-normal) var(--motion-smooth),
      background-color var(--motion-normal) ease,
      border-color var(--motion-normal) ease,
      box-shadow var(--motion-normal) ease,
      color var(--motion-fast) ease,
      opacity var(--motion-fast) ease;
  }
  .team-card {
    transition:
      transform 330ms var(--motion-smooth),
      border-color 330ms ease,
      box-shadow 330ms ease;
  }
  .team-card:hover {
    transform: translateY(-4px);
  }
  .team-card .avatar-img {
    object-fit: cover;
    object-position: center;
  }
`;
