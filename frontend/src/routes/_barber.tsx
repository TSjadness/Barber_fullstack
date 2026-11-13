import { createFileRoute, useLocation } from "@tanstack/react-router";
import { barberHeadLinks, barberHeadStyles } from "./-shared/head";
import { App } from "@/App";

/**
 * Layout das rotas da barbearia (`/` e `/login`). O App fica montado aqui, uma única
 * vez: ao trocar entre site e gestão o endereço muda (history.replaceState) sem
 * desmontar a aplicação nem perder o estado carregado.
 */
export const Route = createFileRoute("/_barber")({
  head: () => ({ links: barberHeadLinks, styles: barberHeadStyles }),
  component: BarberLayout,
});

function BarberLayout() {
  const pathname = useLocation({ select: (location) => location.pathname });
  return <App startView={pathname.replace(/\/$/, "") === "/login" ? "admin" : "public"} />;
}
