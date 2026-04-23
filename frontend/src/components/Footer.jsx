import React from "react";
import { profile } from "../data/mock";
import { Github, Linkedin, Instagram, BookOpen, ArrowUp } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elev)]/40">
      <div className="container-x py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--accent)] text-[#0a0a0b] font-bold font-mono text-sm">
                SG
              </span>
              <div>
                <div className="font-display text-[var(--text)]">
                  {profile.name}
                </div>
                <div className="text-xs font-mono text-[var(--text-dim)]">
                  {profile.role} · {profile.location}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-white/5 transition"
            >
              <Github size={17} />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-white/5 transition"
            >
              <Linkedin size={17} />
            </a>
            <a
              href={profile.socials.medium}
              target="_blank"
              rel="noreferrer"
              aria-label="Medium"
              className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-white/5 transition"
            >
              <BookOpen size={17} />
            </a>
            <a
              href={profile.socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-white/5 transition"
            >
              <Instagram size={17} />
            </a>
            <a
              href="#top"
              className="ml-2 inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition"
            >
              Back to top <ArrowUp size={14} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-[var(--text-dim)] font-mono">
          <span>
            © {new Date().getFullYear()} {profile.name}. Built with React &amp;
            Tailwind.
          </span>
          <span>
            <span className="text-[var(--accent)]">&lt;</span>
            crafted with coffee and curiosity
            <span className="text-[var(--accent)]"> /&gt;</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
