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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
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
        className={`grid gap-1 mt-4 rounded-lg overflow-hidden ${
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
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3 mt-3 backdrop-blur-sm">
      <div className="w-9 h-9 rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/20 flex items-center justify-center text-[#00ffcc] shrink-0">
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
    <div className="mt-4 rounded-lg overflow-hidden border border-white/10 bg-black/30">
      <video controls className="w-full max-h-96" preload="metadata" playsInline>
        <source src={file.path} type={file.mimeType} />
      </video>
      <div className="px-3 py-2 flex items-center gap-2 bg-white/5">
        <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs text-white/40 truncate">{file.originalName}</span>
      </div>
    </div>
  );
}

/* File Download */
function FileDownload({ file }: { file: ContentFile }) {
  return (
    <a
      href={file.path}
      download={file.originalName}
      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3 mt-3 hover:border-[#00ffcc]/25 hover:bg-white/8 transition-all group backdrop-blur-sm"
    >
      <div className="w-9 h-9 rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/20 flex items-center justify-center text-[#00ffcc] shrink-0 group-hover:bg-[#00ffcc]/20 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate group-hover:text-[#00ffcc] transition-colors">
          {file.originalName}
        </p>
        <p className="text-xs text-white/40 mt-0.5">{formatSize(file.size)}</p>
      </div>
      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 shrink-0 group-hover:text-[#00ffcc] group-hover:bg-[#00ffcc]/10 transition-all">
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
    <article className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-white/20 hover:bg-black/50 transition-all duration-300 animate-fade-in">
      <div className="p-5 sm:p-6">
        {/* Author & meta */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/20 flex items-center justify-center text-[#00ffcc] font-bold text-sm shrink-0">
            {post.author.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white text-sm">
                {post.author}
              </span>
              <span className="text-white/20">{"/"}</span>
              <span className="text-xs text-white/40">
                {formatDate(post.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {post.pinned && (
                <span className="inline-flex items-center gap-1 text-[11px] bg-[#ffcc00]/10 text-[#ffcc00] px-2 py-0.5 rounded-md border border-[#ffcc00]/20 font-medium">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                  </svg>
                  Fijado
                </span>
              )}
              <span className="text-[11px] bg-[#00ffcc]/10 text-[#00ffcc] px-2.5 py-0.5 rounded-md border border-[#00ffcc]/20 font-semibold">
                {post.category}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2.5 text-balance leading-snug">
          {post.title}
        </h2>

        {/* Description */}
        <div className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
          {post.description}
        </div>

        {/* Media */}
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

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-white/5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] bg-white/5 text-white/50 px-2.5 py-1 rounded-md border border-white/8 hover:border-[#00ffcc]/20 hover:text-[#00ffcc]/70 transition-colors cursor-default font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
