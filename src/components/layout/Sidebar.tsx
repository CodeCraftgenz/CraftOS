/// Barra lateral — navegação premium TracOS

import { NavLink } from "react-router-dom";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  group?: string;
}

// Ícones SVG inline para não depender de lib externa
const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  disk: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
    </svg>
  ),
  treemap: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="12" x2="21" y2="12" />
      <line x1="12" y1="3" x2="12" y2="12" /><line x1="8" y1="12" x2="8" y2="21" />
    </svg>
  ),
  files: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  ),
  monitor: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  cleanup: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  ),
  history: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  help: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

const navItems: NavItem[] = [
  { path: "/", label: "Dashboard", icon: icons.dashboard, group: "Principal" },
  { path: "/disk-analysis", label: "Análise de Disco", icon: icons.disk, group: "Disco" },
  { path: "/treemap", label: "Mapa Visual", icon: icons.treemap, group: "Disco" },
  { path: "/largest-files", label: "Maiores Arquivos", icon: icons.files, group: "Disco" },
  { path: "/resources", label: "Monitor", icon: icons.monitor, group: "Sistema" },
  { path: "/cleanup", label: "Limpeza", icon: icons.cleanup, group: "Sistema" },
  { path: "/history", label: "Histórico", icon: icons.history, group: "Sistema" },
  { path: "/settings", label: "Configurações", icon: icons.settings, group: "Geral" },
  { path: "/help", label: "Ajuda", icon: icons.help, group: "Geral" },
];

export function Sidebar() {
  // Agrupa itens
  const groups: Record<string, NavItem[]> = {};
  navItems.forEach((item) => {
    const g = item.group || "Outros";
    if (!groups[g]) groups[g] = [];
    groups[g].push(item);
  });

  return (
    <aside className="w-[220px] min-w-[220px] h-full bg-bg-sidebar flex flex-col border-r border-border">
      {/* Logo */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-primary/20">
            T
          </div>
          <div>
            <h1 className="text-[14px] font-bold text-text-primary tracking-tight">TracOS</h1>
            <p className="text-[10px] text-text-muted font-medium">Tracbel Agro</p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-1 overflow-y-auto space-y-5">
        {Object.entries(groups).map(([groupName, items]) => (
          <div key={groupName}>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.08em] px-3 mb-1.5">
              {groupName}
            </p>
            <div className="space-y-0.5">
              {items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-primary/15 text-primary-light"
                        : "text-text-secondary hover:bg-bg-card-hover hover:text-text-primary"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`flex-shrink-0 transition-colors ${isActive ? "text-primary-light" : "text-text-muted group-hover:text-text-secondary"}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-light" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Rodapé */}
      <div className="px-5 py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
          <p className="text-[10px] text-text-muted">TracOS v0.1.0</p>
        </div>
      </div>
    </aside>
  );
}
