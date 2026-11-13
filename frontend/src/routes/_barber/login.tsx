import { createFileRoute } from "@tanstack/react-router";

/** Acesso à gestão. A tela é desenhada pelo layout `_barber` (App). */
export const Route = createFileRoute("/_barber/login")({
  head: () => ({
    meta: [
      { title: "Entrar na gestão — Barbearia Rafael Úzeda" },
      {
        name: "description",
        content: "Acesso restrito ao painel de gestão da Barbearia Rafael Úzeda.",
      },
      { property: "og:title", content: "Entrar na gestão — Barbearia Rafael Úzeda" },
      {
        property: "og:description",
        content: "Acesso restrito ao painel de gestão da Barbearia Rafael Úzeda.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
