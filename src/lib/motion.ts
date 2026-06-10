export const ease = [0.32, 0.72, 0, 1] as const;

export const spring = { type: "spring" as const, stiffness: 400, damping: 32 };

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
