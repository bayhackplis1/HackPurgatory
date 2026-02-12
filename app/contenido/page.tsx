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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/data/logo.png"
                  alt="HACK PURGATORY"
                  className="w-9 h-9 rounded-xl border border-primary/30 group-hover:border-primary/60 transition-colors object-cover"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-foreground tracking-wide leading-tight">
                  {"HACK [PURGATORY]"}
                </h1>
                <p className="text-[11px] text-primary/70 font-medium">Contenido</p>
              </div>
            </a>

            <div className="flex items-center gap-2">
              <NotificationBell />
              <a
                href="/"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
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

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium mb-5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Publicaciones de la comunidad
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance leading-tight">
              Contenido y Noticias
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-base leading-relaxed text-pretty">
              Tutoriales, recursos, herramientas y noticias de la comunidad.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Publicaciones</p>
              </div>
              <div className="w-px h-8 bg-border/40" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Categorias</p>
              </div>
              {pinnedPosts.length > 0 && (
                <>
                  <div className="w-px h-8 bg-border/40" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{pinnedPosts.length}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Fijados</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="sticky top-16 z-20 border-b border-border/40 bg-background/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por titulo, descripcion o etiqueta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-accent/40 border border-border/50 rounded-xl pl-10 pr-10 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:bg-accent/60 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Limpiar busqueda"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
              <button
                onClick={() => setFilterCat("all")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterCat === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent/40 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    filterCat === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent/40 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Active filters */}
          {(search || filterCat !== "all") && (
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span>{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/8 text-primary border border-primary/15">
                  {`"${search}"`}
                  <button onClick={() => setSearch("")} className="hover:text-foreground" aria-label="Quitar filtro">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {filterCat !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/8 text-primary border border-primary/15">
                  {filterCat}
                  <button onClick={() => setFilterCat("all")} className="hover:text-foreground" aria-label="Quitar filtro">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              <button
                onClick={() => { setSearch(""); setFilterCat("all"); }}
                className="ml-auto text-muted-foreground/60 hover:text-primary transition-colors"
              >
                Limpiar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="relative">
              <div className="w-10 h-10 border-2 border-border rounded-full" />
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
            </div>
            <p className="text-muted-foreground text-sm">Cargando contenido...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="flex flex-col gap-5">
            {/* Pinned */}
            {pinnedPosts.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                  </svg>
                  <span className="text-xs font-bold text-foreground uppercase tracking-widest">Fijados</span>
                  <div className="flex-1 h-px bg-border/30" />
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
                <svg className="w-4 h-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span className="text-xs font-bold text-foreground uppercase tracking-widest">Recientes</span>
                <div className="flex-1 h-px bg-border/30" />
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
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-accent/50 border border-border/40 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-foreground font-semibold mb-2">Sin resultados</p>
            <p className="text-muted-foreground text-sm mb-5">
              Prueba con otros terminos o cambia los filtros.
            </p>
            <button
              onClick={() => { setSearch(""); setFilterCat("all"); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-accent/50 border border-border/40 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-foreground font-semibold mb-2">Aun no hay contenido</p>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Proximamente se publicara contenido nuevo. Vuelve pronto.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="/data/logo.png" alt="" className="w-4 h-4 rounded opacity-50" />
            <span className="text-muted-foreground/60 text-xs">
              {"HACK [PURGATORY] 2026"}
            </span>
          </div>
          <p className="text-muted-foreground/40 text-xs">
            Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
