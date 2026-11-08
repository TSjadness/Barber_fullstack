import { createFileRoute } from "@tanstack/react-router";
import { BarberApp } from "@/components/BarberApp";

export const Route = createFileRoute("/")({
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
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap",
      },
      { rel: "stylesheet", href: "/barber/app.css" },
    ],
  }),
  component: Index,
});

function Index() {
  return <BarberApp />;
}
