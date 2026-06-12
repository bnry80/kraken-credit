import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { backOut } from "../../lib/motion";

const COLORS = ["#34c759", "#7132f5", "#f5a623", "#2f6bff", "#ff5a8a", "#1a1a1a"];

type Piece = {
  x: number;
  y: number;
  rotate: number;
  delay: number;
  color: string;
  size: number;
  round: boolean;
};

/**
 * A lightweight, dependency-free confetti burst. Renders a fixed set of pieces
 * that fan out from the origin once on mount. Respects reduced-motion.
 */
export function Confetti({ count = 26 }: { count?: number }) {
  const reduce = useReducedMotion();

  const pieces = useMemo<Piece[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist = 90 + Math.random() * 130;
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 40,
        rotate: Math.random() * 540 - 270,
        delay: Math.random() * 0.12,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 7,
        round: Math.random() > 0.5,
      };
    });
  }, [count]);

  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <div className="absolute left-1/2 top-[26%]">
        {pieces.map((p, i) => (
          <motion.span
            key={i}
            className="absolute block"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.round ? "9999px" : "2px",
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: p.x,
              y: [0, p.y, p.y + 220],
              scale: [0, 1, 1],
              rotate: p.rotate,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: p.delay,
              ease: backOut,
              times: [0, 0.35, 1],
            }}
          />
        ))}
      </div>
    </div>
  );
}
