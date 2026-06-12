import type { ReactNode } from "react";

/** Device-frame preview only — not shown on real mobile fullscreen.
 *  Matches the Figma "Dynamic Island" (top 20, 111×39, radius 40). */
function DynamicIsland() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[20px] z-40 hidden h-[39px] w-[111px] -translate-x-1/2 rounded-[40px] border-[0.5px] border-[#161616] bg-black sm:block" />
  );
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#e5e5ea] sm:p-8">
      <div className="relative h-[100dvh] w-full sm:h-auto sm:w-auto sm:rounded-[61px] sm:bg-[#1c1c1e] sm:p-[5px] sm:shadow-device">
        <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white sm:h-[874px] sm:max-h-[calc(100dvh-4rem)] sm:w-[402px] sm:rounded-[54px]">
          <DynamicIsland />
          <main className="relative flex flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
