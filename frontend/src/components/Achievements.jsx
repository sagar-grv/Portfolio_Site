import React from "react";
import { certifications, achievements } from "../data/mock";
import { Award, Trophy } from "lucide-react";

const Achievements = () => {
  return (
    <section
      id="achievements"
      className="section border-t border-[var(--border)]"
    >
      <div className="container-x">
        <div className="mb-12">
          <div className="section-eyebrow">
            <span className="w-6 h-px bg-[var(--accent)]" /> 05 / Wins
          </div>
          <h2 className="section-title">
            Certifications &amp; little victories along the way.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Certifications */}
          <div className="card p-6 md:p-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)]">
                <Award size={16} />
              </span>
              <h3 className="font-display text-lg text-[var(--text)]">
                Certifications
              </h3>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {certifications.map((c, i) => (
                <li
                  key={i}
                  className="py-3 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="text-[var(--text)]">{c.name}</div>
                    <div className="text-xs text-[var(--text-dim)] mt-0.5">
                      {c.issuer}
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[var(--text-dim)] whitespace-nowrap pt-0.5">
                    {c.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Achievements */}
          <div className="card p-6 md:p-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)]">
                <Trophy size={16} />
              </span>
              <h3 className="font-display text-lg text-[var(--text)]">
                Highlights
              </h3>
            </div>
            <ul className="space-y-3">
              {achievements.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-[var(--text-muted)]"
                >
                  <span className="mt-1 font-mono text-[10px] text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
