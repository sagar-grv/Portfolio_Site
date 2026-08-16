import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "../data/mock";

const navItems = [
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "About", href: "#about" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="site-header" data-scrolled={scrolled ? "true" : "false"}>
      <div className="site-shell header-inner">
        <a href="#top" className="brand-mark" aria-label="Sagar Gurav — home">
          SG
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href={profile.socials.email}>
          Contact
        </a>

        <button
          type="button"
          className="menu-button"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <nav className="mobile-nav site-shell" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href={profile.socials.email} onClick={() => setOpen(false)}>
            Contact
          </a>
        </nav>
      ) : null}
    </header>
  );
};

export default Header;
