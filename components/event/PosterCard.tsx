"use client";

import Link from "next/link";
import { cx } from "@/lib/format";
import type { EventItem } from "@/lib/types";
import { useHydrated } from "@/lib/useHydrated";
import { findRegistration, useRegistrations } from "@/store/useRegistrations";
import { GoldBadge, TrackBadge } from "@/components/ui/Badge";
import { Poster } from "./Poster";

interface PosterCardProps {
  event: EventItem;
  index: number;
  active: boolean;
  onSelect: () => void;
}

/** Kartu carousel 200px. Aktif: poster 273 + bar aksi 35. Samping: poster 290. */
export function PosterCard({ event, index, active, onSelect }: PosterCardProps) {
  const hydrated = useHydrated();
  const registered = useRegistrations((s) => !!findRegistration(s.registrations, event.slug)) && hydrated;

  return (
    <Link
      href={`/event/${event.slug}`}
      onClick={(e) => {
        if (!active) {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={active ? `${registered ? "Sudah terdaftar" : "Daftar"}: ${event.title}` : `Pilih ${event.title}`}
      className={cx(
        "press block w-[200px] shrink-0 snap-center overflow-hidden rounded-[13px] transition-[height] duration-200",
        active ? "h-[308px] shadow-[0_8px_20px_rgba(14,24,48,0.18)]" : "h-[290px]",
      )}
    >
      <div className={cx("relative transition-[height] duration-200", active ? "h-[273px]" : "h-[290px]")}>
        <Poster title={event.title} gradient={event.gradient} imageUrl={event.posterUrl} titleClassName="text-[20px]" priority={index === 0} />
        <div className="absolute left-[10px] top-[10px] flex items-center gap-[4px]">
          <GoldBadge>Gratis</GoldBadge>
          <TrackBadge track={event.track} />
        </div>
        <span className="absolute right-[10px] top-[10px] flex size-[20px] items-center justify-center rounded-full bg-black/35 text-[11px] font-bold text-white">
          {index + 1}
        </span>
      </div>
      {active && (
        <span
          className={cx(
            "flex h-[35px] items-center justify-center text-[15px] font-bold tracking-[0.3px]",
            registered ? "bg-success text-white" : "bg-primary text-accent",
          )}
        >
          {registered ? "TERDAFTAR ✓" : "DAFTAR"}
        </span>
      )}
    </Link>
  );
}
