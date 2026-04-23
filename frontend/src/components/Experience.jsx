import React from "react";
import { experience } from "../data/mock";
import { Briefcase, Circle } from "lucide-react";

const Experience = () => {
  return (
    <section id="experience" className="section border-t border-[var(--border)]">
      <div className="container-x">
        <div className="mb-12">
          <div className="section-eyebrow">
            <span className="w-6 h-px bg-[var(--accent)]" /> 04 / Experience
          </div>
          <h2 className="section-title">
            Where I&apos;ve been building, teaching and shipping.
          </h2>
        </div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 md:left-6 top-2 bottom-2 w-px bg-[var(--border)]" />

          <div className="space-y-8">
            {experience.map((e, idx) => (
              <div key={idx} className="relative pl-12 md:pl-16">
                <div className="absolute left-2 md:left-4 top-1.5 w-5 h-5 rounded-full bg-[var(--bg)] border border-[var(--accent)] flex items-center justify-center">
                  <Circle
                    size={8}
                    fill="currentColor"
                    className="text-[var(--accent)]"
                  />
                </div>
                <div className="card p-6 md:p-7">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)]">
                        <Briefcase size={15} />
                      </span>
                      <div>
                        <h3 className="font-display text-lg text-[var(--text)]">
                          {e.role}
                        </h3>
                        <div className="text-sm text-[var(--text-dim)]">
                          {e.org}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono text-xs text-[var(--text-dim)] md:text-right">
                      {e.period}
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {e.points.map((pt, i) => (
                      <li
                        key={i}
                        className="text-sm text-[var(--text-muted)] leading-relaxed pl-4 relative"
                      >
                        <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
