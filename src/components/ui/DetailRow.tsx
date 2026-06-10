import { cn } from "../../lib/utils";

interface Props {
  label: string;
  value: string;
  sublabel?: string;
  className?: string;
  valueClassName?: string;
}

export function DetailRow({
  label,
  value,
  sublabel,
  className,
  valueClassName,
}: Props) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-3.5", className)}>
      <div className="min-w-0">
        <span className="text-[15px] text-[#545454]">{label}</span>
        {sublabel && (
          <p className="mt-0.5 text-[13px] leading-snug text-[#545454]">{sublabel}</p>
        )}
      </div>
      <span
        className={cn(
          "font-diatype tabular shrink-0 text-[15px] font-semibold text-black",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}
