import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { ease } from "../../lib/motion";

interface Props {
  value: number;
  format: (v: number) => string;
  className?: string;
  duration?: number;
}

/**
 * Smoothly tweens between numeric values, formatting each interpolated frame.
 * Used so the headline amount + BTC quantity "roll" when presets change.
 */
export function RollingNumber({ value, format, className, duration = 0.6 }: Props) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => format(v));

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: reduce ? 0 : duration,
      ease,
    });
    return controls.stop;
  }, [value, duration, reduce, mv]);

  return <motion.span className={className}>{text}</motion.span>;
}
