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
  if (name.endsWith(".zip") || name.endsWith(".rar") || name.endsWith(".7z") || name.endsWith(".tar") || name.endsWith(".gz")) return "ZIP";
  if (type === "image") return "IMG";
  if (type === "audio") return "AUD";
  if (type === "video") return "VID";
  if (type === "document") return "DOC";
  return "BIN";
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
      <div className="max-w-6xl mx-auto">
        {toast && (
          <div className="fixed top-4 right-4 z-50 bg-[#00ffcc]/8 border border-[#00ffcc]/20 text-[#00ffcc] px-5 py-3 rounded-lg text-xs font-mono font-medium animate-notification backdrop-blur-sm">
            {"[OK] "}{toast}
          </div>
        )}

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`cyber-border rounded-xl p-10 text-center cursor-pointer transition-all mb-6 relative overflow-hidden ${
            dragOver
              ? "border-[#00ffcc]/30 bg-[#00ffcc]/[0.03]"
              : "hover:border-[#00ffcc]/20 hover:bg-white/[0.015]"
          } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ffcc]/20 to-transparent" />
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
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border border-[#00ffcc]/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-[#00ffcc] border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-sm text-[#00ffcc]/70 font-mono">Subiendo archivos...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-[#00ffcc]/[0.05] border border-[#00ffcc]/15 flex items-center justify-center text-[#00ffcc]/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-white/60 font-medium text-sm">Arrastra archivos o haz clic para seleccionar</p>
                <p className="text-[11px] text-white/20 mt-1 font-mono">
                  APK, ZIP, RAR, ISO, IMG, AUD, VID, DOC, BIN...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Uploaded files */}
        {files.length > 0 && (
          <div className="admin-glass cyber-border rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#00ffcc]/8 flex items-center gap-2.5">
              <div className="w-1.5 h-4 rounded-full bg-[#00ffcc]/30" />
              <h2 className="font-semibold text-white/80 text-sm">
                Archivos subidos
              </h2>
              <span className="text-[10px] text-white/20 font-mono ml-auto">
                {files.length} archivo{files.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:bg-[#00ffcc]/[0.015] transition-colors group"
                >
                  {file.type === "image" ? (
                    <img
                      src={file.path}
                      alt={file.originalName}
                      className="w-11 h-11 rounded-lg object-cover border border-white/[0.06] shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-[#00ffcc]/[0.05] border border-[#00ffcc]/12 flex items-center justify-center text-[#00ffcc]/40 shrink-0 font-mono text-[10px] font-bold">
                      {getFileTypeLabel(file.type, file.mimeType, file.originalName)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/70 truncate">{file.originalName}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-white/20 font-mono">{formatSize(file.size)}</span>
                      <span className="text-[10px] text-white/10 font-mono truncate">{file.path}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyUrl(file.path)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-medium transition-all ${
                        copied === file.path
                          ? "bg-[#00ffcc]/8 text-[#00ffcc] border border-[#00ffcc]/20"
                          : "bg-white/[0.03] text-white/30 hover:text-white/60 border border-white/[0.06]"
                      }`}
                    >
                      {copied === file.path ? (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          copiado
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          copiar_url
                        </>
                      )}
                    </button>
                    <a
                      href={file.path}
                      download={file.originalName}
                      className="p-1.5 rounded-lg text-white/20 hover:text-[#00ffcc]/60 hover:bg-[#00ffcc]/[0.05] transition-all"
                      title="Descargar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1.5 rounded-lg text-white/20 hover:text-[#ff4444] hover:bg-[#ff4444]/[0.05] transition-all opacity-0 group-hover:opacity-100"
                      title="Quitar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
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
