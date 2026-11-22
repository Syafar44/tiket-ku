"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { EVENT_CATEGORIES } from "@/lib/config";
import type { EventCategory, EventItem } from "@/lib/types";
import { StickyHeader } from "@/components/layout/StatusSafeArea";
import { Chip } from "@/components/ui/Chip";
import { EventGridCard } from "./EventGridCard";

type Filter = "all" | EventCategory;

/** Grid semua event: akan datang dulu, lalu yang sudah selesai (berlabel "Selesai"). */
export function ExploreView({ events, endedSlugs }: { events: EventItem[]; endedSlugs: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Filter>("all");
  const ended = useMemo(() => new Set(endedSlugs), [endedSlugs]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (category !== "all" && e.category !== category) return false;
      if (!q) return true;
      return [e.title, e.subtitle ?? "", e.venue, e.category, e.speaker.name, e.audience].some((v) => v.toLowerCase().includes(q));
    });
  }, [events, query, category]);

  const activeCount = list.filter((e) => !ended.has(e.slug)).length;

  return (
    <main className="pb-[100px]">
      <StickyHeader>
        <div className="flex h-[45px] items-center border-b border-border px-[16px]">
          <label className="flex h-[29px] flex-1 items-center gap-[8px] rounded-full bg-disabled-bg px-[12px]">
            <Search size={18} strokeWidth={3} className="shrink-0 text-primary" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari di EventKu"
              aria-label="Cari event"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-text outline-none placeholder:text-text-disabled [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" aria-label="Hapus pencarian" onClick={() => setQuery("")} className="press hit relative text-text-muted">
                <X size={16} aria-hidden />
              </button>
            )}
          </label>
        </div>
        <div className="no-scrollbar flex gap-[7px] overflow-x-auto px-[20px] py-[14px]" role="group" aria-label="Filter kategori">
          <Chip selected={category === "all"} onClick={() => setCategory("all")}>
            Semua
          </Chip>
          {EVENT_CATEGORIES.map((c) => (
            <Chip key={c} selected={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </StickyHeader>

      <div className="px-[20px] pb-[14px] pt-[6px]">
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
          <p className="text-[16px] font-bold text-text">Event tidak ditemukan</p>
          <p className="mt-[4px] text-[14px] text-text-muted">Coba kata kunci atau kategori lain.</p>
        </div>
      )}
    </main>
  );
}
