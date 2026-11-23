"use client";

import { useMemo, useState } from "react";
import { EVENT_CATEGORIES } from "@/lib/config";
import type { EventCategory, EventItem } from "@/lib/types";
import { StickyHeader } from "@/components/layout/StatusSafeArea";
import { Chip } from "@/components/ui/Chip";
import { EventGridCard } from "./EventGridCard";

type Filter = "all" | EventCategory;

/** Grid semua event: akan datang dulu, lalu yang sudah selesai (berlabel "Selesai"). Filter per kategori. */
export function ExploreView({ events, endedSlugs }: { events: EventItem[]; endedSlugs: string[] }) {
  const [category, setCategory] = useState<Filter>("all");
  const ended = useMemo(() => new Set(endedSlugs), [endedSlugs]);

  const list = useMemo(() => (category === "all" ? events : events.filter((e) => e.category === category)), [events, category]);
  const activeCount = list.filter((e) => !ended.has(e.slug)).length;

  return (
    <main className="pb-[100px]">
      <StickyHeader className="border-b border-border">
        <div className="no-scrollbar flex gap-[7px] overflow-x-auto px-[20px] py-[4px]" role="group" aria-label="Filter kategori">
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
          <p className="text-[16px] font-bold text-text">Belum ada event di kategori ini</p>
          <p className="mt-[4px] text-[14px] text-text-muted">Coba kategori lain.</p>
        </div>
      )}
    </main>
  );
}
