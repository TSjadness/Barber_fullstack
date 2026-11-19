/**
 * Estilos da página 404 (.bf-notfound, .bf-notfound-card, .bf-notfound-code, ...).
 *
 * A 404 é desenhada pelo layout raiz, fora do App: o GlobalStyle (styled-components,
 * injetado só no cliente) não está montado. Por isso estes estilos são uma string
 * renderizada num <style> junto com a base (tokens, reset e fontes), e chegam no HTML
 * do servidor sem "piscar". Os valores seguem os padrões do card, do botão principal e
 * do tema claro da gestão.
 */
export const notFoundCss = `
.bf-notfound {
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  background:
    radial-gradient(circle at 50% 0%, #d9aa481a, transparent 55%),
    var(--bg);
  color: var(--text);
  font-family: "DM Sans", sans-serif;
}
.bf-notfound-card {
  width: min(100%, 480px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 32px 36px;
  border: 1px solid #454547;
  border-radius: 18px;
  background: linear-gradient(160deg, #232326, #18191b);
  box-shadow: 0 20px 60px #0006;
  animation: bf-dialog-enter 340ms var(--bf-motion-ease) both;
}
.bf-notfound-logo {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #3d3527;
  background: #000;
  margin-bottom: 22px;
}
.bf-notfound-eyebrow {
  color: #d6a956;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin: 0 0 6px;
}
.bf-notfound-code {
  font: 800 clamp(84px, 22vw, 124px) / 1 Outfit, sans-serif;
  letter-spacing: -0.04em;
  margin: 0;
  background: linear-gradient(180deg, #ffdf8e, #dba33e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: bfFloat 4.5s ease-in-out 400ms infinite;
}
.bf-notfound-rule {
  width: 56px;
  height: 2px;
  border: 0;
  border-radius: 2px;
  background: var(--gold);
  margin: 18px auto 20px;
  opacity: 0.8;
}
.bf-notfound h1 {
  font: 700 24px / 1.25 Outfit, sans-serif;
  margin: 0 0 10px;
}
.bf-notfound-text {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.7;
  max-width: 340px;
  margin: 0 0 28px;
}
.bf-notfound-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 11px 22px;
  border: 1px solid var(--gold);
  border-radius: 3px;
  background: var(--gold);
  color: #121110;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 240ms ease,
    color 240ms ease,
    border-color 240ms ease;
}
.bf-notfound-btn:hover {
  background: transparent;
  color: var(--gold2);
}
.bf-notfound-btn:focus-visible {
  outline: 2px solid var(--gold2);
  outline-offset: 3px;
}
.bf-notfound-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  stroke-width: 1.75;
}
body.theme-light .bf-notfound {
  background:
    radial-gradient(circle at 50% 0%, #b8862f14, transparent 55%),
    #f4f1ea;
}
body.theme-light .bf-notfound-card {
  background: #fff;
  border-color: #e2dccf;
  color: #1d1b17;
  box-shadow: 0 4px 18px #5a46200d;
}
body.theme-light .bf-notfound-logo {
  border-color: #e2dccf;
}
body.theme-light .bf-notfound-eyebrow {
  color: #a8782c;
}
body.theme-light .bf-notfound-code {
  background: linear-gradient(180deg, #d9a54b, #a8782c);
  -webkit-background-clip: text;
  background-clip: text;
}
body.theme-light .bf-notfound-btn {
  background: #b8862f;
  border-color: #b8862f;
  color: #fff;
}
body.theme-light .bf-notfound-btn:hover {
  background: transparent;
  color: #8a6020;
}
@media (max-width: 760px) {
  .bf-notfound-card {
    padding: 32px 20px 28px;
  }
  .bf-notfound h1 {
    font-size: 20px;
  }
  .bf-notfound-text {
    font-size: 13px;
  }
  .bf-notfound-btn {
    width: 100%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bf-notfound-card,
  .bf-notfound-code {
    animation: none !important;
  }
  .bf-notfound-btn {
    transition: none !important;
  }
}
`;
