import * as RadixSlider from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";

type Accent = "brand" | "mint" | "danger";

interface Props {
  value: number;
  min?: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  accent?: Accent;
  className?: string;
}

const RANGE: Record<Accent, string> = {
  brand: "bg-brand-500",
  mint: "bg-mint-500",
  danger: "bg-danger-500",
};

const SHADOW: Record<Accent, string> = {
  brand: "0 6px 16px -4px rgba(113,50,245,0.5)",
  mint: "0 6px 16px -4px rgba(16,185,129,0.5)",
  danger: "0 6px 16px -4px rgba(244,63,94,0.5)",
};

const RING: Record<Accent, string> = {
  brand: "focus-visible:ring-brand-400/30",
  mint: "focus-visible:ring-mint-400/30",
  danger: "focus-visible:ring-danger-400/30",
};

export function Slider({
  value,
  min = 0,
  max,
  step = 1,
  onChange,
  accent = "brand",
  className,
}: Props) {
  return (
    <RadixSlider.Root
      className={cn(
        "relative flex h-6 w-full touch-none select-none items-center",
        className,
      )}
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(v) => onChange(v[0])}
    >
      <RadixSlider.Track className="relative h-2.5 w-full grow overflow-hidden rounded-full bg-ink-900/[0.06]">
        <RadixSlider.Range
          className={cn("absolute h-full rounded-full", RANGE[accent])}
        />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className={cn(
          "block h-6 w-6 rounded-full border-[3px] border-white bg-white outline-none transition-transform",
          "cursor-grab active:cursor-grabbing active:scale-110 focus-visible:ring-4",
          RING[accent],
        )}
        style={{ boxShadow: SHADOW[accent] }}
        aria-label="value"
      />
    </RadixSlider.Root>
  );
}
