import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/**
 * Header lengket di paling atas. Jarak atas hanya sebesar safe area perangkat (notch/status bar),
 * lewat env(safe-area-inset-top) — butuh viewport-fit=cover (lihat app/layout.tsx). Di browser biasa = 0.
 */
export function StickyHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <header className={cx("sticky top-0 z-30 bg-white pt-[env(safe-area-inset-top)]", className)}>{children}</header>;
}
