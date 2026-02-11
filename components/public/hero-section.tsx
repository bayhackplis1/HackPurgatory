"use client";

import { useEffect, useState } from "react";

export default function HeroSection() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "HACK [PURGATORY]";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-20 md:py-32 text-center overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,204,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.4) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>
      <img
        src="https://hackpurgatory.org/data/logo.png"
        alt="HACK PURGATORY Logo"
        className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-primary mb-6"
        style={{ boxShadow: "0 0 40px rgba(0,255,204,0.25)" }}
      />
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-wider mb-4">
        {displayText}
        <span className="text-primary animate-pulse">|</span>
      </h1>
      <p className="text-muted-foreground text-base md:text-lg max-w-xl text-pretty leading-relaxed">
        Bienvenido a Nuestro Sitio Web Oficial
      </p>
    </section>
  );
}
