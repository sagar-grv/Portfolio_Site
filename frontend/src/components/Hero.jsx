import React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { featuredProjects, profile } from "../data/mock";

const heroProjects = featuredProjects.slice(0, 4);

const Hero = () => (
  <section id="top" className="hero-section">
    <div className="site-shell hero-grid">
      <div className="hero-copy">
        <p className="hero-name">{profile.name}</p>
        <h1>{profile.headline}</h1>
        <p className="hero-summary">{profile.summary}</p>

        <div className="hero-actions">
          <a href="#projects" className="button button-primary">
            View selected work <ArrowRight size={18} />
          </a>
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            className="button button-secondary"
          >
            <Github size={18} /> GitHub <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="hero-meta" aria-label="Profile details">
          <span>
            <GraduationCap size={18} /> B.Tech AIML · Class of 2027
          </span>
          <span>
            <MapPin size={18} /> {profile.location}
          </span>
          <span className="availability-line">
            <i aria-hidden="true" /> {profile.availability}
          </span>
        </div>
      </div>

      <div className="hero-project-index" aria-label="Featured projects">
        {heroProjects.map((project, index) => (
          <a
            key={project.id}
            href={`#${project.id}`}
            className="hero-project-link"
          >
            <span className="project-index-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong>{project.shortTitle}</strong>
            <ArrowRight size={24} aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default Hero;
