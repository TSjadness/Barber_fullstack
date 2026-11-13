import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { AdminStateProvider } from "@/contexts/admin/Provider";
import { BarberDataProvider } from "@/contexts/data/Provider";
import { NavigationProvider } from "@/contexts/navigation/Provider";
import { OverlayProvider } from "@/contexts/overlay/Provider";
import { PreferencesProvider } from "@/contexts/preferences/Provider";
import { useBarberData } from "@/hooks/useBarberData";
import { useDocumentSync } from "@/hooks/useDocumentSync";
import { useNavigation } from "@/hooks/useNavigation";
import { useOverlay } from "@/hooks/useOverlay";
import { usePreferences } from "@/hooks/usePreferences";
import { AdminPage } from "@/pages/Admin";
import { BookingPage } from "@/pages/Booking";
import { LoginPage } from "@/pages/Login";
import { PublicPage } from "@/pages/Public";
import { GlobalStyle } from "@/styles";
import type { StartView } from "@/types/app";

interface AppProps {
  /** Tela pedida pela rota: `/` abre o site e `/login` abre a gestão. */
  startView?: StartView;
}

/** Link de recuperação de senha do Supabase (`#...type=recovery`) abre a redefinição. */
const resolveStartView = (requested: StartView): StartView =>
  typeof window !== "undefined" && window.location.hash.includes("type=recovery")
    ? "reset-link"
    : requested;

/** Aplicação da barbearia: site do cliente, agendamento e painel de gestão. */
export function App({ startView = "public" }: AppProps) {
  const [initialView] = useState(() => resolveStartView(startView));
  return (
    <NavigationProvider startView={initialView}>
      <PreferencesProvider>
        <OverlayProvider>
          <BarberDataProvider>
            <AdminStateProvider>
              <GlobalStyle />
              <AppShell />
            </AdminStateProvider>
          </BarberDataProvider>
        </OverlayProvider>
      </PreferencesProvider>
    </NavigationProvider>
  );
}

/** Escolhe a tela atual e mantém título, endereço e tema do documento sincronizados. */
function AppShell() {
  const { db, token, status, loadError } = useBarberData();
  const { view, bookingEntry } = useNavigation();
  const { theme } = usePreferences();
  const overlay = useOverlay();
  const ready = status === "ready" && !!db;

  useDocumentSync({ ready, view, loggedIn: !!token, theme, shopName: db?.shop.name });

  // Esc fecha a foto ampliada.
  const { isPhotoOpen, closeModal } = overlay;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPhotoOpen) closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isPhotoOpen, closeModal]);

  return (
    <>
      <div id="app">
        {status === "error" ? (
          <main className="wrap section">
            <Card>
              <h2>Não foi possível conectar à API</h2>
              <p className="muted">
                {loadError.replace(/[.\s]+$/, "")}. Tente novamente em instantes.
              </p>
              <button className="btn primary" onClick={() => location.reload()}>
                Tentar novamente
              </button>
            </Card>
          </main>
        ) : ready ? (
          <>
            <Header />
            {view === "public" ? (
              <PublicPage />
            ) : view === "booking" ? (
              <BookingPage key={bookingEntry.id} />
            ) : token ? (
              <AdminPage />
            ) : (
              <LoginPage />
            )}
          </>
        ) : null}
      </div>
      <div id="overlay">{overlay.content}</div>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
