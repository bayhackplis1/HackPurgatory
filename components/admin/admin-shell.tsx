"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./sidebar";

interface User {
  id: string;
  username: string;
  role: string;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "Dashboard", subtitle: "Resumen general del sistema" },
  "/admin/sections": { title: "Editar Secciones", subtitle: "Modifica el contenido del sitio" },
  "/admin/content": { title: "Publicaciones", subtitle: "Gestiona el contenido publicado" },
  "/admin/content/new": { title: "Nueva Publicacion", subtitle: "Crea nuevo contenido" },
  "/admin/files": { title: "Gestor de Archivos", subtitle: "Administra archivos y media" },
  "/admin/users": { title: "Usuarios", subtitle: "Administra usuarios del panel" },
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const pageInfo = PAGE_TITLES[pathname] || { title: "Admin", subtitle: "" };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error("not auth");
        return r.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border border-[#00ffcc]/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-[#00ffcc] border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-2 border border-[#00ffcc]/10 rounded-full" />
            <div className="absolute inset-2 border border-[#00ffcc]/40 border-b-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
          </div>
          <div className="text-center">
            <p className="text-[#00ffcc]/70 text-sm font-mono">Inicializando sistema...</p>
            <p className="text-white/20 text-xs font-mono mt-1">Verificando credenciales</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      <AdminSidebar
        user={user}
        onLogout={handleLogout}
        mobileOpen={sidebarOpen}
        desktopOpen={desktopSidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
          setDesktopSidebarOpen(false);
        }}
      />

      {/* Main content area */}
      <div
        className={`flex-1 min-h-screen flex flex-col transition-[margin] duration-300 ease-in-out ${
          desktopSidebarOpen ? "lg:ml-[260px]" : "lg:ml-0"
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 admin-glass border-b border-[#00ffcc]/8 px-4 lg:px-6">
          <div className="flex items-center gap-4 h-14">
            {/* Menu toggle */}
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setSidebarOpen(true);
                } else {
                  setDesktopSidebarOpen(true);
                }
              }}
              className={`flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-[#00ffcc] hover:bg-[#00ffcc]/[0.05] hover:border-[#00ffcc]/20 transition-all ${
                desktopSidebarOpen ? "lg:hidden" : ""
              }`}
              aria-label="Abrir menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Page title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-sm font-bold text-white/90 leading-tight">{pageInfo.title}</h1>
                  <p className="text-[11px] text-white/30 font-mono leading-tight mt-0.5">{pageInfo.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* System status indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00ffcc]/[0.04] border border-[#00ffcc]/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] animate-pulse" style={{ boxShadow: "0 0 6px rgba(0,255,204,0.5)" }} />
                <span className="text-[10px] text-[#00ffcc]/60 font-mono uppercase tracking-wider">Online</span>
              </div>

              {/* User avatar */}
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-medium text-white/80 leading-tight">
                    {user.username}
                  </span>
                  <span className="text-[10px] text-[#00ffcc]/50 font-mono leading-tight">
                    {user.role === "admin" ? "root" : "user"}
                  </span>
                </div>
                <div
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ffcc]/15 to-[#00d4ff]/10 border border-[#00ffcc]/20 flex items-center justify-center text-[#00ffcc] font-bold text-xs font-mono"
                  style={{ boxShadow: "0 0 8px rgba(0,255,204,0.1)" }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="animate-fade-in">{children}</div>
        </main>

        {/* Bottom status bar */}
        <footer className="px-4 lg:px-6 py-2 border-t border-[#00ffcc]/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-white/15 font-mono">{"HACK [PURGATORY] v2.0"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#00ffcc]/30" />
            <span className="text-[10px] text-white/15 font-mono">SYS_OK</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
