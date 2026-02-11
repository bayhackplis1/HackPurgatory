import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HACK [PURGATORY] - Ciberseguridad y Educacion Libre",
  description:
    "HACK [PURGATORY] es una comunidad creada por RIP Network, libre, dedicada a la ciberseguridad, la educacion abierta y la lucha contra estafas y toxicidad en internet. Unete y aprende con nosotros.",
  icons: {
    icon: "https://hackpurgatory.org/data/logo.png",
    apple: "https://hackpurgatory.org/data/logo.png",
  },
  openGraph: {
    title: "HACK [PURGATORY]",
    description:
      "Comunidad libre dedicada a la ciberseguridad y la educacion abierta.",
    images: ["https://hackpurgatory.org/data/logo.png"],
    url: "https://hackpurgatory.org",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HACK [PURGATORY]",
    description:
      "Comunidad libre dedicada a la ciberseguridad y la educacion abierta.",
    images: ["https://hackpurgatory.org/data/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {/* Global video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0"
          style={{ transform: "scale(1.2)" }}
        >
          <source
            src="https://raw.githubusercontent.com/TheOrder403/hackpurgatory/refs/heads/main/data/fondo.webm"
            type="video/webm"
          />
        </video>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
