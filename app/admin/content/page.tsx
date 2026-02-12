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
      <div className="max-w-6xl mx-auto">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 bg-[#00ffcc]/10 border border-[#00ffcc]/30 text-[#00ffcc] px-5 py-3 rounded-lg text-sm font-medium animate-notification backdrop-blur-md">
            {toast}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-xl font-bold text-white">Contenido</h1>
            <p className="text-white/40 text-sm">
              {posts.length} publicaciones en total
            </p>
          </div>
          <Link
            href="/admin/content/new"
            className="flex items-center gap-2 bg-[#00ffcc] text-black px-4 py-2 rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-[#00ffcc]/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva publicacion
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar publicaciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00ffcc]/40 transition-colors backdrop-blur-sm"
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00ffcc]/40 transition-colors backdrop-blur-sm"
          >
            <option value="all">Todas las categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Content list */}
        <div className="grid gap-3">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-start gap-3 hover:border-white/20 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/20 flex items-center justify-center text-[#00ffcc] font-bold text-xs shrink-0">
                {post.category.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {post.pinned && (
                    <span className="text-[10px] bg-[#ffcc00]/10 text-[#ffcc00] px-1.5 py-0.5 rounded border border-[#ffcc00]/20">
                      Fijado
                    </span>
                  )}
                  <span className="text-[10px] text-[#00ffcc]/80 bg-[#00ffcc]/10 px-1.5 py-0.5 rounded border border-[#00ffcc]/20">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 truncate">
                  {post.title}
                </h3>
                <p className="text-[13px] text-white/40 line-clamp-1 mb-1.5">
                  {post.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-white/30">
                  <span>{post.author}</span>
                  <span>{formatDate(post.createdAt)}</span>
                  <span>{post.files?.length || 0} archivos</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href={`/admin/content/edit/${post.id}`}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-[#00ffcc] hover:border-[#00ffcc]/20 hover:bg-[#00ffcc]/5 transition-colors"
                  title="Editar"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deleting === post.id}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/5 transition-colors disabled:opacity-50"
                  title="Eliminar"
                >
                  {deleting === post.id ? (
                    <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-sm">No se encontraron publicaciones</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
