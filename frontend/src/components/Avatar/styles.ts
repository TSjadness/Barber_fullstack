import { css } from "styled-components";

/**
 * Estilos de Avatar (.avatar, .avatar-img).
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const avatarStyles = css`
  .avatar {
    height: 48px;
    width: 48px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    background: #453825;
    color: var(--gold2);
    font-weight: 800;
    font-size: 18px;
  }
  .avatar-img {
    object-fit: cover;
    padding: 0;
    border: 1px solid #4a3d27;
  }
  .avatar,
  .avatar-img {
    width: 56px;
    height: 56px;
    flex: 0 0 56px;
    object-fit: cover;
    border-radius: 12px;
    overflow: hidden;
  }
`;
