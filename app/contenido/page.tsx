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
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 backdrop-blur-xl bg-background/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/data/logo.png"
                  alt="HACK PURGATORY"
                  className="w-9 h-9 rounded-full border border-primary/50 group-hover:border-primary transition-colors"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-background" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-foreground tracking-wide leading-tight">
                  {"HACK [PURGATORY]"}
                </h1>
                <p className="text-[11px] text-primary font-medium">Contenido</p>
              </div>
            </a>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <NotificationBell />
              <a
                href="/"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Publicaciones y recursos de la comunidad
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance leading-tight">
            Contenido y Noticias
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg text-pretty leading-relaxed">
            Las ultimas publicaciones, recursos, tutoriales y noticias de la
            comunidad HACK PURGATORY.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-12 mt-8">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{posts.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Publicaciones</p>
            </div>
            <div className="w-px h-10 bg-border/60" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{categories.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Categorias</p>
            </div>
            <div className="w-px h-10 bg-border/60" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{pinnedPosts.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Fijados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="sticky top-16 z-20 border-y border-border/60 backdrop-blur-xl bg-background/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por titulo, descripcion o etiqueta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-card/80 border border-border/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
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

            {/* Category filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
              <button
                onClick={() => setFilterCat("all")}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filterCat === "all"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card/80 border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    filterCat === cat
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-card/80 border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Active filter indicator */}
          {(search || filterCat !== "all") && (
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span>Mostrando {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {`"${search}"`}
                  <button onClick={() => setSearch("")} className="hover:text-foreground" aria-label="Quitar filtro de busqueda">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {filterCat !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {filterCat}
                  <button onClick={() => setFilterCat("all")} className="hover:text-foreground" aria-label="Quitar filtro de categoria">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              <button
                onClick={() => { setSearch(""); setFilterCat("all"); }}
                className="ml-auto text-muted-foreground hover:text-primary transition-colors"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content feed */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {loading ? (
          <div className="flex flex-col items-center gap-5 py-24">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-border rounded-full" />
              <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium text-sm">Cargando contenido</p>
              <p className="text-muted-foreground text-xs mt-1">Por favor espera un momento...</p>
            </div>
          </div>
        ) : filtered.length > 0 ? (
          <div className="flex flex-col gap-6">
            {/* Pinned posts section */}
            {pinnedPosts.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                  </svg>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Fijados</h3>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
                <div className="flex flex-col gap-5">
                  {pinnedPosts.map((post) => (
                    <ContentCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular posts */}
            {regularPosts.length > 0 && pinnedPosts.length > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Recientes</h3>
                <div className="flex-1 h-px bg-border/40" />
              </div>
            )}
            <div className="flex flex-col gap-5">
              {regularPosts.map((post) => (
                <ContentCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ) : posts.length > 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-card border border-border/60 flex items-center justify-center">
              <svg className="w-10 h-10 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-foreground font-medium text-lg mb-2">
              No se encontraron resultados
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              Intenta cambiar los filtros o buscar con otros terminos.
            </p>
            <button
              onClick={() => { setSearch(""); setFilterCat("all"); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-card border border-border/60 flex items-center justify-center">
              <svg className="w-10 h-10 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-foreground font-medium text-lg mb-2">
              Aun no hay contenido
            </p>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Proximamente se publicara contenido nuevo. Vuelve pronto para ver las novedades de la comunidad.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/data/logo.png" alt="" className="w-5 h-5 rounded-full opacity-60" />
            <span className="text-muted-foreground text-sm">
              {"HACK [PURGATORY] 2026"}
            </span>
          </div>
          <p className="text-muted-foreground/60 text-xs">
            Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
