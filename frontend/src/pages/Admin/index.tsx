import { useRef } from "react";
import { AgendaSection } from "./Agenda";
import { BookingsSection } from "./Bookings";
import { CalendarSection } from "./Calendar";
import { ClientsSection } from "./Clients";
import { FinanceSection } from "./Finance";
import { HoursSection } from "./Hours";
import { NoticesSection } from "./Notices";
import { OverviewSection } from "./Overview";
import { ServicesSection } from "./Services";
import { SettingsSection } from "./Settings";
import { StaffSection } from "./Staff";
import { Sidebar } from "@/components/Sidebar";
import { useBarberData } from "@/hooks/useBarberData";
import { useNavigation } from "@/hooks/useNavigation";
import { usePreferences } from "@/hooks/usePreferences";
import type { AdminSection } from "@/types/app";
import { cx } from "@/utils/classNames";

const SECTIONS: Record<AdminSection, () => React.JSX.Element> = {
  overview: OverviewSection,
  agenda: AgendaSection,
  calendar: CalendarSection,
  bookings: BookingsSection,
  clients: ClientsSection,
  finance: FinanceSection,
  services: ServicesSection,
  staff: StaffSection,
  hours: HoursSection,
  notices: NoticesSection,
  settings: SettingsSection,
};

/** Painel de gestão: menu lateral e a seção escolhida. */
export function AdminPage() {
  const { section, setSection, go, mobileMenuOpen, closeMobileMenu } = useNavigation();
  const { theme, toggleTheme, sideCollapsed, toggleSide } = usePreferences();
  const { logout } = useBarberData();

  // A primeira seção entra com a animação da tela; as trocas seguintes usam a animação de página.
  const firstSection = useRef(section);
  const sectionChanged = useRef(false);
  if (section !== firstSection.current) sectionChanged.current = true;

  const Content = SECTIONS[section];
  return (
    <div
      className={cx("admin", sideCollapsed && "side-collapsed", mobileMenuOpen && "bf-mobile-open")}
    >
      <button
        type="button"
        className="bf-mobile-backdrop"
        onClick={closeMobileMenu}
        aria-label="Fechar menu"
      ></button>
      <Sidebar
        section={section}
        collapsed={sideCollapsed}
        theme={theme}
        onSelect={setSection}
        onToggleCollapse={toggleSide}
        onToggleTheme={() => {
          closeMobileMenu();
          toggleTheme();
        }}
        onOpenSite={() => go("public")}
        onLogout={() => {
          closeMobileMenu();
          void logout();
        }}
      />
      <main
        key={section}
        className={cx("main", "bf-enter", sectionChanged.current && "bf-page-enter")}
      >
        <Content />
      </main>
    </div>
  );
}
