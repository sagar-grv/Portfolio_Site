import React from "react";
import { ArrowUp } from "lucide-react";
import { profile } from "../data/mock";

const Footer = () => (
  <footer className="site-footer">
    <div className="site-shell footer-inner">
      <a href="#top" className="footer-brand" aria-label="Back to top">SG</a>
      <span>© {new Date().getFullYear()} {profile.name}</span>
      <span>{profile.role} · {profile.location}</span>
      <a href="#top" className="back-to-top">Back to top <ArrowUp size={15} /></a>
    </div>
  </footer>
);

export default Footer;
