import React from "react";
import { profile, stats, education } from "../data/mock";
import { GraduationCap, Radio } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="section">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="section-eyebrow">
              <span className="w-6 h-px bg-[var(--accent)]" /> 01 / About
            </div>
            <h2 className="section-title">
              An engineer who enjoys turning messy data into useful products.
            </h2>

            {/* 'Now training' card */}
            <div className="mt-8 card p-5 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px shimmer" />
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-dim)] uppercase tracking-widest">
                <Radio size={13} className="text-[var(--accent)] animate-pulse" />
                Now training
              </div>
              <div className="mt-2 font-display text-[var(--text)]">
                Person Re-ID &mdash; epoch 47 / 80
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-[var(--bg-elev)] overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full"
                  style={{ width: "59%" }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-[var(--text-dim)]">
                <span>val/acc 0.871</span>
                <span>ETA 08:42</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 text-[var(--text-muted)] leading-relaxed">
            <p>
              I&apos;m a B.Tech AI &amp; Machine Learning undergraduate at NMIMS
              MPSTME who likes living at the intersection of research and
              shipping. Whether it&apos;s a CNN detecting deepfakes, a multi-agent
              banking assistant, or a Shopify storefront that actually loads
              fast &mdash; I care about the outcome as much as the model.
            </p>
            <p>
              Outside of building, I coordinate the Google Student Ambassador
              program on campus, mentor juniors on Cloud &amp; AI, and run
              hackathon sprint sessions. I write about what I learn on Medium
              and ship weekend projects on GitHub.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="card p-4 hover:-translate-y-0.5"
                >
                  <div className="font-display text-2xl md:text-3xl text-[var(--accent)]">
                    {s.value}
                  </div>
                  <div className="text-xs text-[var(--text-dim)] mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <div className="text-sm font-mono text-[var(--text-dim)] flex items-center gap-2 mb-4">
                <GraduationCap size={14} className="text-[var(--accent)]" />
                Education
              </div>
              <ol className="space-y-3">
                {education.map((e, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 border-b border-dashed border-[var(--border)] pb-3"
                  >
                    <div>
                      <div className="text-[var(--text)]">{e.degree}</div>
                      <div className="text-sm text-[var(--text-dim)]">
                        {e.school} · {e.detail}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-[var(--text-dim)] whitespace-nowrap">
                      {e.period}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-4 text-sm">
              <span className="text-[var(--text-dim)]">Email &mdash; </span>
              <a
                href={profile.socials.email}
                className="text-[var(--text)] link-underline"
              >
                {profile.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
