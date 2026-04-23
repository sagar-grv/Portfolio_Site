import React from "react";
import {
  ArrowDown,
  Github,
  Linkedin,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import { profile, heroTerminal } from "../data/mock";
import NeuralBackground from "./NeuralBackground";
import LiveMetrics from "./LiveMetrics";

const Hero = () => {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28 spotlight noise"
    >
      {/* Animated neural network */}
      <div className="absolute inset-0">
        <NeuralBackground />
      </div>
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-[var(--accent-soft)] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />

      <div className="container-x relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-elev)]/70 backdrop-blur text-xs font-mono text-[var(--text-muted)]">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-[var(--accent)] opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-[var(--accent)]" />
              </span>
              {profile.availability}
            </div>

            <h1 className="font-display font-semibold mt-6 text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.02em]">
              Hi, I&apos;m{" "}
              <span className="relative inline-block">
                <span className="text-[var(--accent)]">Sagar</span>
                <span className="absolute -right-3 top-0 text-[var(--accent)] caret-bar" />
              </span>
              .
              <br />
              <span className="text-[var(--text-muted)]">I build </span>
              <span className="text-[var(--text)]">AI that ships.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[var(--text-muted)] text-base md:text-lg leading-relaxed">
              {profile.summary}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#projects" className="btn-primary">
                <Sparkles size={16} /> View my work
              </a>
              <a href="#contact" className="btn-ghost">
                Get in touch
                <ArrowDown size={16} className="rotate-[-90deg]" />
              </a>
              <span className="hidden md:inline-flex items-center gap-1.5 ml-2 text-xs font-mono text-[var(--text-dim)]">
                <Zap size={12} className="text-[var(--accent)]" />
                Ask my AI anything
                <span className="ml-1">↘</span>
              </span>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-[var(--accent)]" />{" "}
                {profile.location}
              </span>
              <span className="hidden md:inline w-px h-4 bg-[var(--border-strong)]" />
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-[var(--accent)] transition"
              >
                <Github size={14} /> github.com/{profile.handle}
              </a>
              <span className="hidden md:inline w-px h-4 bg-[var(--border-strong)]" />
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-[var(--accent)] transition"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
            </div>

            <div className="mt-10 max-w-xl">
              <LiveMetrics />
            </div>
          </div>

          <div
            className="lg:col-span-5 fade-up"
            style={{ animationDelay: "120ms" }}
          >
            <div className="card overflow-hidden shadow-[0_10px_60px_-20px_rgba(0,0,0,0.6)] relative">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-elev)]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <div className="font-mono text-[11px] text-[var(--text-dim)]">
                  {heroTerminal.title}
                </div>
                <div className="w-10" />
              </div>
              <div className="p-5 font-mono text-[13px] leading-[1.85]">
                {heroTerminal.lines.map((l, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-[var(--text-dim)] select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={
                        l.t === "comment"
                          ? "text-[var(--text-dim)] italic"
                          : "text-[var(--text)]"
                      }
                    >
                      {l.t === "code" ? (
                        <code
                          dangerouslySetInnerHTML={{
                            __html: highlight(l.v),
                          }}
                        />
                      ) : (
                        l.v
                      )}
                      {i === heroTerminal.lines.length - 1 && (
                        <span className="caret" />
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Model/data badges to emphasise AI/ML */}
              <div className="px-4 pb-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-3 bg-[var(--bg-elev)]/50">
                {[
                  "PyTorch",
                  "Gemini",
                  "TensorFlow",
                  "OpenCV",
                  "LangChain",
                ].map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--text-dim)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs font-mono text-[var(--text-dim)] text-center lg:text-right">
              <span className="text-[var(--accent)]">#</span> currently building:
              a real-time person re-ID web app
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Token-based syntax highlighter for the terminal (prevents regex cascade issues)
function highlight(src) {
  const esc = src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const parts = [];
  let i = 0;
  while (i < esc.length) {
    const ch = esc[i];
    if (ch === '"') {
      const end = esc.indexOf('"', i + 1);
      const stop = end === -1 ? esc.length : end + 1;
      parts.push({ t: "string", v: esc.slice(i, stop) });
      i = stop;
      continue;
    }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < esc.length && /[A-Za-z0-9_]/.test(esc[j])) j++;
      const word = esc.slice(i, j);
      parts.push({
        t: word === "engineer" || word === "run" ? "kw" : "text",
        v: word,
      });
      i = j;
      continue;
    }
    if (/[{}\[\],:]/.test(ch)) {
      parts.push({ t: "punc", v: ch });
      i++;
      continue;
    }
    parts.push({ t: "text", v: ch });
    i++;
  }
  return parts
    .map((p) => {
      if (p.t === "string") return `<span style="color:#a3e635">${p.v}</span>`;
      if (p.t === "kw") return `<span style="color:#f5f5f7">${p.v}</span>`;
      if (p.t === "punc") return `<span style="color:#71717a">${p.v}</span>`;
      return p.v;
    })
    .join("");
}

export default Hero;
