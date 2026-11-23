"use client";

import { useMemo, useState } from "react";
import { EVENT_CATEGORIES } from "@/lib/config";
import type { EventCategory, EventItem } from "@/lib/types";
import { Chip } from "@/components/ui/Chip";
import { EventCarousel } from "@/components/event/EventCarousel";

type Filter = "all" | EventCategory;

export function HomeEvents({ events }: { events: EventItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const list = useMemo(() => (filter === "all" ? events : events.filter((e) => e.category === filter)), [events, filter]);

  return (
    <>
      <div className="no-scrollbar flex gap-[7px] overflow-x-auto px-[20px]" role="group" aria-label="Filter kategori">
        <Chip selected={filter === "all"} onClick={() => setFilter("all")}>
          Semua
        </Chip>
        {EVENT_CATEGORIES.map((c) => (
          <Chip key={c} selected={filter === c} onClick={() => setFilter(c)}>
            {c}
          </Chip>
        ))}
      </div>
      <EventCarousel key={filter} events={list} emptyText="Belum ada event mendatang di kategori ini. Coba kategori lain." />
    </>
  );
}
