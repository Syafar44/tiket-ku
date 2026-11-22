import type { ReactNode } from "react";

/** Ruang status bar 47px (kosong). */
export function StatusSafeArea() {
  return <div aria-hidden className="h-[47px] w-full bg-white" />;
}

/** Header lengket: safe area + bar di bawahnya. */
export function StickyHeader({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 bg-white">
      <StatusSafeArea />
      {children}
    </header>
  );
}
