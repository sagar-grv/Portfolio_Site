import React from "react";
import { skills } from "../data/mock";
import { Cpu, Code2, BarChart3, Wrench } from "lucide-react";

const iconMap = {
  "Machine Learning": Cpu,
  Languages: Code2,
  "Data & Analytics": BarChart3,
  "Tools & Cloud": Wrench,
};

const Skills = () => {
  // Combine all skills for the marquee
  const allSkills = skills.flatMap((s) => s.items);

  return (
    <section id="skills" className="section border-t border-[var(--border)]">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="section-eyebrow">
              <span className="w-6 h-px bg-[var(--accent)]" /> 02 / Toolbelt
            </div>
            <h2 className="section-title">
              The stack I reach for when I want to ship.
            </h2>
          </div>
          <p className="text-[var(--text-muted)] max-w-md text-sm">
            A blend of modern ML frameworks, battle-tested data tools and the
            web stack to wrap it all in a delightful interface.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {skills.map((group) => {
            const Icon = iconMap[group.category] || Cpu;
            return (
              <div key={group.category} className="card p-6 md:p-7">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)]">
                    <Icon size={16} />
                  </span>
                  <h3 className="font-display text-lg text-[var(--text)]">
                    {group.category}
                  </h3>
                  <span className="ml-auto font-mono text-xs text-[var(--text-dim)]">
                    {group.items.length.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((it) => (
                    <span key={it} className="chip">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Marquee */}
        <div className="relative mt-14 overflow-hidden border-y border-[var(--border)] py-5">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent z-10 pointer-events-none" />
          <div className="flex gap-10 whitespace-nowrap marquee-track">
            {[...allSkills, ...allSkills].map((s, i) => (
              <span
                key={i}
                className="font-display text-lg md:text-xl text-[var(--text-dim)]"
              >
                {s} <span className="text-[var(--accent)] mx-4">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
