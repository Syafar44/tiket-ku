"use client";

import Link from "next/link";
import { Bell, CircleUser, Headset, Search } from "lucide-react";
import { SUPPORT_WHATSAPP } from "@/lib/constants";
import { useToast } from "@/store/useToast";

const iconBtn = "press hit relative flex size-[24px] items-center justify-center text-primary";

/** Bar atas Beranda & Tiket Saya: search pill + ikon. */
export function TopBar({ showBell = false }: { showBell?: boolean }) {
  const toast = useToast((s) => s.show);
  return (
    <div className="flex h-[45px] items-center border-b border-border pl-[16px] pr-[22px]">
      <Link
        href="/jelajah"
        className="press flex h-[29px] min-w-0 flex-1 items-center gap-[8px] rounded-full bg-disabled-bg px-[12px]"
        aria-label="Cari event di EventKu"
      >
        <Search size={18} strokeWidth={3} className="shrink-0 text-primary" aria-hidden />
        <span className="truncate text-[15px] text-text-disabled">Cari di EventKu</span>
      </Link>
      <div className="ml-[20px] flex items-center gap-[20px]">
        {showBell && (
          <button type="button" aria-label="Notifikasi" className={iconBtn} onClick={() => toast("Belum ada notifikasi baru")}>
            <Bell size={24} aria-hidden />
          </button>
        )}
        <a href={SUPPORT_WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="Bantuan" className={iconBtn}>
          <Headset size={24} aria-hidden />
        </a>
        <button type="button" aria-label="Profil" className={iconBtn} onClick={() => toast("Tanpa akun: data daftar disimpan di perangkat ini")}>
          <CircleUser size={24} aria-hidden />
        </button>
      </div>
    </div>
  );
}
