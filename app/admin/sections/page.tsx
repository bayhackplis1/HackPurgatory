"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/admin-shell";
import type { SiteSettings } from "@/lib/storage";

type SectionKey = "about" | "info" | "channels" | "report" | "rdpvps" | "stats" | "gallery" | "downloads";

const SECTION_LABELS: Record<SectionKey, string> = {
  about: "Sobre Nosotros",
  info: "Informacion",
  channels: "Canales",
  report: "Reportar",
  rdpvps: "RDP/VPS",
  stats: "Estadisticas",
  gallery: "Galeria",
  downloads: "Descargas",
};

export default function SectionsEditorPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>("about");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadSettings = useCallback(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data.settings));
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast("Secciones guardadas correctamente");
      }
    } catch {
      showToast("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        {toast && (
          <div className="fixed top-4 right-4 z-50 bg-success/10 border border-success/30 text-success px-5 py-3 rounded-lg text-sm font-medium animate-notification backdrop-blur-sm">
            {toast}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div />
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#00ffcc]/10 border border-[#00ffcc]/20 text-[#00ffcc] px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#00ffcc]/15 hover:border-[#00ffcc]/30 transition-all disabled:opacity-50 font-mono"
            style={{ boxShadow: "0 0 15px rgba(0,255,204,0.08)" }}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-[#00ffcc] border-t-transparent rounded-full animate-spin" />
                guardando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                $ save_changes
              </>
            )}
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
          {(Object.keys(SECTION_LABELS) as SectionKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
                activeSection === key
                  ? "bg-[#00ffcc]/10 text-[#00ffcc] border border-[#00ffcc]/20"
                  : "bg-white/[0.02] border border-white/[0.06] text-white/30 hover:text-white/60 hover:border-[#00ffcc]/15"
              }`}
            >
              {SECTION_LABELS[key]}
            </button>
          ))}
        </div>

        {/* Section editors */}
        <div className="admin-glass cyber-border rounded-xl p-6">
          {activeSection === "about" && (
            <AboutEditor
              data={settings.about}
              onChange={(about) => setSettings({ ...settings, about })}
            />
          )}
          {activeSection === "info" && (
            <InfoEditor
              data={settings.info}
              onChange={(info) => setSettings({ ...settings, info })}
            />
          )}
          {activeSection === "channels" && (
            <ChannelsEditor
              data={settings.channels}
              onChange={(channels) => setSettings({ ...settings, channels })}
            />
          )}
          {activeSection === "report" && (
            <ReportEditor
              data={settings.report}
              onChange={(report) => setSettings({ ...settings, report })}
            />
          )}
          {activeSection === "rdpvps" && (
            <RdpVpsEditor
              data={settings.rdpvps}
              onChange={(rdpvps) => setSettings({ ...settings, rdpvps })}
            />
          )}
          {activeSection === "stats" && (
            <StatsEditor
              data={settings.stats}
              onChange={(stats) => setSettings({ ...settings, stats })}
            />
          )}
          {activeSection === "gallery" && (
            <GalleryEditor
              data={settings.gallery}
              onChange={(gallery) => setSettings({ ...settings, gallery })}
            />
          )}
          {activeSection === "downloads" && (
            <DownloadsEditor
              data={settings.downloads}
              onChange={(downloads) => setSettings({ ...settings, downloads })}
            />
          )}
        </div>
      </div>
    </AdminShell>
  );
}

const inputClass =
  "w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white/80 placeholder-white/15 focus:outline-none focus:border-[#00ffcc]/25 focus:bg-white/[0.05] transition-all font-mono";
const labelClass = "block text-[10px] font-mono text-white/30 mb-2 uppercase tracking-wider";

function AboutEditor({
  data,
  onChange,
}: {
  data: SiteSettings["about"];
  onChange: (d: SiteSettings["about"]) => void;
}) {
  function updateFeature(index: number, field: "title" | "description", value: string) {
    const features = [...data.features];
    features[index] = { ...features[index], [field]: value };
    onChange({ ...data, features });
  }

  function addFeature() {
    onChange({
      ...data,
      features: [...data.features, { title: "", description: "" }],
    });
  }

  function removeFeature(index: number) {
    onChange({
      ...data,
      features: data.features.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className={labelClass}>Titulo de la seccion</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white/80 font-mono">Caracteristicas</h3>
          <button
            type="button"
            onClick={addFeature}
            className="text-xs text-[#00ffcc]/60 hover:text-[#00ffcc] font-mono transition-colors"
          >
            + Agregar
          </button>
        </div>
        {data.features.map((feature, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/25 font-mono">Caracteristica {i + 1}</span>
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="text-[10px] text-[#ff4444]/50 hover:text-[#ff4444] font-mono transition-colors"
              >
                Eliminar
              </button>
            </div>
            <input
              type="text"
              placeholder="Titulo"
              value={feature.title}
              onChange={(e) => updateFeature(i, "title", e.target.value)}
              className={inputClass}
            />
            <textarea
              placeholder="Descripcion"
              value={feature.description}
              onChange={(e) => updateFeature(i, "description", e.target.value)}
              rows={3}
              className={inputClass + " resize-y"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoEditor({
  data,
  onChange,
}: {
  data: SiteSettings["info"];
  onChange: (d: SiteSettings["info"]) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Titulo</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Descripcion</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={5}
          className={inputClass + " resize-y"}
        />
      </div>
    </div>
  );
}

function ChannelsEditor({
  data,
  onChange,
}: {
  data: SiteSettings["channels"];
  onChange: (d: SiteSettings["channels"]) => void;
}) {
  function updateLink(index: number, field: string, value: string) {
    const links = [...data.links];
    links[index] = { ...links[index], [field]: value };
    onChange({ ...data, links });
  }

  function addLink() {
    onChange({
      ...data,
      links: [...data.links, { name: "", url: "", platform: "other" }],
    });
  }

  function removeLink(index: number) {
    onChange({
      ...data,
      links: data.links.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Titulo</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Descripcion</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={3}
          className={inputClass + " resize-y"}
        />
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80 font-mono">Enlaces</h3>
        <button type="button" onClick={addLink} className="text-[10px] text-[#00ffcc]/50 hover:text-[#00ffcc] font-mono transition-colors">
          + Agregar
        </button>
      </div>
      {data.links.map((link, i) => (
        <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/25 font-mono">Canal {i + 1}</span>
            <button type="button" onClick={() => removeLink(i)} className="text-[10px] text-[#ff4444]/50 hover:text-[#ff4444] font-mono transition-colors">
              Eliminar
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="text" placeholder="Nombre" value={link.name} onChange={(e) => updateLink(i, "name", e.target.value)} className={inputClass} />
            <input type="url" placeholder="URL" value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} className={inputClass} />
            <select value={link.platform} onChange={(e) => updateLink(i, "platform", e.target.value)} className={inputClass}>
              <option value="telegram">Telegram</option>
              <option value="discord">Discord</option>
              <option value="session">Session</option>
              <option value="other">Otro</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportEditor({
  data,
  onChange,
}: {
  data: SiteSettings["report"];
  onChange: (d: SiteSettings["report"]) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Titulo</label>
        <input type="text" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Descripcion</label>
        <textarea value={data.description} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={3} className={inputClass + " resize-y"} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Texto del boton</label>
          <input type="text" value={data.buttonText} onChange={(e) => onChange({ ...data, buttonText: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>URL del boton</label>
          <input type="url" value={data.buttonUrl} onChange={(e) => onChange({ ...data, buttonUrl: e.target.value })} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Subtitulo</label>
        <input type="text" value={data.subtitle} onChange={(e) => onChange({ ...data, subtitle: e.target.value })} className={inputClass} />
      </div>
    </div>
  );
}

function RdpVpsEditor({
  data,
  onChange,
}: {
  data: SiteSettings["rdpvps"];
  onChange: (d: SiteSettings["rdpvps"]) => void;
}) {
  function updateLink(index: number, field: string, value: string) {
    const links = [...data.links];
    links[index] = { ...links[index], [field]: value };
    onChange({ ...data, links });
  }

  function addLink() {
    onChange({
      ...data,
      links: [...data.links, { name: "", url: "", icon: "server" }],
    });
  }

  function removeLink(index: number) {
    onChange({
      ...data,
      links: data.links.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Titulo</label>
        <input type="text" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Descripcion</label>
        <textarea value={data.description} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={3} className={inputClass + " resize-y"} />
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80 font-mono">Enlaces</h3>
        <button type="button" onClick={addLink} className="text-[10px] text-[#00ffcc]/50 hover:text-[#00ffcc] font-mono transition-colors">+ Agregar</button>
      </div>
      {data.links.map((link, i) => (
        <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/25 font-mono">Servicio {i + 1}</span>
            <button type="button" onClick={() => removeLink(i)} className="text-[10px] text-[#ff4444]/50 hover:text-[#ff4444] font-mono transition-colors">Eliminar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="text" placeholder="Nombre" value={link.name} onChange={(e) => updateLink(i, "name", e.target.value)} className={inputClass} />
            <input type="url" placeholder="URL" value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} className={inputClass} />
            <select value={link.icon} onChange={(e) => updateLink(i, "icon", e.target.value)} className={inputClass}>
              <option value="server">Servidor</option>
              <option value="terminal">Terminal</option>
              <option value="smartphone">Smartphone</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsEditor({
  data,
  onChange,
}: {
  data: SiteSettings["stats"];
  onChange: (d: SiteSettings["stats"]) => void;
}) {
  function updateItem(index: number, field: string, value: string | number) {
    const items = [...data.items];
    items[index] = { ...items[index], [field]: value };
    onChange({ ...data, items });
  }

  function addItem() {
    onChange({
      ...data,
      items: [...data.items, { label: "", value: 0 }],
    });
  }

  function removeItem(index: number) {
    onChange({
      ...data,
      items: data.items.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80 font-mono">Estadisticas</h3>
        <button type="button" onClick={addItem} className="text-[10px] text-[#00ffcc]/50 hover:text-[#00ffcc] font-mono transition-colors">+ Agregar</button>
      </div>
      {data.items.map((item, i) => (
        <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/25 font-mono">Estadistica {i + 1}</span>
            <button type="button" onClick={() => removeItem(i)} className="text-[10px] text-[#ff4444]/50 hover:text-[#ff4444] font-mono transition-colors">Eliminar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Etiqueta" value={item.label} onChange={(e) => updateItem(i, "label", e.target.value)} className={inputClass} />
            <input type="number" placeholder="Valor" value={item.value} onChange={(e) => updateItem(i, "value", parseInt(e.target.value) || 0)} className={inputClass} />
          </div>
        </div>
      ))}
    </div>
  );
}

function GalleryEditor({
  data,
  onChange,
}: {
  data: SiteSettings["gallery"];
  onChange: (d: SiteSettings["gallery"]) => void;
}) {
  function updateImage(index: number, field: string, value: string) {
    const images = [...data.images];
    images[index] = { ...images[index], [field]: value };
    onChange({ ...data, images });
  }

  function addImage() {
    onChange({
      ...data,
      images: [...data.images, { url: "", alt: "" }],
    });
  }

  function removeImage(index: number) {
    onChange({
      ...data,
      images: data.images.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Titulo</label>
        <input type="text" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} className={inputClass} />
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80 font-mono">Imagenes</h3>
        <button type="button" onClick={addImage} className="text-[10px] text-[#00ffcc]/50 hover:text-[#00ffcc] font-mono transition-colors">+ Agregar</button>
      </div>
      {data.images.map((img, i) => (
        <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/25 font-mono">Imagen {i + 1}</span>
            <button type="button" onClick={() => removeImage(i)} className="text-[10px] text-[#ff4444]/50 hover:text-[#ff4444] font-mono transition-colors">Eliminar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="url" placeholder="URL de la imagen" value={img.url} onChange={(e) => updateImage(i, "url", e.target.value)} className={inputClass} />
            <input type="text" placeholder="Texto alternativo" value={img.alt} onChange={(e) => updateImage(i, "alt", e.target.value)} className={inputClass} />
          </div>
          {img.url && (
            <img src={img.url} alt={img.alt} className="w-20 h-14 rounded-lg object-cover border border-border" />
          )}
        </div>
      ))}
    </div>
  );
}

function DownloadsEditor({
  data,
  onChange,
}: {
  data: SiteSettings["downloads"];
  onChange: (d: SiteSettings["downloads"]) => void;
}) {
  function updateFile(index: number, field: string, value: string) {
    const files = [...data.files];
    files[index] = { ...files[index], [field]: value };
    onChange({ ...data, files });
  }

  function addFile() {
    onChange({
      ...data,
      files: [...data.files, { name: "", description: "", url: "", type: "" }],
    });
  }

  function removeFile(index: number) {
    onChange({
      ...data,
      files: data.files.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Titulo</label>
        <input type="text" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Descripcion</label>
        <textarea value={data.description} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={2} className={inputClass + " resize-y"} />
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80 font-mono">Archivos de descarga</h3>
        <button type="button" onClick={addFile} className="text-[10px] text-[#00ffcc]/50 hover:text-[#00ffcc] font-mono transition-colors">+ Agregar</button>
      </div>
      <p className="text-[10px] text-white/25 font-mono">
        Puedes subir archivos (APK, ZIP, etc.) desde la seccion &quot;Archivos&quot; del menu y luego pegar aqui la URL del archivo subido.
      </p>
      {data.files.map((file, i) => (
        <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/25 font-mono">Archivo {i + 1}</span>
            <button type="button" onClick={() => removeFile(i)} className="text-[10px] text-[#ff4444]/50 hover:text-[#ff4444] font-mono transition-colors">Eliminar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Nombre del archivo" value={file.name} onChange={(e) => updateFile(i, "name", e.target.value)} className={inputClass} />
            <input type="text" placeholder="Tipo (APK, ZIP, PDF...)" value={file.type} onChange={(e) => updateFile(i, "type", e.target.value)} className={inputClass} />
          </div>
          <input type="text" placeholder="Descripcion breve" value={file.description} onChange={(e) => updateFile(i, "description", e.target.value)} className={inputClass} />
          <input type="url" placeholder="URL de descarga" value={file.url} onChange={(e) => updateFile(i, "url", e.target.value)} className={inputClass} />
        </div>
      ))}
    </div>
  );
}
