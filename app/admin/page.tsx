"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import Link from "next/link";

interface ContentPost {
  id: string;
  title: string;
  category: string;
  author: string;
  createdAt: string;
  files: { type: string }[];
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalFiles: 0,
    totalImages: 0,
    totalAudio: 0,
    totalVideo: 0,
  });

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const content = data.content || [];
        setPosts(content);
        const allFiles = content.flatMap(
          (p: ContentPost) => p.files || []
        );
        setStats({
          totalPosts: content.length,
          totalFiles: allFiles.length,
          totalImages: allFiles.filter(
            (f: { type: string }) => f.type === "image"
          ).length,
          totalAudio: allFiles.filter(
            (f: { type: string }) => f.type === "audio"
          ).length,
          totalVideo: allFiles.filter(
            (f: { type: string }) => f.type === "video"
          ).length,
        });
      });

    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => setNotifications(data.notifications || []));
  }, []);

  const statCards = [
    {
      label: "Publicaciones",
      value: stats.totalPosts,
      delta: "+12%",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
    {
      label: "Archivos",
      value: stats.totalFiles,
      delta: `${stats.totalImages} img`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Media",
      value: stats.totalImages + stats.totalAudio + stats.totalVideo,
      delta: `${stats.totalVideo} vid`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Audio",
      value: stats.totalAudio,
      delta: "tracks",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
  ];

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getNotifIcon(type: string) {
    switch (type) {
      case "new_content":
        return { color: "#00ffcc", bg: "rgba(0,255,204,0.08)", borderColor: "rgba(0,255,204,0.15)" };
      case "update_content":
        return { color: "#ffcc00", bg: "rgba(255,204,0,0.08)", borderColor: "rgba(255,204,0,0.15)" };
      case "delete_content":
        return { color: "#ff4444", bg: "rgba(255,68,68,0.08)", borderColor: "rgba(255,68,68,0.15)" };
      default:
        return { color: "#00ffcc", bg: "rgba(0,255,204,0.08)", borderColor: "rgba(0,255,204,0.15)" };
    }
  }

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="stat-card-glow admin-glass cyber-border rounded-xl p-4 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#00ffcc]/[0.03] to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/25 group-hover:text-[#00ffcc]/40 transition-colors">{card.icon}</span>
                  <span className="text-[10px] text-[#00ffcc]/40 font-mono px-2 py-0.5 rounded-md bg-[#00ffcc]/[0.05] border border-[#00ffcc]/10">
                    {card.delta}
                  </span>
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-white/90 font-mono leading-none">
                  {card.value}
                </p>
                <p className="text-xs text-white/30 mt-1.5 font-medium">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Nueva publicacion", href: "/admin/content/new", icon: "M12 4v16m8-8H4" },
            { label: "Subir archivos", href: "/admin/files", icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" },
            { label: "Editar secciones", href: "/admin/sections", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
            { label: "Ver sitio web", href: "/", icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-[#00ffcc]/[0.04] hover:border-[#00ffcc]/15 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#00ffcc]/[0.06] border border-[#00ffcc]/10 flex items-center justify-center text-[#00ffcc]/40 group-hover:text-[#00ffcc]/70 group-hover:bg-[#00ffcc]/[0.1] transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
                </svg>
              </div>
              <span className="text-xs font-medium text-white/40 group-hover:text-white/70 transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          {/* Recent posts */}
          <div className="lg:col-span-3 admin-glass cyber-border rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#00ffcc]/8 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-4 rounded-full bg-[#00ffcc]/30" />
                <h2 className="text-sm font-semibold text-white/80">
                  Publicaciones recientes
                </h2>
              </div>
              <Link
                href="/admin/content"
                className="text-[11px] text-[#00ffcc]/50 hover:text-[#00ffcc] transition-colors font-mono"
              >
                {"ver_todas >"}
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {posts.slice(0, 6).map((post, i) => (
                <Link
                  key={post.id}
                  href={`/admin/content/edit/${post.id}`}
                  className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#00ffcc]/[0.02] transition-colors group"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ffcc]/10 to-[#00d4ff]/5 border border-[#00ffcc]/15 flex items-center justify-center text-[#00ffcc]/50 text-[11px] font-bold font-mono shrink-0 group-hover:text-[#00ffcc]/80 transition-colors">
                    {post.category.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/70 truncate group-hover:text-white/90 transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-white/25 font-mono">{post.author}</span>
                      <span className="text-white/10">{"/"}</span>
                      <span className="text-[10px] text-white/20 font-mono">{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-white/20 font-mono hidden sm:block">
                      {post.files?.length || 0} files
                    </span>
                    <svg className="w-4 h-4 text-white/10 group-hover:text-[#00ffcc]/30 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
              {posts.length === 0 && (
                <div className="p-10 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <p className="text-white/20 text-sm font-mono">No hay publicaciones</p>
                  <Link href="/admin/content/new" className="text-[#00ffcc]/50 text-xs font-mono hover:text-[#00ffcc] mt-2 inline-block">
                    {"+ crear_primera"}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Activity log */}
          <div className="lg:col-span-2 admin-glass cyber-border rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#00ffcc]/8 flex items-center gap-2.5">
              <div className="w-1.5 h-4 rounded-full bg-[#ffcc00]/30" />
              <h2 className="text-sm font-semibold text-white/80">
                Log de actividad
              </h2>
            </div>
            <div className="divide-y divide-white/[0.04] max-h-[420px] overflow-y-auto">
              {notifications.slice(0, 12).map((notif) => {
                const style = getNotifIcon(notif.type);
                return (
                  <div
                    key={notif.id}
                    className="px-5 py-3 hover:bg-white/[0.015] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: style.color, boxShadow: `0 0 6px ${style.color}40` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white/60 leading-relaxed">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-white/25 mt-0.5 truncate">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-white/15 mt-1 font-mono">
                          {formatDate(notif.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {notifications.length === 0 && (
                <div className="p-10 text-center">
                  <p className="text-white/20 text-sm font-mono">Sin actividad</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
