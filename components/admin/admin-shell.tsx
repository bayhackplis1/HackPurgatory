"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./sidebar";

interface User {
  id: string;
  username: string;
  role: string;
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

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
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-white/10 rounded-full" />
            <div className="w-12 h-12 border-2 border-[#00ffcc] border-t-transparent rounded-full animate-spin absolute inset-0" />
          </div>
          <p className="text-white/50 text-sm">Cargando panel...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - fixed on desktop, sliding on mobile */}
      <AdminSidebar
        user={user}
        onLogout={handleLogout}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content - properly offset on desktop */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/40 border-b border-white/10 px-4 lg:px-6 py-3 flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Abrir menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1" />

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-white leading-tight">
                {user.username}
              </span>
              <span className="text-[11px] text-[#00ffcc]/80 capitalize leading-tight">
                {user.role === "admin" ? "Administrador" : "Editor"}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/20 flex items-center justify-center text-[#00ffcc] font-bold text-xs">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
