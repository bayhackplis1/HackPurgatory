"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const lines = [
      "$ ssh admin@hackpurgatory.local",
      "Connecting to HACK [PURGATORY] server...",
      "Encryption: AES-256-GCM",
      "Authentication required.",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setTerminalLines((prev) => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al iniciar sesion");
        return;
      }

      router.push("/admin");
    } catch {
      setError("Error de conexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="relative w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="relative inline-block">
            <img
              src="/data/logo.png"
              alt="HACK PURGATORY"
              className="w-20 h-20 mx-auto mb-5 rounded-xl border border-[#00ffcc]/20"
              style={{ boxShadow: "0 0 30px rgba(0,255,204,0.12)" }}
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00ffcc] border-3 border-[#0a0a0a]" style={{ boxShadow: "0 0 8px rgba(0,255,204,0.5)" }} />
          </div>
          <h1 className="text-xl font-bold text-white/90 tracking-wider font-mono">
            {"ADMIN TERMINAL"}
          </h1>
          <p className="text-white/25 text-xs mt-1.5 font-mono">
            {"HACK [PURGATORY] // Acceso restringido"}
          </p>
        </div>

        {/* Terminal output */}
        <div className="mb-4 px-4 py-3 rounded-lg bg-black/50 border border-[#00ffcc]/8 font-mono text-[11px] overflow-hidden animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {terminalLines.map((line, i) => (
            <div key={i} className={`${i === 0 ? "text-[#00ffcc]/60" : "text-white/25"} leading-relaxed`}>
              {line}
            </div>
          ))}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[#00ffcc]/40">{">"}</span>
            <span className="text-white/30">_</span>
            <span className="w-1.5 h-3.5 bg-[#00ffcc]/50 animate-terminal-blink" />
          </div>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleLogin}
          className="admin-glass cyber-border rounded-xl p-6 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-[10px] font-mono text-white/30 mb-2 uppercase tracking-wider"
            >
              {"// usuario"}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-white/80 placeholder-white/15 focus:outline-none focus:border-[#00ffcc]/25 focus:bg-white/[0.05] transition-all font-mono text-sm"
              placeholder="root"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-[10px] font-mono text-white/30 mb-2 uppercase tracking-wider"
            >
              {"// contrasena"}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-white/80 placeholder-white/15 focus:outline-none focus:border-[#00ffcc]/25 focus:bg-white/[0.05] transition-all font-mono text-sm"
              placeholder="********"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#ff4444]/[0.06] border border-[#ff4444]/15 rounded-lg text-[#ff4444]/80 text-xs text-center font-mono">
              {"[ERROR] "}{error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00ffcc]/10 border border-[#00ffcc]/25 text-[#00ffcc] font-mono font-bold py-3 rounded-lg hover:bg-[#00ffcc]/15 hover:border-[#00ffcc]/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            style={{
              boxShadow: loading ? "none" : "0 0 20px rgba(0,255,204,0.08)",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#00ffcc] border-t-transparent rounded-full animate-spin" />
                Autenticando...
              </span>
            ) : (
              "$ sudo login"
            )}
          </button>

          <div className="mt-5 text-center">
            <a
              href="/"
              className="text-white/20 text-xs font-mono hover:text-[#00ffcc]/50 transition-colors"
            >
              {"< volver_al_sitio"}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
