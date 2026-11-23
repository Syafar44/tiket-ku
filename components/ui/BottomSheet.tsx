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

const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])";

/**
 * Sheet dari bawah: role="dialog", Esc menutup, Tab terkunci di dalam sheet.
 *
 * Fokus hanya diatur saat `open` berubah:
 * - false → true: fokus ke input pertama (sekali). Di layar sentuh (pointer: coarse) tidak autofocus;
 *   yang difokus panel dialognya, supaya keyboard tidak langsung muncul.
 * - true → false: fokus kembali ke elemen pemicu.
 * `onClose` disimpan di ref, jadi parent yang render ulang (mis. hitung mundur) tidak menjalankan ulang efek ini.
 *
 * Masuk: naik + latar memudar. Keluar: turun + memudar, lalu dilepas dari DOM setelah animasi selesai.
 * Saat keyboard virtual muncul, sheet diangkat setinggi keyboard (visualViewport) supaya tetap terlihat.
 */
export function BottomSheet({ open, onClose, labelledBy, children, footer }: BottomSheetProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  // Tetap dirender selama animasi keluar berjalan.
  const [rendered, setRendered] = useState(open);
  if (open && !rendered) setRendered(true);
  const closing = rendered && !open;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Fokus, focus trap, Esc, dan kunci scroll: hanya saat `open` berubah.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const firstField = coarse ? null : panel?.querySelector<HTMLElement>("input, select, textarea");
    (firstField ?? panel)?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    // Kunci scroll di <html>; scrollbar-gutter: stable (globals.css) menjaga lebar layout tidak bergeser.
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);

  // Keyboard virtual: angkat sheet setinggi keyboard dan batasi tingginya ke area yang terlihat.
  useEffect(() => {
    if (!open) return;
    const vv = window.visualViewport;
    const root = rootRef.current;
    if (!vv || !root) return;
    const update = () => {
      const keyboard = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      root.style.setProperty("--sheet-kb", `${Math.round(keyboard)}px`);
      root.style.setProperty("--sheet-vh", `${Math.round(vv.height)}px`);
      const active = document.activeElement;
      if (keyboard > 0 && active instanceof HTMLElement && panelRef.current?.contains(active) && active !== panelRef.current) {
        active.scrollIntoView({ block: "nearest" });
      }
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [open]);

  if (!rendered) return null;

  return (
    <div ref={rootRef} className={cx("fixed inset-0 z-50 mx-auto w-full max-w-[393px]", closing && "pointer-events-none")}>
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
        tabIndex={-1}
        onAnimationEnd={(e) => {
          if (closing && e.target === e.currentTarget) setRendered(false);
        }}
        className={cx(
          "absolute inset-x-0 bottom-[var(--sheet-kb,0px)] flex max-h-[calc(var(--sheet-vh,100dvh)*0.9)] flex-col rounded-t-[16px] bg-white outline-none",
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
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[20px] pb-[16px] pt-[12px]">{children}</div>
        {footer && <div className="shrink-0">{footer}</div>}
      </div>
    </div>
  );
}
