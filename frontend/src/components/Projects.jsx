import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { featuredProjects, profile } from "../data/mock";

const pipelineStages = ["Plan", "Generate", "Validate", "Execute", "Report"];
const healthFeatures = ["Scan", "Interpret", "Share", "Audit"];

const ProjectPreview = ({ project }) => {
  if (project.preview === "pipeline") {
    return (
      <div className="project-visual pipeline-visual" aria-label="Ten-agent QA workflow preview">
        <div className="preview-topline">
          <span>AI TestPilot X</span>
          <span>quality pipeline</span>
        </div>
        <div className="pipeline-track">
          {pipelineStages.map((stage, index) => (
            <React.Fragment key={stage}>
              <div className="pipeline-stage">
                <span>{String(index + 1).padStart(2, "0")}</span>
                {stage}
              </div>
              {index < pipelineStages.length - 1 ? <i aria-hidden="true" /> : null}
            </React.Fragment>
          ))}
        </div>
        <div className="preview-footline">
          <span>user story → release decision</span>
          <strong>CLI · UI · CI</strong>
        </div>
      </div>
    );
  }

  if (project.preview === "health") {
    return (
      <div className="project-visual health-visual" aria-label="HealthVault product flow preview">
        <div className="preview-topline">
          <span>HealthVault</span>
          <span>patient-owned records</span>
        </div>
        <div className="health-flow">
          {healthFeatures.map((feature, index) => (
            <div key={feature}>
              <span>0{index + 1}</span>
              <strong>{feature}</strong>
            </div>
          ))}
        </div>
        <div className="preview-footline">
          <span>Health ID · QR sharing · access log</span>
          <strong>12 languages</strong>
        </div>
      </div>
    );
  }

  if (project.preview === "docs") {
    return (
      <div className="project-visual docs-visual" aria-label="PrivateVoice local document retrieval preview">
        <div className="preview-topline">
          <span>PrivateVoice Docs</span>
          <span>local retrieval</span>
        </div>
        <div className="docs-workspace">
          <div className="docs-sources" aria-hidden="true">
            <span className="active">01 · research.pdf</span>
            <span>02 · meeting-notes.md</span>
            <span>03 · project-brief.docx</span>
          </div>
          <div className="docs-answer" aria-hidden="true">
            <small>Grounded answer</small>
            <i />
            <i />
            <i className="short" />
            <strong>Sources 01 · 03</strong>
          </div>
        </div>
        <div className="preview-footline">
          <span>documents stay on-device</span>
          <strong>IndexedDB · PWA</strong>
        </div>
      </div>
    );
  }

  if (project.preview === "clinical") {
    return (
      <div className="project-visual clinical-visual" aria-label="Clinical trial risk review preview">
        <div className="preview-topline">
          <span>Clinical Trial Intelligence</span>
          <span>risk review</span>
        </div>
        <div className="clinical-board">
          <div className="clinical-signals" aria-hidden="true">
            <span><i className="risk-high" />Enrollment variance <strong>High</strong></span>
            <span><i className="risk-review" />Site performance <strong>Review</strong></span>
            <span><i className="risk-clear" />Protocol quality <strong>Clear</strong></span>
          </div>
          <div className="approval-gate" aria-hidden="true">
            <small>Decision gate</small>
            <strong>Human review</strong>
            <span>evidence attached →</span>
          </div>
        </div>
        <div className="preview-footline">
          <span>rules + agent assistance</span>
          <strong>approval required</strong>
        </div>
      </div>
    );
  }

  if (project.preview === "analytics") {
    return (
      <div className="project-visual analytics-visual" aria-label="UIDAI anomaly and load analysis preview">
        <div className="preview-topline">
          <span>UIDAI Analytics</span>
          <span>forensic command centre</span>
        </div>
        <div className="analytics-board">
          <div className="analytics-chart" aria-hidden="true">
            {[42, 68, 51, 88, 61, 74].map((height, index) => (
              <i key={height} style={{ "--bar-height": `${height}%` }}>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </i>
            ))}
          </div>
          <div className="analytics-notes" aria-hidden="true">
            <small>Audit lenses</small>
            <strong>Benford</strong>
            <strong>Gini load</strong>
            <strong>Forecast</strong>
          </div>
        </div>
        <div className="preview-footline">
          <span>anomaly → concentration → demand</span>
          <strong>3 analysis modes</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="project-visual reid-visual" aria-label="Person re-identification model comparison">
      <div className="preview-topline">
        <span>Siamese Person Re-ID</span>
        <span>model comparison</span>
      </div>
      <div className="model-compare">
        <div>
          <small>Model A</small>
          <strong>Triplet loss</strong>
          <span>anchor · positive · negative</span>
        </div>
        <div>
          <small>Model B</small>
          <strong>Contrastive loss</strong>
          <span>positive · negative pairs</span>
        </div>
      </div>
      <div className="preview-footline">
        <span>EfficientNet-B0</span>
        <strong>512-D embeddings</strong>
      </div>
    </div>
  );
};

const Projects = () => (
  <section id="projects" className="section-block projects-section">
    <div className="site-shell section-layout">
      <div className="section-number">02</div>
      <div className="section-content">
        <div className="section-heading-row">
          <div>
            <h2>Selected work</h2>
            <p>Six projects chosen for depth, evidence and a clear user problem.</p>
          </div>
          <a href={profile.socials.github} target="_blank" rel="noreferrer" className="text-link">
            View all repositories <ArrowRight size={17} />
          </a>
        </div>

        <div className="project-list">
          {featuredProjects.map((project, index) => (
            <article id={project.id} key={project.id} className="project-row">
              <div className="project-order">{String(index + 1).padStart(2, "0")}</div>
              <div className="project-story">
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <p className="project-detail">{project.detail}</p>
                <ul className="proof-list" aria-label={`${project.title} evidence`}>
                  {project.proof.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <ProjectPreview project={project} />
              <div className="project-meta">
                <span>Stack</span>
                <p>{project.stack.join(" · ")}</p>
              </div>
              <div className="project-links">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.label} <ArrowUpRight size={16} />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <a href={profile.socials.github} target="_blank" rel="noreferrer" className="projects-end-link">
          View all repositories <ArrowRight size={19} />
        </a>
      </div>
    </div>
  </section>
);

export default Projects;
