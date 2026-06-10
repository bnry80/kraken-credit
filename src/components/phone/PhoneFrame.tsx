import type { ReactNode } from "react";

/** Device-frame preview only — not shown on real mobile fullscreen */
function DynamicIsland() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[14px] z-40 hidden h-[34px] w-[108px] -translate-x-1/2 rounded-full bg-black sm:block" />
  );
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#e5e5ea] sm:p-8">
      <div className="relative h-[100dvh] w-full sm:h-auto sm:w-auto sm:rounded-[3.25rem] sm:bg-[#1c1c1e] sm:p-[11px] sm:shadow-device">
        <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white sm:h-[844px] sm:max-h-[calc(100dvh-4rem)] sm:w-[390px] sm:rounded-[2.75rem]">
          <DynamicIsland />
          <main className="relative flex flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
