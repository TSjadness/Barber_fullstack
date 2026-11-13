/**
 * Tokens visuais (cores, raio, movimento) do tema escuro e do tema claro da gestão.
 *
 * Migrado de public/barber/app.css mantendo a ordem original das regras; os seletores
 * de classe continuam os mesmos para preservar a especificidade e o visual aprovado.
 */
export const themeCss = `
:root {
  --bg: #0d0e10;
  --panel: #17181b;
  --panel2: #202125;
  --line: #333438;
  --gold: #d6ac62;
  --gold2: #f0cc89;
  --text: #f6f4f0;
  --muted: #98999d;
  --green: #56b88a;
  --red: #e77d7d;
  --blue: #85aaff;
  --radius: 16px;
}
:root {
  --gold: #d9b373;
  --gold2: #f4d49a;
  --line: #343130;
}
:root {
  --bg: #0d0e10;
  --panel: #191a1d;
  --panel2: #242528;
  --line: #38383b;
  --gold: #d9aa48;
  --gold2: #ffda83;
  --text: #f9f8f6;
  --muted: #a8a7a6;
  --radius: 17px;
}
body.theme-light {
  --bg: #f4f1ea;
  --panel: #ffffff;
  --panel2: #f7f4ee;
  --line: #e2dccf;
  --text: #1d1b17;
  --muted: #6f6a60;
  --gold: #a8782c;
  --gold2: #8a6020;
  background: #f4f1ea;
  color: #1d1b17;
}
:root {
  --motion-smooth: cubic-bezier(0.22, 1, 0.36, 1);
  --motion-fast: 200ms;
  --motion-normal: 340ms;
}
:root {
  font-family: "Manrope",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}
:root {
  --bf-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --bf-motion-soft: 260ms;
}
`;
