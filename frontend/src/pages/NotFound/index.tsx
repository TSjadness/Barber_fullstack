import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { notFoundCss } from "./styles";
import { LOGO_SRC } from "@/constants/barber";
import { baseCss } from "@/styles";
import { barberHeadLinks } from "@/routes/-shared/head";

/**
 * O tema claro vale só para a gestão logada (mesma regra do App e do THEME_BOOT): quem
 * escolheu o tema claro e tem sessão vê a 404 clara; os demais, o visual escuro do site.
 */
const SESSION_CHECK = `(l.getItem("barberflow_mock_token")||Object.keys(l).some(function(k){return/^sb-.*-auth-token$/.test(k)}))`;
const THEME_SCRIPT = `try{var l=localStorage;if(l.getItem("barberTheme")==="light"&&${SESSION_CHECK})document.body.classList.add("theme-light")}catch(e){}`;

function readSession(): { loggedIn: boolean; light: boolean } {
  try {
    const l = window.localStorage;
    const loggedIn =
      !!l.getItem("barberflow_mock_token") ||
      Object.keys(l).some((k) => /^sb-.*-auth-token$/.test(k));
    return { loggedIn, light: loggedIn && l.getItem("barberTheme") === "light" };
  } catch {
    return { loggedIn: false, light: false };
  }
}

/** Página não encontrada, com a identidade visual da barbearia. */
export function NotFoundPage() {
  // Dono logado volta para a gestão; cliente, para o site.
  const [home, setHome] = useState<"/" | "/login">("/");

  useEffect(() => {
    const { loggedIn, light } = readSession();
    setHome(loggedIn ? "/login" : "/");
    // O script inline cobre o carregamento direto; aqui cobre a navegação no cliente.
    document.body.classList.toggle("theme-light", light);
    // Ao sair da 404, o App volta a decidir o tema.
    return () => document.body.classList.remove("theme-light");
  }, []);

  return (
    <>
      {barberHeadLinks
        .filter((link) => link.rel === "stylesheet")
        .map((link) => (
          <link key={link.href} rel="stylesheet" href={link.href} precedence="default" />
        ))}
      <style>{`${baseCss}\n${notFoundCss}`}</style>
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      <main className="bf-notfound">
        <section className="bf-notfound-card" aria-labelledby="bf-notfound-title">
          <img className="bf-notfound-logo" src={LOGO_SRC} alt="Barbearia Rafael Úzeda" />
          <p className="bf-notfound-eyebrow">Erro</p>
          <p className="bf-notfound-code" aria-hidden="true">
            404
          </p>
          <hr className="bf-notfound-rule" />
          <h1 id="bf-notfound-title">Página não encontrada</h1>
          <p className="bf-notfound-text">
            O endereço que você acessou não existe ou foi alterado. Volte ao início para continuar
            navegando.
          </p>
          <Link className="bf-notfound-btn" to={home}>
            <ArrowLeft aria-hidden="true" />
            Voltar ao início
          </Link>
        </section>
      </main>
    </>
  );
}
