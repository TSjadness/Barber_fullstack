import { baseCss } from "@/styles";

/** Fontes e estilos-base comuns às rotas da barbearia (`/` e `/login`). */
export const barberHeadLinks = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
  },
];

/** Base visual renderizada no HTML do servidor (antes da hidratação). */
export const barberHeadStyles = [{ children: baseCss }];
