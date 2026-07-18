import React from "react";
import { education, experience } from "../data/mock";

const timelineItems = [
  ...experience.map((item) => ({ ...item, type: "experience" })),
  ...education.map((item) => ({
    role: item.degree,
    org: item.school,
    period: item.period,
    summary: item.detail,
    type: "education",
  })),
];

const Experience = () => (
  <section id="experience" className="section-block">
    <div className="site-shell section-layout">
      <div className="section-number">03</div>
      <div className="section-content">
        <div className="section-heading-row compact-heading">
          <div>
            <h2>Experience &amp; education</h2>
            <p>Building products, teaching practical AI and learning the fundamentals.</p>
          </div>
        </div>

        <ol className="timeline-list">
          {timelineItems.map((item) => (
            <li key={`${item.role}-${item.period}`} className="timeline-item">
              <i aria-hidden="true" />
              <div className="timeline-main">
                <h3>{item.role}</h3>
                <span>{item.org}</span>
                <p>{item.summary}</p>
              </div>
              <time>{item.period}</time>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

export default Experience;
