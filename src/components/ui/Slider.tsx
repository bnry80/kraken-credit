import * as RadixSlider from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";

interface Props {
  value: number;
  min?: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({
  value,
  min = 0,
  max,
  step = 1,
  onChange,
  className,
}: Props) {
  return (
    <RadixSlider.Root
      className={cn(
        "relative flex h-8 w-full touch-none select-none items-center",
        className,
      )}
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(v) => onChange(v[0])}
    >
      <RadixSlider.Track className="relative h-[5px] w-full grow overflow-hidden rounded-full bg-ink-200/80">
        <RadixSlider.Range
          className={cn("absolute h-full rounded-full bg-ink-900")}
        />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className="block h-6 w-6 rounded-full border-[2.5px] border-white bg-ink-900 shadow-[0_2px_6px_rgba(10,11,15,0.18)] outline-none transition-transform cursor-grab active:cursor-grabbing active:scale-110 focus-visible:ring-4 focus-visible:ring-ink-200"
        aria-label="value"
      />
    </RadixSlider.Root>
  );
}
