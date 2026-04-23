import React, { useEffect, useState } from "react";
import { Activity, Brain, GitBranch, Cpu } from "lucide-react";

/** Small live 'AI telemetry' widget to inject AI/ML persona. */
const LiveMetrics = () => {
  const [loss, setLoss] = useState(0.284);
  const [gpu, setGpu] = useState(62);
  const [tps, setTps] = useState(184);

  useEffect(() => {
    const id = setInterval(() => {
      setLoss((v) => {
        const next = v + (Math.random() - 0.55) * 0.008;
        return Math.max(0.04, Math.min(0.45, next));
      });
      setGpu((v) => {
        const next = v + (Math.random() - 0.5) * 6;
        return Math.round(Math.max(28, Math.min(94, next)));
      });
      setTps((v) => {
        const next = v + (Math.random() - 0.5) * 18;
        return Math.round(Math.max(80, Math.min(280, next)));
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  const items = [
    {
      icon: Brain,
      label: "train/loss",
      value: loss.toFixed(3),
      trend: "↓",
    },
    { icon: Cpu, label: "gpu util", value: `${gpu}%` },
    { icon: Activity, label: "tok/s", value: `${tps}` },
    { icon: GitBranch, label: "branch", value: "main" },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)]/70 backdrop-blur px-4 py-3 font-mono text-[11px]">
      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-[var(--accent)] via-transparent to-[var(--accent)] opacity-60" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2">
            <it.icon size={12} className="text-[var(--accent)]" />
            <span className="text-[var(--text-dim)] uppercase tracking-wider">
              {it.label}
            </span>
            <span className="ml-auto text-[var(--text)] tabular-nums">
              {it.value}
              {it.trend && (
                <span className="ml-1 text-[var(--accent)]">{it.trend}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMetrics;
