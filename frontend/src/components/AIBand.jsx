import React from "react";

const tokens = [
  "tensor",
  "gradient descent",
  "transformer",
  "attention",
  "embedding",
  "CNN",
  "YOLO",
  "diffusion",
  "RLHF",
  "LoRA",
  "RAG",
  "vector DB",
  "MLOps",
  "inference",
  "softmax",
  "cross-entropy",
  "tokenizer",
  "Gemini",
  "CUDA",
];

/** Thin horizontal band of AI/ML jargon marquee-ing across the screen.
 *  Adds visual texture + reinforces the AI/ML persona without being noisy.
 */
const AIBand = () => {
  return (
    <div className="relative border-y border-[var(--border)] bg-gradient-to-r from-[var(--bg)] via-[var(--bg-elev)]/60 to-[var(--bg)] overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent z-10 pointer-events-none" />
      <div className="py-4 flex gap-8 whitespace-nowrap marquee-track">
        {[...tokens, ...tokens].map((t, i) => (
          <span
            key={i}
            className="font-mono text-xs text-[var(--text-dim)] uppercase tracking-widest inline-flex items-center gap-3"
          >
            <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AIBand;
