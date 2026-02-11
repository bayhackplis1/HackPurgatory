"use client";

import { useEffect, useState, useCallback } from "react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState<string>("");
  const [newCount, setNewCount] = useState(0);

  const fetchNotifications = useCallback(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        const notifs = data.notifications || [];
        setNotifications(notifs);

        const stored = localStorage.getItem("hp_notif_seen") || "";
        setLastSeen(stored);

        if (stored) {
          const unseenCount = notifs.filter(
            (n: Notification) => n.createdAt > stored
          ).length;
          setNewCount(unseenCount);
        } else {
          setNewCount(notifs.length > 0 ? notifs.length : 0);
        }
      });
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  function handleOpen() {
    setOpen(!open);
    if (!open) {
      const now = new Date().toISOString();
      localStorage.setItem("hp_notif_seen", now);
      setLastSeen(now);
      setNewCount(0);
    }
  }

  function formatTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Ahora";
    if (mins < 60) return `Hace ${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Hace ${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `Hace ${days}d`;
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case "new_content":
        return (
          <div className="w-8 h-8 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case "update_content":
        return (
          <div className="w-8 h-8 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center text-warning shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        );
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2.5 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
        aria-label="Notificaciones"
      >
        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {newCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold animate-pulse-glow">
            {newCount > 9 ? "9+" : newCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm">
                Notificaciones
              </h3>
              <span className="text-xs text-muted-foreground">
                {notifications.length} total
              </span>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {notifications.slice(0, 15).map((notif) => {
                const isNew = lastSeen ? notif.createdAt > lastSeen : true;
                return (
                  <div
                    key={notif.id}
                    className={`p-4 flex items-start gap-3 hover:bg-accent/50 transition-colors ${
                      isNew ? "bg-primary/5" : ""
                    }`}
                  >
                    {getTypeIcon(notif.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 opacity-60">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>
                    {isNew && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </div>
                );
              })}
              {notifications.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Sin notificaciones
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
