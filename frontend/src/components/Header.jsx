import React, { useEffect, useState } from "react";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/mock";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-[var(--bg)]/75 border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between py-4">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--accent)] text-[#0a0a0b] font-bold font-mono text-sm">
            SG
          </span>
          <span className="font-display font-medium text-[var(--text)]">
            {profile.name}
            <span className="text-[var(--text-dim)] font-mono text-xs ml-2">
              /{profile.handle}
            </span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors link-underline"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-white/5 transition"
          >
            <Github size={18} />
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-white/5 transition"
          >
            <Linkedin size={18} />
          </a>
          <a href="#contact" className="btn-primary text-sm py-2">
            <Mail size={16} />
            Let&apos;s talk
          </a>
        </div>

        <button
          className="md:hidden p-2 text-[var(--text)]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur">
          <div className="container-x py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-[var(--text-muted)] hover:text-[var(--accent)]"
              >
                {item.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="btn-primary w-max mt-1">
              <Mail size={16} /> Let&apos;s talk
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
