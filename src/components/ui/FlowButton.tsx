import type { ReactNode } from "react";
import { Pressable } from "./Pressable";
import { cn } from "../../lib/utils";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function FlowButton({ children, onClick, disabled, className }: Props) {
  return (
    <Pressable
      onClick={onClick}
      disabled={disabled}
      scale={0.97}
      haptic="medium"
      className={cn(
        "flex h-[52px] w-full items-center justify-center rounded-full bg-black text-[16px] font-semibold text-white",
        className,
      )}
    >
      {children}
    </Pressable>
  );
}
