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

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md border-b border-border" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <a href="/" className="flex items-center gap-3 shrink-0">
            <img
              src="https://hackpurgatory.org/data/logo.png"
              alt="HACK PURGATORY"
              className="w-10 h-10 rounded-full border border-primary"
            />
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-foreground tracking-wider">
                {"HACK [PURGATORY]"}
              </h1>
              <p className="text-xs text-primary">Contenido</p>
            </div>
          </a>

          <div className="flex-1" />

          <NotificationBell />

          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Inicio
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative border-b border-border" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
            Contenido y Noticias
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-pretty">
            Las ultimas publicaciones, recursos, tutoriales y noticias de la
            comunidad HACK PURGATORY.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[73px] z-20 backdrop-blur-md border-b border-border" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar contenido..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterCat("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filterCat === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filterCat === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content feed */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">
              Cargando contenido...
            </p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filtered.map((post) => (
              <ContentCard key={post.id} post={post} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-muted-foreground">
              No se encontraron resultados
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-muted-foreground text-lg mb-2">
              Aun no hay contenido
            </p>
            <p className="text-muted-foreground text-sm">
              Proximamente se publicara contenido nuevo.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-muted-foreground text-sm">
        <div className="max-w-4xl mx-auto px-4">
          {"HACK [PURGATORY] 2026. Todos los derechos reservados."}
        </div>
      </footer>
    </div>
  );
}
