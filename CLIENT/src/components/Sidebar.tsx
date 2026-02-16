import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import type { RouteConfig } from "../constants/routeConfig";

interface SidebarProps {
  routes: RouteConfig[];
  onNavigate: (path: string, permission: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ routes, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setExpandedMenus([]);
    }
  };

  const toggleMenu = (path: string) => {
    if (isCollapsed) return;
    setExpandedMenus((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItem = (route: RouteConfig, level: number = 0) => {
    const hasChildren = route.children && route.children.length > 0;
    const isExpanded = expandedMenus.includes(route.path);
    const active = isActive(route.path);

    return (
      <div key={route.path}>
        <div
          onClick={() => {
            if (hasChildren) {
              toggleMenu(route.path);
            } else {
              onNavigate(route.path, route.permission);
            }
          }}
          className={`
            flex items-center cursor-pointer transition-all duration-200
            ${isCollapsed ? 'justify-center px-2 py-3' : 'justify-start px-4 py-3'}
            ${active ? 'bg-[var(--primary-alpha)] border-l-[3px] border-l-[var(--accent)]' : 'border-l-[3px] border-l-transparent hover:bg-[var(--bg-muted)]'}
            ${!isCollapsed && level > 0 ? 'ml-4' : ''}
          `}
        >
          <span className="flex items-center text-[var(--text-primary)]">
            {route.icon || "•"}
          </span>
          {!isCollapsed && (
            <>
              <span className={`flex-1 ml-3 text-sm text-[var(--text-primary)] ${active ? 'font-semibold' : ''}`}>
                {route.label}
              </span>
              {hasChildren && (
                <span className="text-xs text-[var(--text-secondary)]">
                  {isExpanded ? "▼" : "▶"}
                </span>
              )}
            </>
          )}
        </div>
        {hasChildren && isExpanded && !isCollapsed && (
          <div>
            {route.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        ${isCollapsed ? 'w-[60px]' : 'w-60'}
        h-screen bg-[var(--surface-color)] border-r border-[var(--border-color)]
        transition-all duration-300 ease-in-out
        flex flex-col fixed left-0 top-0 z-[1000]
      `}
    >
      {/* Header */}
      <div
        className={`
          p-4 border-b border-[var(--border-color)]
          flex items-center
          ${isCollapsed ? 'justify-center' : 'justify-between'}
        `}
      >
        {!isCollapsed && (
          <h2 className="text-lg font-semibold m-0 text-[var(--text-primary)]">
            Menu
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="bg-transparent border-none cursor-pointer text-xl p-1 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
        >
          {isCollapsed ? "☰" : "✕"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {routes.map((route) => renderMenuItem(route))}
      </nav>
    </div>
  );
};

export default Sidebar;
