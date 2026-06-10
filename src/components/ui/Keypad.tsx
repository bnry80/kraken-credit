import { motion } from "framer-motion";
import { Delete } from "lucide-react";

interface Props {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onMax: () => void;
  compact?: boolean;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function Key({
  children,
  onClick,
  ariaLabel,
  compact,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
  compact?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.94 }}
      className={
        compact
          ? "flex h-10 items-center justify-center rounded-lg text-[22px] font-medium text-ink-900 active:bg-ink-100"
          : "flex h-[52px] items-center justify-center rounded-xl text-[26px] font-medium text-ink-900 active:bg-ink-100"
      }
    >
      {children}
    </motion.button>
  );
}

export function Keypad({ onDigit, onBackspace, onMax, compact }: Props) {
  return (
    <div className={compact ? "grid grid-cols-3 gap-x-1 gap-y-0" : "grid grid-cols-3 gap-x-2 gap-y-1"}>
      {KEYS.map((k) => (
        <Key
          key={k}
          compact={compact}
          onClick={() => onDigit(k)}
          ariaLabel={`Digit ${k}`}
        >
          {k}
        </Key>
      ))}
      <Key compact={compact} onClick={onMax} ariaLabel="Use max">
        <span
          className={
            compact
              ? "text-[11px] font-semibold text-ink-500"
              : "text-[13px] font-semibold text-brand-600"
          }
        >
          Max
        </span>
      </Key>
      <Key compact={compact} onClick={() => onDigit("0")} ariaLabel="Digit 0">
        0
      </Key>
      <Key compact={compact} onClick={onBackspace} ariaLabel="Backspace">
        <Delete className={compact ? "h-4 w-4 text-ink-400" : "h-5 w-5 text-ink-400"} />
      </Key>
    </div>
  );
}
