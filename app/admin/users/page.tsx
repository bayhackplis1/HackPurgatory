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
      <div className="max-w-4xl mx-auto">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg text-sm font-medium animate-notification backdrop-blur-sm ${
              toastType === "success"
                ? "bg-success/10 border border-success/30 text-success"
                : "bg-destructive/10 border border-destructive/30 text-destructive"
            }`}
          >
            {toast}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
            <p className="text-muted-foreground text-sm">
              Administra los usuarios del panel
            </p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            style={{ boxShadow: "0 0 15px rgba(0,255,204,0.2)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo usuario
          </button>
        </div>

        {/* Create user form */}
        {showCreate && (
          <div className="bg-card border border-border rounded-xl p-6 mb-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Crear nuevo usuario
            </h3>
            <form
              onSubmit={handleCreate}
              className="grid sm:grid-cols-3 gap-4"
            >
              <div>
                <label
                  htmlFor="new-username"
                  className="block text-xs font-medium text-muted-foreground mb-1.5"
                >
                  Usuario
                </label>
                <input
                  id="new-username"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-accent border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Nombre de usuario"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-xs font-medium text-muted-foreground mb-1.5"
                >
                  Contrasena
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-accent border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Contrasena segura"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="new-role"
                  className="block text-xs font-medium text-muted-foreground mb-1.5"
                >
                  Rol
                </label>
                <select
                  id="new-role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-accent border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="sm:col-span-3 flex gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {creating ? "Creando..." : "Crear usuario"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="bg-accent text-muted-foreground px-6 py-2.5 rounded-lg text-sm hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users list */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-5 flex items-center gap-4 hover:bg-accent/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{user.username}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        user.role === "admin"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-accent text-muted-foreground border border-border"
                      }`}
                    >
                      {user.role === "admin" ? "Administrador" : "Editor"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Creado: {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Eliminar usuario"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            {users.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No hay usuarios registrados
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
