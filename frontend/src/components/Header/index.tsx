import { Icon } from "@/components/Icon";
import { LOGO_SRC } from "@/constants/barber";
import { useBarberData } from "@/hooks/useBarberData";
import { useNavigation } from "@/hooks/useNavigation";
import { cx } from "@/utils/classNames";

/** Barra superior com a marca e os atalhos para o site, a gestão e o agendamento. */
export function Header() {
  const { view, go, newBooking, mobileMenuOpen, toggleMobileMenu } = useNavigation();
  const { token } = useBarberData();
  return (
    <header className={cx("topbar", !(view === "admin" && token) && "topbar-public")}>
      <div className="brand" onClick={() => go("public")} style={{ cursor: "pointer" }}>
        <img className="brand-logo" src={LOGO_SRC} alt="Barbearia Rafael Úzeda" />
        <span className="brand-name">
          RAFAEL <span style={{ color: "var(--gold)" }}>ÚZEDA</span>
          <small>Barbearia</small>
        </span>
      </div>
      <div className="top-actions">
        <button
          className="bf-mobile-menu-button"
          type="button"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Fechar menu da gestão" : "Abrir menu da gestão"}
          aria-expanded={mobileMenuOpen}
          aria-controls="barber-sidebar"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <button className="btn ghost only-desktop" onClick={() => go("public")}>
          Site do cliente
        </button>
        <button
          className={cx("btn", view === "admin" ? "primary" : "ghost")}
          onClick={() => go("admin")}
        >
          <Icon name="settings" /> <span>Gestão</span>
        </button>
        <button
          className={cx("btn", view === "booking" ? "primary" : "ghost")}
          onClick={newBooking}
        >
          <Icon name="calendarPlus" /> <span>Agendar</span>
        </button>
      </div>
    </header>
  );
}
