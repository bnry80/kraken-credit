import type { ReactNode } from "react";

/** Device-frame preview only — not shown on real mobile fullscreen.
 *  Matches the Figma "Dynamic Island" (top 20, 111×39, radius 40). */
function DynamicIsland() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[20px] z-40 hidden h-[39px] w-[111px] -translate-x-1/2 rounded-[40px] border-[0.5px] border-[#161616] bg-black sm:block" />
  );
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  // Mobile (<sm): use 100svh — the "small" viewport height, which assumes the
  // browser chrome (address bar, etc.) is visible. This guarantees nothing
  // gets hidden behind iOS Safari's bottom toolbar even as it animates in/out.
  // Desktop (≥sm): fixed device-frame preview at 402×874.
  return (
    <div className="flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#e5e5ea] sm:min-h-[100dvh] sm:p-8">
      <div className="relative h-[100svh] w-full sm:h-auto sm:w-auto sm:rounded-[61px] sm:bg-[#1c1c1e] sm:p-[5px] sm:shadow-device">
        <div className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-white sm:h-[874px] sm:max-h-[calc(100dvh-4rem)] sm:w-[402px] sm:rounded-[54px]">
          <DynamicIsland />
          <main className="relative flex flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
