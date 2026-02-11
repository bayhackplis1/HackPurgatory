"use client";

import { useState, useRef } from "react";
import AdminShell from "@/components/admin/admin-shell";

interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  type: string;
  mimeType: string;
  size: number;
  path: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function getFileTypeLabel(type: string, mime: string, name: string) {
  if (name.endsWith(".apk")) return "APK";
  if (name.endsWith(".exe")) return "EXE";
  if (name.endsWith(".iso")) return "ISO";
  if (name.endsWith(".zip") || name.endsWith(".rar") || name.endsWith(".7z") || name.endsWith(".tar") || name.endsWith(".gz")) return "Archivo";
  if (type === "image") return "Imagen";
  if (type === "audio") return "Audio";
  if (type === "video") return "Video";
  if (type === "document") return "Documento";
  return "Otro";
}

export default function FilesPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleUpload(fileList: FileList) {
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append("files", fileList[i]);
    }
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.files) {
        setFiles((prev) => [...prev, ...data.files]);
        showToast(`${data.files.length} archivo(s) subidos correctamente`);
      }
    } catch {
      showToast("Error al subir archivos");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }

  function copyUrl(path: string) {
    const fullUrl = window.location.origin + path;
    navigator.clipboard.writeText(fullUrl);
    setCopied(path);
    setTimeout(() => setCopied(null), 2000);
  }

  function removeFile(fileId: string) {
    setFiles(files.filter((f) => f.id !== fileId));
  }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        {toast && (
          <div className="fixed top-4 right-4 z-50 bg-success/10 border border-success/30 text-success px-5 py-3 rounded-lg text-sm font-medium animate-notification backdrop-blur-sm">
            {toast}
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Gestor de Archivos</h1>
          <p className="text-muted-foreground text-sm">
            Sube archivos (APK, ZIP, imagenes, documentos, etc.) y copia las URLs para usarlas en descargas
          </p>
        </div>

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all mb-6 ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40 hover:bg-accent/50"
          } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleUpload(e.target.files);
            }}
            accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar,.7z,.tar,.gz,.apk,.exe,.msi,.dmg,.iso,.bin,.dat,.json,.xml,.csv,.xls,.xlsx,.ppt,.pptx,.jar,.py,.js,.sh,.bat"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-primary">Subiendo archivos...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-foreground font-medium">Arrastra archivos aqui o haz clic para seleccionar</p>
                <p className="text-sm text-muted-foreground mt-1">
                  APK, ZIP, RAR, ISO, imagenes, audio, video, documentos y mas
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Uploaded files */}
        {files.length > 0 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground text-sm">
                Archivos subidos ({files.length})
              </h2>
            </div>
            <div className="divide-y divide-border">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:bg-accent/30 transition-colors"
                >
                  {file.type === "image" ? (
                    <img
                      src={file.path}
                      alt={file.originalName}
                      className="w-12 h-12 rounded-lg object-cover border border-border shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.originalName}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground">{formatSize(file.size)}</span>
                      <span className="text-xs bg-accent text-muted-foreground px-2 py-0.5 rounded-full">
                        {getFileTypeLabel(file.type, file.mimeType, file.originalName)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 font-mono truncate">{file.path}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyUrl(file.path)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        copied === file.path
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-accent text-muted-foreground hover:text-foreground border border-border"
                      }`}
                    >
                      {copied === file.path ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copiado
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          Copiar URL
                        </>
                      )}
                    </button>
                    <a
                      href={file.path}
                      download={file.originalName}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      title="Descargar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Quitar de la lista"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
