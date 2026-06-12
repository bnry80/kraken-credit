import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { motion } from "framer-motion";
import { springs } from "../../lib/springs";
import { haptics } from "../../lib/haptics";
import { cn } from "../../lib/utils";

type HapticKind = "selection" | "light" | "medium" | "heavy" | "none";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  /** How far it scales down while held. */
  scale?: number;
  /** Slight dim while held, like a UIButton highlight. */
  dim?: boolean;
  /** Haptic fired on press-down. */
  haptic?: HapticKind;
  ariaLabel?: string;
  style?: CSSProperties;
}

/**
 * A button that behaves like a UIKit control: the highlight engages instantly on
 * touch-down, springs back on release, and cancels cleanly if the finger slides
 * off before lifting (framer's tap gesture handles the cancel). Fires a haptic on
 * press-down so the feedback is felt the instant contact is made, not on click.
 */
export const Pressable = forwardRef<HTMLButtonElement, Props>(function Pressable(
  {
    children,
    onClick,
    disabled,
    className,
    scale = 0.96,
    dim = true,
    haptic = "light",
    ariaLabel,
    style,
  },
  ref,
) {
  const onPressDown = () => {
    if (disabled) return;
    if (haptic === "selection") haptics.selection();
    else if (haptic !== "none") haptics.impact(haptic);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      onTapStart={onPressDown}
      whileTap={disabled ? undefined : { scale, opacity: dim ? 0.9 : 1 }}
      transition={springs.press}
      style={{ WebkitTapHighlightColor: "transparent", ...style }}
      className={cn("select-none outline-none disabled:opacity-40", className)}
    >
      {children}
    </motion.button>
  );
});
