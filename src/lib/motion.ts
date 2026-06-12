import type { Variants } from "framer-motion";
import { springs } from "./springs";

export const ease = [0.32, 0.72, 0, 1] as const;

/** Snappy spring for taps, chips, and layout moves. */
export const spring = { type: "spring" as const, stiffness: 400, damping: 32 };

/** Softer spring for entrances and cards settling into place. */
export const softSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 26,
  mass: 0.9,
};

/** Overshooting cubic for playful pops (coins, check marks). */
export const backOut = [0.34, 1.56, 0.64, 1] as const;

export const slide = {
  enter: (dir: number) => ({ x: dir >= 0 ? "100%" : "-28%", opacity: 0.6 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? "-28%" : "100%", opacity: 0.6 }),
};

export const stagger = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.4, ease },
});

/** Parent that reveals children one after another. */
export const sceneStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
};

/** Child item that rises and fades in with a native spring settle. */
export const riseItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: springs.gentle },
};

/** Reduced-motion-safe variants: fade only, no movement. */
export const fadeItem: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
};
