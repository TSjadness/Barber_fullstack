import type { AdminSection, Theme } from "@/types/app";

export interface SidebarProps {
  section: AdminSection;
  collapsed: boolean;
  theme: Theme;
  onSelect: (section: AdminSection) => void;
  onToggleCollapse: () => void;
  onToggleTheme: () => void;
  onOpenSite: () => void;
  onLogout: () => void;
}
