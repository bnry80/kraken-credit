import { cn } from "../../lib/utils";

interface Props {
  qty: string;
  usd: string;
  size?: "lg" | "md";
  className?: string;
}

export function BtcAmount({ qty, usd, size = "lg", className }: Props) {
  const [whole, frac] = qty.includes(".") ? qty.split(".") : [qty, ""];

  return (
    <div className={cn("text-center", className)}>
      <p className="tabular leading-none text-black">
        <span
          className={cn(
            "font-diatype font-bold",
            size === "lg" ? "text-[52px]" : "text-[40px]",
          )}
        >
          {whole}
          {frac && `.${frac}`}
        </span>
        <span
          className={cn(
            "font-medium text-[#9a9a9a]",
            size === "lg" ? "text-[22px]" : "text-[18px]",
          )}
        >
          {" "}
          BTC
        </span>
      </p>
      <p className="tabular mt-2 text-[15px] text-[#9a9a9a]">≈ {usd}</p>
    </div>
  );
}
