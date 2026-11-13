/**
 * Base global: reset, tipografia, elementos HTML, utilitários de texto e carregamento inicial.
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const globalCss = `
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
}
h1,
h2,
h3,
h4,
p {
  margin-top: 0;
}
h1,
h2,
h3,
h4 {
  font-family: Outfit, sans-serif;
}
button,
input,
select,
textarea {
  font: inherit;
}
button {
  cursor: pointer;
}
button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
input,
select,
textarea {
  background: #111215;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--text);
  padding: 11px 12px;
  min-width: 0;
  outline: none;
}
input:focus,
select:focus,
textarea:focus {
  border-color: var(--gold);
}
label {
  display: grid;
  gap: 7px;
  color: #cac9c6;
  font-size: 12px;
  font-weight: 700;
}
a {
  color: inherit;
  text-decoration: none;
}
.hidden {
  display: none !important;
}
.muted {
  color: var(--muted);
}
.wrap {
  max-width: 1280px;
  margin: auto;
  padding: 0 25px;
}
.eyebrow {
  font-size: 11px;
  color: var(--gold2);
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
}
.price {
  color: var(--gold2);
  font-weight: 800;
}
body {
  background: #101011;
  background-image: radial-gradient(ellipse at 84% 8%, #2c251b33, transparent 45%);
}
body {
  background: radial-gradient(ellipse at 92% 0%, #25211c 0%, transparent 36%), #0c0d0f;
}
.eyebrow {
  letter-spacing: 0.22em;
}
h1,
h2,
h3 {
  letter-spacing: -0.015em;
}
body.theme-light .price,
body.theme-light .eyebrow {
  color: #8a6020;
}
body.theme-light .muted {
  color: #6f6a60;
}
body {
  font-size: 15px;
}
label {
  font-size: 13.5px;
}
select:focus-visible,
input:focus-visible {
  outline: 2px solid var(--gold2);
  outline-offset: 3px;
}
.bf-enter {
  animation: bfFadeUp 0.26s var(--motion-smooth) backwards;
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
.bf-page-enter {
  animation: bfPageEnter 0.26s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}
@media (prefers-reduced-motion: reduce) {
  .bf-page-enter {
    animation: none !important;
  }
}
html,
body,
button,
input,
select,
textarea,
h1,
h2,
h3,
h4 {
  font-family: "Manrope",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif !important;
}
@media (max-width: 760px) {
  html,
  body,
  #app {
    max-width: 100%;
    overflow-x: clip;
  }
}
#app {
  min-height: 100vh;
}
#app:empty {
  display: grid;
  place-items: center;
}
#app:empty::before {
  content: "";
  width: 38px;
  height: 38px;
  border: 3px solid rgba(150, 140, 120, 0.28);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
html {
  scrollbar-gutter: stable;
}
`;
