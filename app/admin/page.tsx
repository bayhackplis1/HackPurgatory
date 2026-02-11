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
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
    {
      label: "Archivos",
      value: stats.totalFiles,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Imagenes",
      value: stats.totalImages,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Audio",
      value: stats.totalAudio,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
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
        return "border-l-success";
      case "update_content":
        return "border-l-warning";
      case "delete_content":
        return "border-l-destructive";
      default:
        return "border-l-primary";
    }
  }

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Resumen general del contenido
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{card.icon}</span>
                <span className="text-2xl font-bold text-foreground">
                  {card.value}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent posts */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">
                Publicaciones recientes
              </h2>
              <a
                href="/admin/content"
                className="text-xs text-primary hover:underline"
              >
                Ver todas
              </a>
            </div>
            <div className="divide-y divide-border">
              {posts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {post.category.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {post.author} - {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {post.files?.length || 0} archivos
                  </span>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No hay publicaciones aun. Crea la primera.
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-semibold text-foreground">
                Actividad reciente
              </h2>
            </div>
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {notifications.slice(0, 10).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-l-2 ${getNotifColor(notif.type)} hover:bg-accent/50 transition-colors`}
                >
                  <p className="text-sm font-medium text-foreground">
                    {notif.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 opacity-60">
                    {formatDate(notif.createdAt)}
                  </p>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
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
