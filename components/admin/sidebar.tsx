"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_SECTIONS = [
  {
    label: "PRINCIPAL",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        ),
      },
      {
        name: "Editar Secciones",
        href: "/admin/sections",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "CONTENIDO",
    items: [
      {
        name: "Publicaciones",
        href: "/admin/content",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        ),
      },
      {
        name: "Nueva Publicacion",
        href: "/admin/content/new",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        ),
      },
      {
        name: "Archivos",
        href: "/admin/files",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "SISTEMA",
    items: [
      {
        name: "Usuarios",
        href: "/admin/users",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
    ],
  },
];

interface AdminSidebarProps {
  user: { username: string; role: string } | null;
  onLogout: () => void;
  mobileOpen: boolean;
  desktopOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  user,
  onLogout,
  mobileOpen,
  desktopOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const isOpen = mobileOpen || desktopOpen;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className="fixed top-0 left-0 h-full w-[260px] z-50 flex flex-col transition-transform duration-300 ease-in-out admin-glass border-r border-[#00ffcc]/10 scanline-overlay"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Header with logo */}
        <div className="relative px-5 py-5 border-b border-[#00ffcc]/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/data/logo.png"
                alt="Logo"
                className="w-10 h-10 rounded-lg border border-[#00ffcc]/30 object-cover"
                style={{ boxShadow: "0 0 15px rgba(0,255,204,0.15)" }}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00ffcc] border-2 border-[#000c18]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-[#00ffcc] tracking-wider terminal-text leading-tight">
                {"HACK [PURGATORY]"}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] animate-pulse" />
                <p className="text-[10px] text-[#00ffcc]/60 font-mono uppercase tracking-widest">
                  Admin Terminal
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-[#00ffcc] hover:bg-[#00ffcc]/10 border border-transparent hover:border-[#00ffcc]/20 transition-all"
              aria-label="Cerrar menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto relative z-10">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-5">
              <div className="flex items-center gap-2 px-3 mb-2">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#00ffcc]/40 font-mono font-semibold">
                  {section.label}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#00ffcc]/10 to-transparent" />
              </div>
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group relative ${
                          isActive
                            ? "nav-item-active text-[#00ffcc] rounded-l-none"
                            : "text-white/45 hover:text-white/80 hover:bg-white/[0.03]"
                        }`}
                      >
                        <span
                          className={`transition-colors ${
                            isActive ? "text-[#00ffcc]" : "text-white/30 group-hover:text-white/50"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                        {isActive && (
                          <div className="ml-auto flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00ffcc]" style={{ boxShadow: "0 0 6px rgba(0,255,204,0.6)" }} />
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="relative z-10 px-3 py-4 border-t border-[#00ffcc]/10">
          {user && (
            <div className="flex items-center gap-3 px-3 mb-3">
              <div
                className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00ffcc]/20 to-[#00d4ff]/10 border border-[#00ffcc]/25 flex items-center justify-center text-[#00ffcc] font-bold text-xs font-mono"
                style={{ boxShadow: "0 0 10px rgba(0,255,204,0.1)" }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white/90 truncate leading-tight">
                  {user.username}
                </p>
                <p className="text-[10px] text-[#00ffcc]/50 font-mono uppercase tracking-wider mt-0.5">
                  {user.role === "admin" ? "root@admin" : "user@editor"}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2 px-1">
            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 text-[11px] font-medium hover:text-white/70 hover:bg-white/[0.06] hover:border-white/10 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Sitio web
            </a>
            <button
              onClick={onLogout}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-red-500/[0.05] border border-red-500/10 text-red-400/50 text-[11px] font-medium hover:bg-red-500/10 hover:text-red-400/80 hover:border-red-500/20 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesion
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
