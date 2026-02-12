"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/admin-shell";
import Link from "next/link";

interface ContentPost {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  createdAt: string;
  files: { type: string }[];
  pinned: boolean;
  tags: string[];
}

export default function ContentListPage() {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadContent = useCallback(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setPosts(data.content || []));
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleDelete(id: string) {
    if (!confirm("Seguro que deseas eliminar esta publicacion?")) return;
    setDeleting(id);
    const res = await fetch(`/api/content?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Publicacion eliminada correctamente");
      loadContent();
    }
    setDeleting(null);
  }

  const categories = Array.from(new Set(posts.map((p) => p.category)));

  const filtered = posts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 bg-[#00ffcc]/8 border border-[#00ffcc]/20 text-[#00ffcc] px-5 py-3 rounded-lg text-sm font-medium animate-notification backdrop-blur-md font-mono">
            {toast}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-white/15 font-mono text-xs hidden sm:block">
              {filtered.length}/{posts.length} registros
            </span>
          </div>
          <Link
            href="/admin/content/new"
            className="flex items-center gap-2 bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#00ffcc]/15 hover:border-[#00ffcc]/30 transition-all font-mono"
            style={{ boxShadow: "0 0 15px rgba(0,255,204,0.08)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            nueva_publicacion
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar publicaciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-[#00ffcc]/25 focus:bg-white/[0.05] transition-all font-mono"
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white/60 focus:outline-none focus:border-[#00ffcc]/25 transition-all font-mono"
          >
            <option value="all">todas_categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Content list as table-like rows */}
        <div className="admin-glass cyber-border rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="px-5 py-3 border-b border-[#00ffcc]/8 grid grid-cols-12 gap-3 text-[10px] text-white/25 font-mono uppercase tracking-wider">
            <span className="col-span-5 sm:col-span-4">Titulo</span>
            <span className="col-span-3 sm:col-span-2 hidden sm:block">Categoria</span>
            <span className="col-span-2 hidden sm:block">Autor</span>
            <span className="col-span-2 hidden sm:block">Fecha</span>
            <span className="col-span-3 sm:col-span-2 text-right">Acciones</span>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {filtered.map((post) => (
              <div
                key={post.id}
                className="px-5 py-3.5 grid grid-cols-12 gap-3 items-center hover:bg-[#00ffcc]/[0.015] transition-colors group"
              >
                {/* Title */}
                <div className="col-span-9 sm:col-span-4 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {post.pinned && (
                      <span className="text-[9px] text-[#ffcc00]/60 bg-[#ffcc00]/[0.06] px-1.5 py-0.5 rounded border border-[#ffcc00]/15 font-mono">
                        PIN
                      </span>
                    )}
                    <h3 className="text-sm font-medium text-white/70 truncate group-hover:text-white/90 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-white/20 truncate font-mono">
                    {post.files?.length || 0} archivos
                  </p>
                </div>

                {/* Category */}
                <div className="col-span-2 hidden sm:block">
                  <span className="text-[10px] text-[#00ffcc]/50 bg-[#00ffcc]/[0.05] px-2 py-1 rounded border border-[#00ffcc]/10 font-mono">
                    {post.category}
                  </span>
                </div>

                {/* Author */}
                <div className="col-span-2 hidden sm:block">
                  <span className="text-xs text-white/30 font-mono">{post.author}</span>
                </div>

                {/* Date */}
                <div className="col-span-2 hidden sm:block">
                  <span className="text-[11px] text-white/20 font-mono">{formatDate(post.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="col-span-3 sm:col-span-2 flex items-center gap-1.5 justify-end">
                  <Link
                    href={`/admin/content/edit/${post.id}`}
                    className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-[#00ffcc] hover:border-[#00ffcc]/20 hover:bg-[#00ffcc]/[0.05] transition-all"
                    title="Editar"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-[#ff4444] hover:border-[#ff4444]/20 hover:bg-[#ff4444]/[0.05] transition-all disabled:opacity-50"
                    title="Eliminar"
                  >
                    {deleting === post.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-[#ff4444] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-sm text-white/20 font-mono">No se encontraron publicaciones</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
