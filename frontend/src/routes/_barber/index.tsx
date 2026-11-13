import { createFileRoute } from "@tanstack/react-router";

/** Site do cliente. A tela é desenhada pelo layout `_barber` (App). */
export const Route = createFileRoute("/_barber/")({
  head: () => ({
    meta: [
      { title: "Barbearia Rafael Úzeda — Agende seu horário em Itabaiana" },
      {
        name: "description",
        content: "Barbearia Rafael Úzeda em Itabaiana/SE: corte, barba e degradê. Agende online.",
      },
      { property: "og:title", content: "Barbearia Rafael Úzeda — Agende seu horário em Itabaiana" },
      {
        property: "og:description",
        content: "Agende seu corte online: escolha o serviço, o barbeiro e o horário.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
