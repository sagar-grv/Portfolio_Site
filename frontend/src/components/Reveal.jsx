import React, { useEffect, useRef, useState } from "react";

/**
 * Lightweight scroll-reveal wrapper using IntersectionObserver.
 * Applies a fade + slight translate on enter. Respects prefers-reduced-motion.
 */
const Reveal = ({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  direction = "up",
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const translate =
    direction === "up"
      ? "translateY(22px)"
      : direction === "down"
      ? "translateY(-22px)"
      : direction === "left"
      ? "translateX(22px)"
      : "translateX(-22px)";

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : translate,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
