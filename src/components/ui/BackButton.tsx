import { ChevronLeft } from "lucide-react";
import { Pressable } from "./Pressable";

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Pressable
      onClick={onClick}
      ariaLabel="Back"
      scale={0.9}
      haptic="light"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
    >
      <ChevronLeft className="h-5 w-5 text-black" strokeWidth={2} />
    </Pressable>
  );
}
