"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cx } from "@/lib/format";
import { useToast } from "@/store/useToast";
import checkAccent from "@/public/icons/check-16-accent.svg";

const DEFAULT_BOTTOM = 150;
/** Lama toast tampil sebelum animasi keluar dimulai. */
const VISIBLE_MS = 2000;

export function Toaster() {
  const message = useToast((s) => s.message);
  const toastKey = useToast((s) => s.key);
  const icon = useToast((s) => s.icon);
  const bottom = useToast((s) => s.bottom);
  const hide = useToast((s) => s.hide);
  /** key toast yang sedang menjalankan animasi keluar */
  const [leavingKey, setLeavingKey] = useState<number | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setLeavingKey(toastKey), VISIBLE_MS);
    return () => clearTimeout(t);
  }, [message, toastKey]);

  const leaving = leavingKey === toastKey;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-[90] mx-auto flex w-full max-w-[393px] justify-center px-[20px]"
      style={{ bottom: bottom ?? DEFAULT_BOTTOM }}
    >
      {message && (
        <div
          key={toastKey}
          onAnimationEnd={() => {
            if (leaving) hide();
          }}
          className={cx(
            "flex items-center gap-[8px] rounded-[10px] bg-primary-dark px-[16px] py-[11px] shadow-lg",
            leaving ? "animate-toast-out" : "animate-toast-in",
          )}
        >
          {icon === "check" && <Image src={checkAccent} alt="" width={16} height={16} className="shrink-0" />}
          <p className="text-[14px] font-medium text-white">{message}</p>
        </div>
      )}
    </div>
  );
}
