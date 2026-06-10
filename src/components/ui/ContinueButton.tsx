import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  className?: string;
}

export function ContinueButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  className,
}: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-[15px] font-medium leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" && "bg-black text-white active:bg-black/90",
        variant === "ghost" &&
          "bg-transparent px-4 text-[#545454] active:text-black",
        className,
      )}
    >
      {children}
      {variant === "primary" && (
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      )}
    </motion.button>
  );
}
