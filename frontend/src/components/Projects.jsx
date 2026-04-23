import React from "react";
import { projects } from "../data/mock";
import { ArrowUpRight, Github, CheckCircle2 } from "lucide-react";

const accentColor = {
  lime: "#a3e635",
  amber: "#fbbf24",
  cyan: "#67e8f9",
  rose: "#fda4af",
};

const Projects = () => {
  return (
    <section id="projects" className="section border-t border-[var(--border)]">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="section-eyebrow">
              <span className="w-6 h-px bg-[var(--accent)]" /> 03 / Selected Work
            </div>
            <h2 className="section-title">
              Projects that pushed me from tutorial to production.
            </h2>
          </div>
          <a
            href="https://github.com/sagar-grv"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost text-sm"
          >
            <Github size={16} /> All repos
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, idx) => {
            const color = accentColor[p.accent] || accentColor.lime;
            return (
              <article
                key={p.id}
                className="card card-lift group p-6 md:p-7 relative overflow-hidden"
              >
                <div
                  className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-25 group-hover:opacity-40 transition-opacity"
                  style={{ background: color }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-xs tracking-widest text-[var(--text-dim)] uppercase">
                        {String(idx + 1).padStart(2, "0")} &middot; {p.kind}
                      </div>
                      <h3 className="mt-2 font-display text-xl md:text-2xl text-[var(--text)] leading-tight">
                        {p.title}
                      </h3>
                    </div>
                    <span
                      className="shrink-0 text-xs font-mono px-2 py-1 rounded-md border border-[var(--border)] text-[var(--text-dim)]"
                    >
                      {p.period}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed">
                    {p.description}
                  </p>

                  <ul className="mt-5 grid sm:grid-cols-3 gap-2">
                    {p.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2 text-xs text-[var(--text-muted)]"
                      >
                        <CheckCircle2
                          size={14}
                          style={{ color }}
                          className="mt-0.5 shrink-0"
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-4 pt-5 border-t border-[var(--border)]">
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition"
                    >
                      <Github size={15} /> Code
                    </a>
                    <a
                      href={p.demo}
                      className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition"
                    >
                      <ArrowUpRight size={15} /> Case study
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
