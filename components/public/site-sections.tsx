"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteSettings } from "@/lib/storage";

function TelegramIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.894 7.221l-1.97 9.28c-.145.658-.537.818-1.084.509l-3-2.21-1.446 1.394c-.159.159-.295.295-.604.295l.213-3.053 5.56-5.022c.242-.213-.054-.333-.373-.121l-6.869 4.326-2.962-.924c-.643-.203-.658-.643.135-.954l11.566-4.458c.538-.196 1.006.128.832.954z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.872-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.125-.094.25-.188.372-.284a.076.076 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.076.076 0 0 1 .078.01c.12.096.245.19.37.284a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.77 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function SmartphoneIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function getPlatformIcon(platform: string) {
  switch (platform) {
    case "telegram":
      return <TelegramIcon />;
    case "discord":
      return <DiscordIcon />;
    default:
      return <LinkIcon />;
  }
}

function getRdpIcon(icon: string) {
  switch (icon) {
    case "server":
      return <ServerIcon />;
    case "terminal":
      return <TerminalIcon />;
    case "smartphone":
      return <SmartphoneIcon />;
    default:
      return <ServerIcon />;
  }
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const increment = Math.ceil(target / 60);
          const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(current);
            }
          }, 30);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-primary">
      {count}
    </div>
  );
}

export function AboutSection({ data }: { data: SiteSettings["about"] }) {
  return (
    <section id="about" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center text-balance">
          {data.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.features.map((feature, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InfoSection({ data }: { data: SiteSettings["info"] }) {
  return (
    <section id="info" className="py-12 md:py-16 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">
          {data.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed text-pretty">
          {data.description}
        </p>
      </div>
    </section>
  );
}

export function ChannelsSection({ data }: { data: SiteSettings["channels"] }) {
  return (
    <section id="channels" className="py-12 md:py-16 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
          {data.title}
        </h2>
        <p className="text-muted-foreground mb-8 text-pretty leading-relaxed">
          {data.description}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {data.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-card border border-border px-6 py-3 rounded-xl text-foreground font-medium hover:border-primary hover:text-primary transition-colors"
            >
              {getPlatformIcon(link.platform)}
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReportSection({ data }: { data: SiteSettings["report"] }) {
  return (
    <section id="report" className="py-12 md:py-16 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
          {data.title}
        </h2>
        <p className="text-muted-foreground mb-8 text-pretty leading-relaxed">
          {data.description}
        </p>
        <a
          href={data.buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
          style={{ boxShadow: "0 0 20px rgba(0,255,204,0.25)" }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {data.buttonText}
        </a>
        <p className="text-muted-foreground text-sm mt-4">{data.subtitle}</p>
      </div>
    </section>
  );
}

export function RdpVpsSection({ data }: { data: SiteSettings["rdpvps"] }) {
  return (
    <section id="rdpvps" className="py-12 md:py-16 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
          {data.title}
        </h2>
        <p className="text-muted-foreground mb-8 text-pretty leading-relaxed">
          {data.description}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {data.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-card border border-border px-6 py-3 rounded-xl text-foreground font-medium hover:border-primary hover:text-primary transition-colors"
            >
              {getRdpIcon(link.icon)}
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsSection({ data }: { data: SiteSettings["stats"] }) {
  return (
    <section id="stats" className="py-12 md:py-16 border-t border-border">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {data.items.map((stat, i) => (
            <div key={i} className="text-center">
              <AnimatedCounter target={stat.value} />
              <p className="text-muted-foreground text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GallerySection({ data }: { data: SiteSettings["gallery"] }) {
  if (data.images.length === 0) return null;

  return (
    <section className="py-12 md:py-16 border-t border-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center text-balance">
          {data.title}
        </h2>
        <div className="relative overflow-hidden">
          <div className="flex gap-4 animate-scroll">
            {[...data.images, ...data.images].map((img, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 md:w-72 h-40 md:h-48 rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-colors"
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DownloadsSection({ data }: { data: SiteSettings["downloads"] }) {
  if (!data.files || data.files.length === 0) return null;

  return (
    <section id="downloads" className="py-12 md:py-16 border-t border-border">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center text-balance">
          {data.title}
        </h2>
        <p className="text-muted-foreground text-center mb-8 text-pretty">
          {data.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.files.map((file, i) => (
            <a
              key={i}
              href={file.url}
              download
              className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                <DownloadIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {file.description} {file.type ? `- ${file.type.toUpperCase()}` : ""}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
