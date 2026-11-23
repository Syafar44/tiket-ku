"use client";

import { useMemo, useState } from "react";
import { categoriesOf } from "@/lib/event";
import { cx } from "@/lib/format";
import { EVENT_TRACKS, type EventCategory, type EventItem, type EventTrack } from "@/lib/types";
import { StickyHeader } from "@/components/layout/StatusSafeArea";
import { Chip } from "@/components/ui/Chip";
import { EventGridCard } from "./EventGridCard";

type TrackFilter = "all" | EventTrack;
type CategoryFilter = "all" | EventCategory;

const TRACK_OPTIONS: { value: TrackFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  ...EVENT_TRACKS.map((t) => ({ value: t, label: t })),
];

/** Toggle jalur: Semua · Achiever · Rising Star. Lintasan & area sentuh 44px, pilihan aktif 36px di dalamnya. */
function TrackToggle({ value, onChange }: { value: TrackFilter; onChange: (v: TrackFilter) => void }) {
  return (
    <div className="px-[20px] pt-[8px]">
      <div role="radiogroup" aria-label="Filter jalur" className="grid grid-cols-3 rounded-full bg-disabled-bg px-[4px]">
        {TRACK_OPTIONS.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className="press flex h-[44px] items-center justify-center py-[4px]"
            >
              <span
                className={cx(
                  "flex h-full w-full items-center justify-center rounded-full text-[14px] font-bold transition-colors duration-200",
                  active ? "bg-white text-primary shadow-[0_1px_3px_rgba(14,24,48,0.15)]" : "text-text-muted",
                )}
              >
                {o.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Grid semua event: akan datang dulu, lalu yang sudah selesai (berlabel "Selesai"). Filter jalur + kategori. */
export function ExploreView({ events, endedSlugs }: { events: EventItem[]; endedSlugs: string[] }) {
  const [track, setTrack] = useState<TrackFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const ended = useMemo(() => new Set(endedSlugs), [endedSlugs]);

  const byTrack = useMemo(() => (track === "all" ? events : events.filter((e) => e.track === track)), [events, track]);
  // Chip dibentuk dari data jalur yang dipilih, jadi tidak ada chip yang pasti kosong.
  const categories = useMemo(() => categoriesOf(byTrack), [byTrack]);
  const activeCategory = category !== "all" && categories.includes(category) ? category : "all";
  const list = activeCategory === "all" ? byTrack : byTrack.filter((e) => e.category === activeCategory);
  const activeCount = list.filter((e) => !ended.has(e.slug)).length;

  return (
    <main className="pb-[100px]">
      <StickyHeader className="border-b border-border">
        <TrackToggle value={track} onChange={setTrack} />
        <div className="no-scrollbar flex gap-[7px] overflow-x-auto px-[20px] py-[4px]" role="group" aria-label="Filter kategori">
          <Chip selected={activeCategory === "all"} onClick={() => setCategory("all")}>
            Semua
          </Chip>
          {categories.map((c) => (
            <Chip key={c} selected={activeCategory === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </StickyHeader>

      <div className="px-[20px] pb-[14px] pt-[16px]">
        <h1 className="text-[21px] font-bold text-heading">Jelajah Event</h1>
        <p className="text-[14px] text-text-muted">
          {activeCount} event akan datang · {list.length - activeCount} selesai
        </p>
      </div>

      {list.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-[13px] gap-y-[24px] px-[20px]">
          {list.map((e) => (
            <EventGridCard key={e.slug} event={e} ended={ended.has(e.slug)} />
          ))}
        </div>
      ) : (
        <div className="px-[40px] py-[60px] text-center">
          <p className="text-[16px] font-bold text-text">{track === "all" ? "Belum ada event" : `Belum ada event ${track}`}</p>
          <p className="mt-[4px] text-[14px] text-text-muted">Coba pilih jalur atau kategori lain.</p>
        </div>
      )}
    </main>
  );
}
