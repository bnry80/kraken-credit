import { motion, AnimatePresence } from "framer-motion";

interface Props {
  value: number;
  size?: "hero" | "large" | "medium";
  prefix?: string;
}

const sizes = {
  hero: "text-[68px]",
  large: "text-[48px]",
  medium: "text-[36px]",
};

export function AnimatedAmount({
  value,
  size = "hero",
  prefix = "$",
}: Props) {
  const formatted = value.toLocaleString("en-US");

  return (
    <div className="flex items-baseline justify-center">
      <span
        className={`font-diatype font-medium text-ink-400 ${
          size === "hero"
            ? "text-[32px]"
            : size === "large"
              ? "text-[24px]"
              : "text-[18px]"
        }`}
      >
        {prefix}
      </span>
      <div
        className={`font-diatype tabular font-bold leading-none tracking-tight text-ink-900 ${sizes[size]}`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={formatted}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="inline-block"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
