"use client";

import { useEffect, useState, useCallback } from "react";
import ContentCard from "@/components/public/content-card";
import NotificationBell from "@/components/public/notification-bell";

interface ContentFile {
  id: string;
  name: string;
  originalName: string;
  type: "image" | "audio" | "video" | "document" | "other";
  mimeType: string;
  size: number;
  path: string;
}

interface ContentPost {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  createdAt: string;
  files: ContentFile[];
  pinned: boolean;
  tags: string[];
}

export default function ContenidoPage() {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  const loadContent = useCallback(() => {
    setLoading(true);
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setPosts(data.content || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const categories = Array.from(new Set(posts.map((p) => p.category)));

  const filtered = posts.filter((p) => {
    const matchSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const pinnedPosts = filtered.filter((p) => p.pinned);
  const regularPosts = filtered.filter((p) => !p.pinned);

  return (
    <div className="min-h-screen">
      {/* Header - glass navbar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <a href="/" className="flex items-center gap-3 group">
              <img
                src="/data/logo.png"
                alt="HACK PURGATORY"
                className="w-8 h-8 rounded-lg border border-white/20 group-hover:border-[#00ffcc]/50 transition-colors object-cover"
              />
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-white tracking-wide leading-tight">
                  {"HACK [PURGATORY]"}
                </h1>
                <p className="text-[10px] text-[#00ffcc]/80 font-medium">Contenido</p>
              </div>
            </a>

            <div className="flex items-center gap-2">
              <NotificationBell />
              <a
                href="/"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 hover:text-white hover:bg-white/10 hover:border-[#00ffcc]/30 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Inicio</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] text-xs font-medium mb-5 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Publicaciones de la comunidad
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 text-balance leading-tight drop-shadow-lg">
            Contenido y Noticias
          </h2>
          <p className="text-white/60 max-w-lg mx-auto text-base leading-relaxed text-pretty">
            Tutoriales, recursos, herramientas y noticias de la comunidad.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 mt-8">
            <div className="px-5 py-3 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10">
              <p className="text-xl font-bold text-white">{posts.length}</p>
              <p className="text-[11px] text-white/50 mt-0.5">Publicaciones</p>
            </div>
            <div className="px-5 py-3 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10">
              <p className="text-xl font-bold text-white">{categories.length}</p>
              <p className="text-[11px] text-white/50 mt-0.5">Categorias</p>
            </div>
            {pinnedPosts.length > 0 && (
              <div className="px-5 py-3 rounded-xl bg-black/30 backdrop-blur-sm border border-[#00ffcc]/20">
                <p className="text-xl font-bold text-[#00ffcc]">{pinnedPosts.length}</p>
                <p className="text-[11px] text-white/50 mt-0.5">Fijados</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search & Filters - glass bar */}
      <div className="sticky top-14 z-20 backdrop-blur-xl bg-black/40 border-y border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por titulo, descripcion o etiqueta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00ffcc]/40 focus:bg-white/10 transition-all backdrop-blur-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  aria-label="Limpiar busqueda"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              <button
                onClick={() => setFilterCat("all")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterCat === "all"
                    ? "bg-[#00ffcc] text-black shadow-lg shadow-[#00ffcc]/20"
                    : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    filterCat === cat
                      ? "bg-[#00ffcc] text-black shadow-lg shadow-[#00ffcc]/20"
                      : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Active filters */}
          {(search || filterCat !== "all") && (
            <div className="flex items-center gap-2 mt-3 text-xs text-white/50">
              <span>{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/20">
                  {`"${search}"`}
                  <button onClick={() => setSearch("")} className="hover:text-white" aria-label="Quitar filtro">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {filterCat !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/20">
                  {filterCat}
                  <button onClick={() => setFilterCat("all")} className="hover:text-white" aria-label="Quitar filtro">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              <button
                onClick={() => { setSearch(""); setFilterCat("all"); }}
                className="ml-auto text-white/30 hover:text-[#00ffcc] transition-colors"
              >
                Limpiar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="relative">
              <div className="w-10 h-10 border-2 border-white/10 rounded-full" />
              <div className="w-10 h-10 border-2 border-[#00ffcc] border-t-transparent rounded-full animate-spin absolute inset-0" />
            </div>
            <p className="text-white/50 text-sm">Cargando contenido...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="flex flex-col gap-5">
            {/* Pinned */}
            {pinnedPosts.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <svg className="w-4 h-4 text-[#ffcc00]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                  </svg>
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Fijados</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <div className="flex flex-col gap-5">
                  {pinnedPosts.map((post) => (
                    <ContentCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular */}
            {regularPosts.length > 0 && pinnedPosts.length > 0 && (
              <div className="flex items-center gap-2.5 mb-1 mt-2">
                <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span className="text-xs font-bold text-white uppercase tracking-widest">Recientes</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            )}
            <div className="flex flex-col gap-5">
              {regularPosts.map((post) => (
                <ContentCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : posts.length > 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-white font-semibold mb-2">Sin resultados</p>
            <p className="text-white/50 text-sm mb-5">
              Prueba con otros terminos o cambia los filtros.
            </p>
            <button
              onClick={() => { setSearch(""); setFilterCat("all"); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00ffcc] text-black text-sm font-medium hover:shadow-lg hover:shadow-[#00ffcc]/20 transition-all"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-white font-semibold mb-2">Aun no hay contenido</p>
            <p className="text-white/50 text-sm max-w-sm mx-auto">
              Proximamente se publicara contenido nuevo. Vuelve pronto.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 backdrop-blur-sm bg-black/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="/data/logo.png" alt="" className="w-4 h-4 rounded opacity-50" />
            <span className="text-white/40 text-xs">
              {"HACK [PURGATORY] 2026"}
            </span>
          </div>
          <p className="text-white/25 text-xs">
            Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
