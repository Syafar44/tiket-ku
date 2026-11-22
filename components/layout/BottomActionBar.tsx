import type { ReactNode } from "react";

/** Area bawah yang melekat: konten (CTA, ringkasan) + area aman putih 36px. */
export function BottomActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[393px] bg-white">
      {children}
      <div aria-hidden className="h-[36px] bg-white" />
    </div>
  );
}
