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

function ImageGallery({ images }: { images: ContentFile[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div
        className={`grid gap-2 mt-4 ${
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
            className={`relative overflow-hidden rounded-lg border border-border hover:border-primary/40 transition-colors group ${
              images.length === 1 ? "max-h-96" : images.length > 2 && i === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <img
              src={img.path}
              alt={img.originalName}
              className="w-full h-full object-cover aspect-video group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <svg className="w-8 h-8 text-foreground opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-foreground/70 hover:text-foreground p-2"
            onClick={() => setSelected(null)}
            aria-label="Cerrar"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

function AudioPlayer({ file }: { file: ContentFile }) {
  return (
    <div className="flex items-center gap-3 bg-accent/50 border border-border rounded-lg p-3 mt-2">
      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{file.originalName}</p>
        <audio controls className="w-full mt-1 h-8" preload="metadata">
          <source src={file.path} type={file.mimeType} />
        </audio>
      </div>
    </div>
  );
}

function VideoPlayer({ file }: { file: ContentFile }) {
  return (
    <div className="mt-3 rounded-lg overflow-hidden border border-border">
      <video
        controls
        className="w-full max-h-96"
        preload="metadata"
        playsInline
      >
        <source src={file.path} type={file.mimeType} />
      </video>
      <div className="bg-accent/50 px-3 py-2 text-xs text-muted-foreground truncate">
        {file.originalName}
      </div>
    </div>
  );
}

function FileDownload({ file }: { file: ContentFile }) {
  return (
    <a
      href={file.path}
      download={file.originalName}
      className="flex items-center gap-3 bg-accent/50 border border-border rounded-lg p-3 mt-2 hover:border-primary/30 hover:bg-accent transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
          {file.originalName}
        </p>
        <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
      </div>
      <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </a>
  );
}

export default function ContentCard({ post }: { post: ContentPost }) {
  const images = post.files.filter((f) => f.type === "image");
  const audios = post.files.filter((f) => f.type === "audio");
  const videos = post.files.filter((f) => f.type === "video");
  const others = post.files.filter(
    (f) => f.type !== "image" && f.type !== "audio" && f.type !== "video"
  );

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/20 transition-colors animate-fade-in">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {post.author.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground text-sm">
                {post.author}
              </span>
              {post.pinned && (
                <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full border border-warning/20">
                  Fijado
                </span>
              )}
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                {post.category}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-foreground mb-3 text-balance">
          {post.title}
        </h2>

        {/* Description */}
        <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
          {post.description}
        </div>

        {/* Images */}
        <ImageGallery images={images} />

        {/* Videos */}
        {videos.map((video) => (
          <VideoPlayer key={video.id} file={video} />
        ))}

        {/* Audio */}
        {audios.map((audio) => (
          <AudioPlayer key={audio.id} file={audio} />
        ))}

        {/* Documents & other files */}
        {others.map((file) => (
          <FileDownload key={file.id} file={file} />
        ))}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-accent text-muted-foreground px-2.5 py-1 rounded-full"
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
