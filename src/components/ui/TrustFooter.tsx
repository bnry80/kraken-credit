import { Lock } from "lucide-react";

interface Props {
  text?: string;
}

export function TrustFooter({
  text = "Secure. Transparent. Built for you.",
}: Props) {
  return (
    <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#b0b0b0]">
      <Lock className="h-3 w-3" strokeWidth={2} />
      <span>{text}</span>
    </div>
  );
}
