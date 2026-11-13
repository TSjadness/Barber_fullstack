/**
 * Animações (keyframes) compartilhadas pela interface.
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const animationsCss = `
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes bfFadeUp {
  from {
    opacity: 0.8;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes bfFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
@keyframes bfPageEnter {
  from {
    opacity: 0.85;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes bf-overlay-enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes bf-dialog-enter {
  from {
    opacity: 0;
    transform: translate3d(0, 10px, 0) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}
`;
