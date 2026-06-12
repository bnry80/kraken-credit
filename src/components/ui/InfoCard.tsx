import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Props {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
  variant?: "default" | "risk";
  className?: string;
}

export function InfoCard({
  icon,
  label,
  value,
  description,
  variant = "default",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-[20px] px-4 py-4",
        variant === "risk" ? "bg-[#f3eeeb]" : "bg-[#f0f0f0]",
        className,
      )}
    >
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black">
          {icon}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[13px] font-medium text-[#9a9a9a]">{label}</p>
          <p className="mt-1 text-[16px] font-semibold leading-[1.3] text-black">
            {value}
          </p>
          <p className="mt-1 text-[13px] leading-[1.35] text-[#9a9a9a]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
