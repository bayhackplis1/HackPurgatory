"use client";

import { useState, useRef } from "react";

interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  type: "image" | "audio" | "video" | "document" | "other";
  mimeType: string;
  size: number;
  path: string;
}

interface FileUploaderProps {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}

export default function FileUploader({ files, onChange }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
        onChange([...files, ...data.files]);
      }
    } catch (err) {
      console.error("Upload error:", err);
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

  function removeFile(fileId: string) {
    onChange(files.filter((f) => f.id !== fileId));
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  }

  function getFileLabel(type: string) {
    switch (type) {
      case "image": return "IMG";
      case "audio": return "AUD";
      case "video": return "VID";
      default: return "BIN";
    }
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-[#00ffcc]/30 bg-[#00ffcc]/[0.03]"
            : "border-white/[0.08] hover:border-[#00ffcc]/20 hover:bg-white/[0.015]"
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
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 border border-[#00ffcc]/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-[#00ffcc] border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-sm text-[#00ffcc]/60 font-mono">Subiendo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#00ffcc]/[0.05] border border-[#00ffcc]/12 flex items-center justify-center text-[#00ffcc]/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white/50">
                Arrastra archivos o haz clic
              </p>
              <p className="text-[11px] text-white/20 mt-1 font-mono">
                IMG, AUD, VID, DOC, APK, ZIP, ISO...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-lg p-3 group"
            >
              {file.type === "image" ? (
                <img
                  src={file.path}
                  alt={file.originalName}
                  className="w-10 h-10 rounded-lg object-cover border border-white/[0.06]"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#00ffcc]/[0.05] border border-[#00ffcc]/10 flex items-center justify-center text-[#00ffcc]/40 font-mono text-[10px] font-bold">
                  {getFileLabel(file.type)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/60 truncate">
                  {file.originalName}
                </p>
                <p className="text-[10px] text-white/20 font-mono">
                  {formatSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="p-1.5 rounded-lg text-white/15 hover:text-[#ff4444] hover:bg-[#ff4444]/[0.05] transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
