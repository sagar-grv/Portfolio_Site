import React from "react";
import { BarChart3, BrainCircuit, Code2, ShieldCheck } from "lucide-react";
import { capabilities } from "../data/mock";

const iconMap = {
  brain: BrainCircuit,
  chart: BarChart3,
  code: Code2,
  shield: ShieldCheck,
};

const Skills = () => (
  <section id="capabilities" className="section-block capabilities-section">
    <div className="site-shell section-layout">
      <div className="section-number">04</div>
      <div className="section-content">
        <div className="section-heading-row compact-heading">
          <div>
            <h2>Capabilities</h2>
            <p>A practical stack spanning models, data, software and delivery.</p>
          </div>
        </div>

        <div className="capability-grid">
          {capabilities.map((capability) => {
            const Icon = iconMap[capability.icon];
            return (
              <article key={capability.category} className="capability-column">
                <Icon size={34} strokeWidth={1.6} aria-hidden="true" />
                <h3>{capability.category}</h3>
                <ul>
                  {capability.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default Skills;
