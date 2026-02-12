"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/admin-shell";

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
      color: "#00ffcc",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
    {
      label: "Archivos",
      value: stats.totalFiles,
      color: "#00ffcc",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Imagenes",
      value: stats.totalImages,
      color: "#00ffcc",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Audio",
      value: stats.totalAudio,
      color: "#00ffcc",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
  ];

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getNotifColor(type: string) {
    switch (type) {
      case "new_content":
        return "border-l-[#00ffcc]";
      case "update_content":
        return "border-l-[#ffcc00]";
      case "delete_content":
        return "border-l-red-400";
      default:
        return "border-l-[#00ffcc]";
    }
  }

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-white/40 text-sm">
            Resumen general del contenido
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-[#00ffcc]/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40">{card.icon}</span>
                <span className="text-2xl font-bold text-white">
                  {card.value}
                </span>
              </div>
              <p className="text-xs text-white/40">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Recent posts */}
          <div className="lg:col-span-2 bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Publicaciones recientes
              </h2>
              <a
                href="/admin/content"
                className="text-[11px] text-[#00ffcc]/80 hover:text-[#00ffcc] transition-colors"
              >
                Ver todas
              </a>
            </div>
            <div className="divide-y divide-white/5">
              {posts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/20 flex items-center justify-center text-[#00ffcc] text-[11px] font-bold shrink-0">
                    {post.category.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {post.title}
                    </p>
                    <p className="text-[11px] text-white/30">
                      {post.author} - {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <span className="text-[11px] text-white/30 shrink-0 hidden sm:block">
                    {post.files?.length || 0} archivos
                  </span>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="p-8 text-center text-white/30 text-sm">
                  No hay publicaciones aun. Crea la primera.
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white">
                Actividad reciente
              </h2>
            </div>
            <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
              {notifications.slice(0, 10).map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 border-l-2 ${getNotifColor(notif.type)} hover:bg-white/5 transition-colors`}
                >
                  <p className="text-sm font-medium text-white">
                    {notif.title}
                  </p>
                  <p className="text-[11px] text-white/40 mt-0.5">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-white/20 mt-1">
                    {formatDate(notif.createdAt)}
                  </p>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="p-8 text-center text-white/30 text-sm">
                  Sin actividad reciente
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
