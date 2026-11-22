"use client";

import { useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { cx } from "@/lib/format";
import { formatDateShort, formatTimeRange } from "@/lib/time";
import type { EventItem } from "@/lib/types";
import { PosterCard } from "./PosterCard";

const CARD = 200;
const GAP = 16;
const STEP = CARD + GAP;

/**
 * Gradien info event aktif: putih di atas → warna dasar Google di bawah,
 * bergiliran biru, merah, kuning, hijau sesuai urutan kartu.
 * Kekuatan warna disamakan secara visual (kuning butuh opacity lebih tinggi).
 */
const ACCENT_LAYERS = [
  "bg-linear-to-b from-white to-google-blue/20",
  "bg-linear-to-b from-white to-google-red/18",
  "bg-linear-to-b from-white to-google-yellow/30",
  "bg-linear-to-b from-white to-google-green/22",
];

/** Carousel scroll-snap; kartu di tengah = aktif. Info event aktif ikut berubah. */
export function EventCarousel({ events, emptyText }: { events: EventItem[]; emptyText: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const i = Math.min(events.length - 1, Math.max(0, Math.round(el.scrollLeft / STEP)));
    if (i !== active) setActive(i);
  };

  const scrollTo = (i: number) => ref.current?.scrollTo({ left: i * STEP, behavior: "smooth" });

  if (events.length === 0) {
    return (
      <div className="mx-[20px] mt-[23px] flex h-[200px] flex-col items-center justify-center rounded-[13px] border border-dashed border-border-strong px-[24px] text-center">
        <p className="text-[16px] font-bold text-text">Belum ada event</p>
        <p className="mt-[4px] text-[14px] text-text-muted">{emptyText}</p>
      </div>
    );
  }

  const current = events[active] ?? events[0];

  return (
    <>
      <div
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar mt-[23px] flex snap-x snap-mandatory items-start gap-[16px] overflow-x-auto px-[calc(50%-100px)] pb-[12px]"
      >
        {events.map((e, i) => (
          <PosterCard key={e.slug} event={e} index={i} active={i === active} onSelect={() => scrollTo(i)} />
        ))}
      </div>
      <div className="relative overflow-hidden px-[20px] pb-[22px] pt-[28px] text-center" aria-live="polite">
        {/* Putih di atas → warna Google di bawah; warna berganti tiap kartu digeser (fade halus). */}
        {ACCENT_LAYERS.map((cls, i) => (
          <span
            key={cls}
            aria-hidden
            className={cx("absolute inset-0 transition-opacity duration-300 ease-in-out", cls, i === active % ACCENT_LAYERS.length ? "opacity-100" : "opacity-0")}
          />
        ))}
        <h3 className="relative text-[26px] font-bold leading-[31px] text-text">{current.title}</h3>
        {current.subtitle && (
          <p className="relative mx-auto mt-[4px] line-clamp-2 max-w-[330px] text-[15px] leading-[20px] text-text">{current.subtitle}</p>
        )}
        <p className="relative mt-[8px] text-[14px] leading-[20px] text-text-muted">
          {formatDateShort(current.startAt)} · {formatTimeRange(current)}
        </p>
        <p className="relative mx-auto mt-[2px] flex max-w-[330px] items-center justify-center gap-[4px] text-[14px] leading-[20px] text-text-light">
          <MapPin size={14} className="shrink-0" aria-hidden />
          <span className="truncate">{current.venue}</span>
        </p>
      </div>
    </>
  );
}
