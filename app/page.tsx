"use client";

import { useEffect, useState } from "react";
import SiteNav from "@/components/public/site-nav";
import HeroSection from "@/components/public/hero-section";
import {
  AboutSection,
  InfoSection,
  ChannelsSection,
  ReportSection,
  RdpVpsSection,
  StatsSection,
  GallerySection,
  DownloadsSection,
} from "@/components/public/site-sections";
import type { SiteSettings } from "@/lib/storage";

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data.settings));
  }, []);

  if (!settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <HeroSection />
      <AboutSection data={settings.about} />
      <GallerySection data={settings.gallery} />
      <InfoSection data={settings.info} />
      <ChannelsSection data={settings.channels} />
      <RdpVpsSection data={settings.rdpvps} />
      <ReportSection data={settings.report} />
      <StatsSection data={settings.stats} />
      <DownloadsSection data={settings.downloads} />
      <footer className="border-t border-border py-8 text-center text-muted-foreground text-sm">
        <div className="max-w-6xl mx-auto px-4">
          {"HACK [PURGATORY] 2025. Todos los derechos reservados."}
        </div>
      </footer>
    </div>
  );
}
