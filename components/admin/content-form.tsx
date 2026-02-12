"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "./file-uploader";

interface ContentFile {
  id: string;
  name: string;
  originalName: string;
  type: "image" | "audio" | "video" | "document" | "other";
  mimeType: string;
  size: number;
  path: string;
}

interface ContentFormProps {
  initial?: {
    id?: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    pinned: boolean;
    files: ContentFile[];
  };
  mode: "create" | "edit";
}

const CATEGORIES = [
  "General",
  "Noticias",
  "Tutoriales",
  "Herramientas",
  "Seguridad",
  "Recursos",
  "Comunicados",
  "Eventos",
];

export default function ContentForm({ initial, mode }: ContentFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [category, setCategory] = useState(initial?.category || "General");
  const [tagsInput, setTagsInput] = useState(initial?.tags?.join(", ") || "");
  const [pinned, setPinned] = useState(initial?.pinned || false);
  const [files, setFiles] = useState<ContentFile[]>(initial?.files || []);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      ...(mode === "edit" && initial?.id ? { id: initial.id } : {}),
      title,
      description,
      category,
      tags,
      pinned,
      files,
    };

    try {
      const res = await fetch("/api/content", {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast(
          mode === "create"
            ? "Publicacion creada correctamente"
            : "Publicacion actualizada correctamente"
        );
        setTimeout(() => router.push("/admin/content"), 1000);
      }
    } catch {
      showToast("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#00ffcc]/8 border border-[#00ffcc]/20 text-[#00ffcc] px-5 py-3 rounded-lg text-xs font-mono font-medium animate-notification backdrop-blur-md">
          {"[OK] "}{toast}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="admin-glass cyber-border rounded-xl p-5">
            <label
              htmlFor="title"
              className="block text-[10px] font-mono text-white/30 mb-2 uppercase tracking-wider"
            >
              {"// titulo"}
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-white/80 placeholder-white/15 focus:outline-none focus:border-[#00ffcc]/25 focus:bg-white/[0.05] transition-all text-lg"
              placeholder="Titulo de la publicacion"
              required
            />
          </div>

          <div className="admin-glass cyber-border rounded-xl p-5">
            <label
              htmlFor="description"
              className="block text-[10px] font-mono text-white/30 mb-2 uppercase tracking-wider"
            >
              {"// contenido"}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-white/80 placeholder-white/15 focus:outline-none focus:border-[#00ffcc]/25 focus:bg-white/[0.05] transition-all resize-y"
              placeholder="Escribe el contenido de la publicacion..."
              required
            />
          </div>

          <div className="admin-glass cyber-border rounded-xl p-5">
            <label className="block text-[10px] font-mono text-white/30 mb-3 uppercase tracking-wider">
              {"// archivos_adjuntos"}
            </label>
            <FileUploader files={files} onChange={setFiles} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="admin-glass cyber-border rounded-xl p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-1.5 h-4 rounded-full bg-[#00ffcc]/30" />
              <h3 className="text-sm font-semibold text-white/80 font-mono">
                Configuracion
              </h3>
            </div>

            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-[10px] font-mono text-white/30 mb-2 uppercase tracking-wider"
              >
                {"// categoria"}
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white/60 focus:outline-none focus:border-[#00ffcc]/25 transition-all font-mono"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="tags"
                className="block text-[10px] font-mono text-white/30 mb-2 uppercase tracking-wider"
              >
                {"// tags (separadas por coma)"}
              </label>
              <input
                id="tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white/60 placeholder-white/15 focus:outline-none focus:border-[#00ffcc]/25 transition-all font-mono"
                placeholder="hacking, seguridad"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-white/[0.05] border border-white/[0.06] rounded-full peer-checked:bg-[#00ffcc]/15 peer-checked:border-[#00ffcc]/25 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white/20 rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-[#00ffcc]" style={{ boxShadow: "0 0 6px rgba(0,255,204,0.3)" }} />
              </div>
              <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors font-mono">
                fijar_publicacion
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#00ffcc]/10 border border-[#00ffcc]/25 text-[#00ffcc] font-mono font-bold py-3 rounded-xl hover:bg-[#00ffcc]/15 hover:border-[#00ffcc]/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ boxShadow: saving ? "none" : "0 0 15px rgba(0,255,204,0.08)" }}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#00ffcc] border-t-transparent rounded-full animate-spin" />
                Guardando...
              </span>
            ) : mode === "create" ? (
              "$ publish"
            ) : (
              "$ update"
            )}
          </button>

          <a
            href="/admin/content"
            className="w-full text-center bg-white/[0.03] border border-white/[0.06] text-white/30 font-mono font-medium py-3 rounded-xl hover:text-white/50 hover:bg-white/[0.05] transition-all block"
          >
            cancelar
          </a>
        </div>
      </div>
    </form>
  );
}
