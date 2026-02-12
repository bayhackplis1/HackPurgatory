"use client";

import { useState } from "react";

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

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

/* Image Gallery */
function ImageGallery({ images }: { images: ContentFile[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div
        className={`grid gap-1 rounded-lg overflow-hidden mb-6 ${
          images.length === 1
            ? "grid-cols-1"
            : images.length === 2
              ? "grid-cols-2"
              : "grid-cols-2 sm:grid-cols-3"
        }`}
      >
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setSelected(img.path)}
            className={`relative overflow-hidden group bg-black/30 ${
              images.length === 1
                ? "max-h-[400px]"
                : images.length > 2 && i === 0
                  ? "col-span-2 row-span-2"
                  : ""
            }`}
          >
            <img
              src={img.path}
              alt={img.originalName}
              className="w-full h-full object-cover aspect-video group-hover:scale-[1.03] transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            onClick={() => setSelected(null)}
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selected}
            alt="Vista ampliada"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

/* Audio Player */
function AudioPlayer({ file }: { file: ContentFile }) {
  return (
    <div className="flex items-center gap-3 bg-[#ff3333]/5 border border-[#ff3333]/20 rounded-lg p-3 mb-3 backdrop-blur-sm">
      <div className="w-9 h-9 rounded-lg bg-[#ff3333]/10 border border-[#ff3333]/20 flex items-center justify-center text-[#ff3333] shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white font-medium truncate mb-1">{file.originalName}</p>
        <audio controls className="w-full h-7" preload="metadata">
          <source src={file.path} type={file.mimeType} />
        </audio>
      </div>
    </div>
  );
}

/* Video Player */
function VideoPlayer({ file }: { file: ContentFile }) {
  return (
    <div className="rounded-lg overflow-hidden border-2 border-[#ff3333] bg-black mb-6" style={{ boxShadow: "0 4px 12px rgba(255,51,51,0.3)" }}>
      <video controls className="w-full max-h-[400px] object-contain bg-black" preload="metadata" playsInline>
        <source src={file.path} type={file.mimeType} />
      </video>
    </div>
  );
}

/* File Download */
function FileDownload({ file }: { file: ContentFile }) {
  return (
    <a
      href={file.path}
      download={file.originalName}
      className="flex items-center gap-3 bg-[#ff3333]/5 border border-[#ff3333]/20 rounded-lg p-3 mb-3 hover:border-[#ff3333]/40 hover:bg-[#ff3333]/10 transition-all group backdrop-blur-sm"
    >
      <div className="w-9 h-9 rounded-lg bg-[#ff3333]/10 border border-[#ff3333]/20 flex items-center justify-center text-[#ff3333] shrink-0 group-hover:bg-[#ff3333]/20 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate group-hover:text-[#ff3333] transition-colors">
          {file.originalName}
        </p>
        <p className="text-xs text-white/40 mt-0.5">{formatSize(file.size)}</p>
      </div>
      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 shrink-0 group-hover:text-[#ff3333] group-hover:bg-[#ff3333]/10 transition-all">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </div>
    </a>
  );
}

/* Main Card */
export default function ContentCard({ post }: { post: ContentPost }) {
  const images = post.files.filter((f) => f.type === "image");
  const audios = post.files.filter((f) => f.type === "audio");
  const videos = post.files.filter((f) => f.type === "video");
  const others = post.files.filter(
    (f) => f.type !== "image" && f.type !== "audio" && f.type !== "video"
  );

  return (
    <article className="bg-[#ff3333]/5 backdrop-blur-md border border-[#ff3333] rounded-xl overflow-hidden hover:bg-[#ff3333]/10 transition-all duration-300 animate-fade-in">
      <div className="p-6 sm:p-8 flex flex-col items-center text-center">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#ff3333] mb-6 uppercase text-balance leading-snug" style={{ textShadow: "1px 1px 5px rgba(0,0,0,0.5)" }}>
          {post.title}
        </h2>

        {/* Media - centered */}
        <div className="w-full max-w-[800px]">
          <ImageGallery images={images} />
          {videos.map((video) => (
            <VideoPlayer key={video.id} file={video} />
          ))}
          {audios.map((audio) => (
            <AudioPlayer key={audio.id} file={audio} />
          ))}
          {others.map((file) => (
            <FileDownload key={file.id} file={file} />
          ))}
        </div>

        {/* Description */}
        <div className="text-[#ddd] text-base leading-relaxed whitespace-pre-wrap max-w-[800px] mb-6">
          {post.description}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[#ff3333]/10 text-[#ff3333] px-3 py-1 rounded-md border border-[#ff3333]/30 hover:bg-[#ff3333]/20 transition-colors cursor-default font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Category footer */}
        <div className="w-full border-t border-[#ff3333] pt-4 text-[#ff3333] font-bold text-sm">
          {"Categoria: "}{post.category}
          {post.pinned && (
            <span className="inline-flex items-center gap-1 ml-3 text-[#ffcc00]">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
              Fijado
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
