import { Icon } from "@/components/Icon";
import { ADMIN_MENU } from "@/constants/barber";
import type { SidebarProps } from "./types";
import { cx } from "@/utils/classNames";

/** Menu lateral da gestão: seções, tema, atalho para o site e saída. */
export function Sidebar({
  section,
  collapsed,
  theme,
  onSelect,
  onToggleCollapse,
  onToggleTheme,
  onOpenSite,
  onLogout,
}: SidebarProps) {
  const collapseLabel = collapsed ? "Expandir menu" : "Recolher menu";
  const themeLabel = theme === "light" ? "Modo escuro" : "Modo claro";
  return (
    <aside className="sidebar" id="barber-sidebar" aria-label="Menu de gestão">
      <div className="side-top">
        <div className="side-label">PAINEL DE CONTROLE</div>
        <button
          className="side-toggle"
          onClick={onToggleCollapse}
          aria-label={collapseLabel}
          title={collapseLabel}
        >
          <Icon name={collapsed ? "chevRight" : "chevLeft"} />
        </button>
      </div>
      <div className="side-menu">
        {ADMIN_MENU.map(([key, icon, label]) => (
          <button
            key={key}
            className={cx("side-btn", section === key && "active")}
            aria-current={section === key ? "page" : undefined}
            onClick={() => onSelect(key)}
            title={label}
          >
            <span className="side-ic">
              <Icon name={icon} />
            </span>
            <span className="side-txt">{label}</span>
          </button>
        ))}
      </div>
      <div className="side-foot">
        <button className="side-btn" onClick={onToggleTheme} title={themeLabel}>
          <span className="side-ic">
            <Icon name={theme === "light" ? "moon" : "sun"} />
          </span>
          <span className="side-txt">{themeLabel}</span>
        </button>
        <button className="side-btn" onClick={onOpenSite} title="Site do cliente">
          <span className="side-ic">
            <Icon name="arrowRight" />
          </span>
          <span className="side-txt">Site do cliente</span>
        </button>
        <button className="side-btn side-exit" onClick={onLogout} title="Sair da gestão">
          <span className="side-ic">
            <Icon name="ban" />
          </span>
          <span className="side-txt">Sair da gestão</span>
        </button>
      </div>
    </aside>
  );
}
