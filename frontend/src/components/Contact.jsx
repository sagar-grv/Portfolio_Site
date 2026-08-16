import React from "react";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/mock";

const Contact = () => (
  <section id="contact" className="contact-section">
    <div className="site-shell section-layout contact-layout">
      <div className="section-number">06</div>
      <div className="section-content contact-content">
        <div>
          <h2>Have a role, project or hard problem worth solving?</h2>
          <p>I&apos;m open to AI/ML internships, product engineering work and meaningful collaborations.</p>
        </div>
        <a href={profile.socials.email} className="button contact-button">
          Email Sagar <Mail size={18} />
        </a>
        <div className="contact-links">
          <a href={profile.socials.github} target="_blank" rel="noreferrer">
            <Github size={19} /> GitHub <ArrowUpRight size={15} />
          </a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={19} /> LinkedIn <ArrowUpRight size={15} />
          </a>
          <a href={profile.socials.email}>
            <Mail size={19} /> {profile.email}
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default Contact;
