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
        className={`grid gap-2 mt-5 ${
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
            className={`relative overflow-hidden rounded-xl border border-border/50 hover:border-primary/40 transition-all group ${
              images.length === 1 ? "max-h-96" : images.length > 2 && i === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <img
              src={img.path}
              alt={img.originalName}
              className="w-full h-full object-cover aspect-video group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/20 transition-colors"
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
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

function AudioPlayer({ file }: { file: ContentFile }) {
  return (
    <div className="flex items-center gap-3 bg-muted/50 border border-border/50 rounded-xl p-3.5 mt-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground font-medium truncate">{file.originalName}</p>
        <audio controls className="w-full mt-1.5 h-8" preload="metadata">
          <source src={file.path} type={file.mimeType} />
        </audio>
      </div>
    </div>
  );
}

function VideoPlayer({ file }: { file: ContentFile }) {
  return (
    <div className="mt-4 rounded-xl overflow-hidden border border-border/50">
      <video
        controls
        className="w-full max-h-96"
        preload="metadata"
        playsInline
      >
        <source src={file.path} type={file.mimeType} />
      </video>
      <div className="bg-muted/50 px-4 py-2.5 flex items-center gap-2">
        <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs text-muted-foreground truncate">{file.originalName}</span>
      </div>
    </div>
  );
}

function FileDownload({ file }: { file: ContentFile }) {
  return (
    <a
      href={file.path}
      download={file.originalName}
      className="flex items-center gap-3 bg-muted/50 border border-border/50 rounded-xl p-3.5 mt-3 hover:border-primary/30 hover:bg-primary/5 transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground font-medium truncate group-hover:text-primary transition-colors">
          {file.originalName}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{formatSize(file.size)}</p>
      </div>
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </div>
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
    <article className="bg-card/80 border border-border/50 rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-300 animate-fade-in backdrop-blur-sm">
      <div className="p-5 sm:p-6">
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
              <span className="text-muted-foreground/40">{"/"}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(post.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {post.pinned && (
                <span className="inline-flex items-center gap-1 text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full border border-warning/20">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                  </svg>
                  Fijado
                </span>
              )}
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20 font-medium">
                {post.category}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3 text-balance leading-snug">
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
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-border/40">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-muted/60 text-muted-foreground px-2.5 py-1 rounded-lg border border-border/30 hover:border-primary/30 hover:text-primary transition-colors cursor-default"
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
