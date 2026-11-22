"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface AppBarProps {
  title: string;
  /** Varian dua baris */
  subtitle?: string;
  /** Halaman tujuan jika tidak ada riwayat */
  fallbackHref?: string;
  /** Paksa tombol back ke halaman ini */
  backHref?: string;
  /** Slot aksi kanan 48px */
  action?: ReactNode;
}

/** Bar halaman dalam: back 48px | judul tengah | aksi 48px. */
export function AppBar({ title, subtitle, fallbackHref = "/", backHref, action }: AppBarProps) {
  const router = useRouter();
  const goBack = () => {
    if (backHref) router.push(backHref);
    else if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  };
  return (
    <div className="grid h-[45px] grid-cols-[48px_minmax(0,1fr)_48px] items-center border-b border-border bg-white">
      <button
        type="button"
        onClick={goBack}
        aria-label="Kembali"
        className="press flex h-[45px] w-[48px] items-center justify-center text-primary"
      >
        <ChevronLeft size={24} strokeWidth={2.5} aria-hidden />
      </button>
      {subtitle ? (
        <div className="flex min-w-0 flex-col items-center">
          <h1 className="max-w-full truncate text-[16.5px] font-bold leading-[20px] text-text">{title}</h1>
          <p className="whitespace-pre text-[15px] font-medium leading-[18px] text-primary">{subtitle}</p>
        </div>
      ) : (
        <h1 className="truncate text-center text-[19px] font-medium text-text">{title}</h1>
      )}
      <div className="flex h-[45px] w-[48px] items-center justify-center">{action}</div>
    </div>
  );
}

/** Tombol ikon untuk slot aksi AppBar. */
export function AppBarAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="press flex h-[45px] w-[48px] items-center justify-center text-primary"
    >
      {children}
    </button>
  );
}
