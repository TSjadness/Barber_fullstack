import { createFileRoute } from "@tanstack/react-router";
import { BarberApp } from "@/components/BarberApp";

export const Route = createFileRoute("/login")({
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
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap",
      },
      { rel: "stylesheet", href: "/barber/app.css" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return <BarberApp startView="admin" />;
}
