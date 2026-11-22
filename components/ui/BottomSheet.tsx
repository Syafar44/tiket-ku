"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cx } from "@/lib/format";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** id elemen judul, untuk aria-labelledby */
  labelledBy: string;
  children: ReactNode;
  /** Konten yang menempel di bawah sheet (mis. tombol konfirmasi) */
  footer?: ReactNode;
}

/**
 * Sheet dari bawah: role="dialog", Esc menutup, fokus kembali ke pemicu setelah ditutup.
 * Masuk: naik + latar memudar masuk. Keluar: turun + latar memudar keluar (ease-in-out),
 * baru dilepas dari DOM setelah animasi keluar selesai.
 */
export function BottomSheet({ open, onClose, labelledBy, children, footer }: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  // Tetap dirender selama animasi keluar berjalan.
  const [rendered, setRendered] = useState(open);
  if (open && !rendered) setRendered(true);
  const closing = rendered && !open;

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    const first = panelRef.current?.querySelector<HTMLElement>("input, select, textarea, button:not([data-close])");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        // Kunci fokus di dalam sheet.
        const items = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, select, textarea")];
        if (items.length === 0) return;
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus();
    };
  }, [open, onClose]);

  if (!rendered) return null;

  return (
    <div className={cx("fixed inset-0 z-50 mx-auto w-full max-w-[393px]", closing && "pointer-events-none")}>
      <button
        type="button"
        aria-label="Tutup"
        tabIndex={-1}
        data-close
        onClick={onClose}
        className={cx("absolute inset-0 bg-black/45", closing ? "animate-fade-out" : "animate-fade-in")}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onAnimationEnd={(e) => {
          if (closing && e.target === e.currentTarget) setRendered(false);
        }}
        className={cx(
          "absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col rounded-t-[16px] bg-white",
          closing ? "animate-sheet-down" : "animate-sheet-up",
        )}
      >
        <div className="mx-auto mt-[8px] h-[4px] w-[40px] shrink-0 rounded-full bg-border-strong" />
        <button
          type="button"
          aria-label="Tutup"
          data-close
          onClick={onClose}
          className="press absolute right-[12px] top-[12px] flex size-[44px] items-center justify-center text-text-muted"
        >
          <X size={22} aria-hidden />
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto px-[20px] pb-[16px] pt-[12px]">{children}</div>
        {footer && <div className="shrink-0">{footer}</div>}
      </div>
    </div>
  );
}
