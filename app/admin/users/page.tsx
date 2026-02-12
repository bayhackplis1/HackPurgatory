"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/admin-shell";

interface User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("editor");
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const loadUsers = useCallback(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []));
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function showToastMsg(msg: string, type: "success" | "error" = "success") {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToastMsg("Usuario creado correctamente");
        setNewUsername("");
        setNewPassword("");
        setNewRole("editor");
        setShowCreate(false);
        loadUsers();
      } else {
        showToastMsg(data.error || "Error al crear usuario", "error");
      }
    } catch {
      showToastMsg("Error de conexion", "error");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm("Seguro que deseas eliminar este usuario?")) return;

    const res = await fetch(`/api/users?id=${userId}`, { method: "DELETE" });
    const data = await res.json();

    if (res.ok) {
      showToastMsg("Usuario eliminado");
      loadUsers();
    } else {
      showToastMsg(data.error || "Error al eliminar", "error");
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg text-xs font-mono font-medium animate-notification backdrop-blur-sm ${
              toastType === "success"
                ? "bg-[#00ffcc]/8 border border-[#00ffcc]/20 text-[#00ffcc]"
                : "bg-[#ff4444]/8 border border-[#ff4444]/20 text-[#ff4444]"
            }`}
          >
            {toastType === "success" ? "[OK] " : "[ERR] "}{toast}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-white/15 font-mono text-xs">
              {users.length} usuario{users.length !== 1 ? "s" : ""} registrados
            </span>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#00ffcc]/15 hover:border-[#00ffcc]/30 transition-all font-mono"
            style={{ boxShadow: "0 0 15px rgba(0,255,204,0.08)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            nuevo_usuario
          </button>
        </div>

        {/* Create user form */}
        {showCreate && (
          <div className="admin-glass cyber-border rounded-xl p-6 mb-6 animate-fade-in">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-1.5 h-4 rounded-full bg-[#00ffcc]/30" />
              <h3 className="text-sm font-semibold text-white/80 font-mono">
                Crear nuevo usuario
              </h3>
            </div>
            <form
              onSubmit={handleCreate}
              className="grid sm:grid-cols-3 gap-4"
            >
              <div>
                <label
                  htmlFor="new-username"
                  className="block text-[10px] font-mono text-white/30 mb-2 uppercase tracking-wider"
                >
                  {"// username"}
                </label>
                <input
                  id="new-username"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white/80 placeholder-white/15 focus:outline-none focus:border-[#00ffcc]/25 transition-all font-mono"
                  placeholder="nombre_usuario"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-[10px] font-mono text-white/30 mb-2 uppercase tracking-wider"
                >
                  {"// password"}
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white/80 placeholder-white/15 focus:outline-none focus:border-[#00ffcc]/25 transition-all font-mono"
                  placeholder="********"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="new-role"
                  className="block text-[10px] font-mono text-white/30 mb-2 uppercase tracking-wider"
                >
                  {"// role"}
                </label>
                <select
                  id="new-role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white/60 focus:outline-none focus:border-[#00ffcc]/25 transition-all font-mono"
                >
                  <option value="editor">editor</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="sm:col-span-3 flex gap-3 mt-1">
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#00ffcc]/15 transition-all disabled:opacity-50 font-mono"
                >
                  {creating ? "creando..." : "$ useradd"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="bg-white/[0.03] border border-white/[0.06] text-white/30 px-6 py-2.5 rounded-lg text-sm hover:text-white/50 transition-all font-mono"
                >
                  cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users list */}
        <div className="admin-glass cyber-border rounded-xl overflow-hidden">
          <div className="divide-y divide-white/[0.04]">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-5 flex items-center gap-4 hover:bg-[#00ffcc]/[0.015] transition-colors group"
              >
                <div
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ffcc]/15 to-[#00d4ff]/8 border border-[#00ffcc]/20 flex items-center justify-center text-[#00ffcc]/70 font-bold text-xs font-mono"
                  style={{ boxShadow: "0 0 8px rgba(0,255,204,0.08)" }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white/80 font-mono text-sm">{user.username}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        user.role === "admin"
                          ? "bg-[#00ffcc]/[0.06] text-[#00ffcc]/60 border border-[#00ffcc]/12"
                          : "bg-white/[0.03] text-white/30 border border-white/[0.06]"
                      }`}
                    >
                      {user.role === "admin" ? "root" : "user"}
                    </span>
                    <span className="text-[10px] text-white/15 font-mono">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-white/20 hover:text-[#ff4444] hover:bg-[#ff4444]/[0.05] hover:border-[#ff4444]/15 transition-all opacity-0 group-hover:opacity-100"
                  title="Eliminar usuario"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            {users.length === 0 && (
              <div className="p-10 text-center text-white/20 text-sm font-mono">
                No hay usuarios registrados
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
