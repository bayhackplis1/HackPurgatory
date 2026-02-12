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
    <form onSubmit={handleSubmit} className="max-w-4xl">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#00ffcc]/10 border border-[#00ffcc]/30 text-[#00ffcc] px-5 py-3 rounded-lg text-sm font-medium animate-notification backdrop-blur-md">
          {toast}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <label
              htmlFor="title"
              className="block text-xs font-medium text-white/50 mb-2"
            >
              Titulo
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00ffcc]/40 transition-colors text-lg"
              placeholder="Titulo de la publicacion"
              required
            />
          </div>

          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <label
              htmlFor="description"
              className="block text-xs font-medium text-white/50 mb-2"
            >
              Contenido
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00ffcc]/40 transition-colors resize-y"
              placeholder="Escribe el contenido de la publicacion..."
              required
            />
          </div>

          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <label className="block text-xs font-medium text-white/50 mb-3">
              Archivos adjuntos
            </label>
            <FileUploader files={files} onChange={setFiles} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">
              Configuracion
            </h3>

            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-[11px] font-medium text-white/40 mb-2"
              >
                Categoria
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00ffcc]/40 transition-colors"
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
                className="block text-[11px] font-medium text-white/40 mb-2"
              >
                Etiquetas (separadas por coma)
              </label>
              <input
                id="tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00ffcc]/40 transition-colors"
                placeholder="hacking, seguridad, tutorial"
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
                <div className="w-10 h-5 bg-white/10 border border-white/10 rounded-full peer-checked:bg-[#00ffcc]/20 peer-checked:border-[#00ffcc]/30 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white/40 rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-[#00ffcc]" />
              </div>
              <span className="text-sm text-white/50 group-hover:text-white transition-colors">
                Fijar publicacion
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#00ffcc] text-black font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-[#00ffcc]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Guardando...
              </span>
            ) : mode === "create" ? (
              "Publicar"
            ) : (
              "Actualizar"
            )}
          </button>

          <a
            href="/admin/content"
            className="w-full text-center bg-white/5 border border-white/10 text-white/50 font-medium py-3 rounded-xl hover:text-white hover:bg-white/10 transition-all block"
          >
            Cancelar
          </a>
        </div>
      </div>
    </form>
  );
}
