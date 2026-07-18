import React from "react";
import { ArrowUpRight } from "lucide-react";
import { certifications, highlights, profile } from "../data/mock";

const About = () => (
  <section id="about" className="section-block about-section">
    <div className="site-shell section-layout">
      <div className="section-number">05</div>
      <div className="section-content">
        <div className="section-heading-row compact-heading">
          <div>
            <h2>About</h2>
          </div>
          <a href={profile.socials.medium} target="_blank" rel="noreferrer" className="text-link">
            Read my notes <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="about-grid">
          <div className="about-copy">
            <p>{profile.about}</p>
            <p>
              I care about grounding ambitious ideas in working software: clear problem framing,
              honest evaluation, secure defaults and interfaces people can actually use.
            </p>
          </div>

          <div className="highlight-grid" aria-label="Verified highlights">
            {highlights.map((highlight) => (
              <div key={highlight.label} className="highlight-item">
                <strong>{highlight.value}</strong>
                <span>{highlight.label}</span>
              </div>
            ))}
          </div>

          <div className="certification-list">
            <h3>Learning &amp; recognition</h3>
            <ul>
              {certifications.map((certification) => (
                <li key={certification.name}>
                  <span>{certification.name}</span>
                  <small>{certification.issuer} · {certification.year}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
