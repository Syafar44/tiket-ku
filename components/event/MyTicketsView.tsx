"use client";

import { useMemo, useState } from "react";
import { getEventStatus } from "@/lib/time";
import type { EventItem, Registration } from "@/lib/types";
import { useHydrated } from "@/lib/useHydrated";
import { useNow } from "@/lib/useNow";
import { useRegistrations } from "@/store/useRegistrations";
import { StickyHeader } from "@/components/layout/StatusSafeArea";
import { TopBar } from "@/components/layout/TopBar";
import { PrimaryPillLink } from "@/components/ui/Button";
import { TicketFill } from "@/components/ui/icons";
import { Sk } from "@/components/ui/Skeleton";
import { Tabs, tabIds, type TabItem } from "@/components/ui/Tabs";
import { TicketListCard } from "./TicketListCard";

type TabKey = "upcoming" | "history";

const TABS: [TabItem<TabKey>, TabItem<TabKey>] = [
  { value: "upcoming", label: "Akan Datang" },
  { value: "history", label: "Riwayat" },
];

export function MyTicketsView({ events }: { events: EventItem[] }) {
  const hydrated = useHydrated();
  const now = useNow(30_000);
  const registrations = useRegistrations((s) => s.registrations);
  const [tab, setTab] = useState<TabKey>("upcoming");

  const { upcoming, history } = useMemo(() => {
    const bySlug = new Map(events.map((e) => [e.slug, e]));
    const rows = registrations
      .map((r) => ({ registration: r, event: bySlug.get(r.eventSlug) }))
      .filter((x): x is { registration: Registration; event: EventItem } => !!x.event);
    const start = (x: { event: EventItem }) => Date.parse(x.event.startAt);
    return {
      upcoming: rows.filter((x) => getEventStatus(x.event, now) !== "ended").sort((a, b) => start(a) - start(b)),
      history: rows.filter((x) => getEventStatus(x.event, now) === "ended").sort((a, b) => start(b) - start(a)),
    };
  }, [registrations, events, now]);

  const list = tab === "upcoming" ? upcoming : history;
  const panel = tabIds("tickets", tab);

  return (
    <main className="pb-[100px]">
      <StickyHeader>
        <TopBar showBell />
        <Tabs tabs={TABS} value={tab} onChange={setTab} height={50} idPrefix="tickets" />
      </StickyHeader>

      <section id={panel.panel} role="tabpanel" aria-labelledby={panel.tab}>
        {!hydrated ? (
          <div className="space-y-[24px] p-[20px]">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-[18px]">
                <Sk className="h-[120px] w-[83px] rounded-[7px]" />
                <div className="flex-1 space-y-[10px]">
                  <Sk className="h-[20px] w-[85%]" />
                  <Sk className="h-[16px] w-[60%]" />
                  <Sk className="h-[16px] w-[50%]" />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center px-[32px] py-[56px] text-center">
            <span className="flex size-[88px] items-center justify-center rounded-full bg-section">
              <TicketFill size={44} className="text-nav-inactive" />
            </span>
            <p className="mt-[16px] text-[17px] font-bold text-text">
              {tab === "upcoming" ? "Belum ada event yang kamu daftar" : "Belum ada riwayat event"}
            </p>
            <p className="mt-[6px] text-[15px] leading-[21px] text-text-muted">Ikuti workshop AI gratis dari GSA UMKT, cukup daftar lalu datang.</p>
            <PrimaryPillLink href="/jelajah" className="mt-[20px]">
              Jelajahi Event
            </PrimaryPillLink>
          </div>
        ) : (
          list.map((x) => <TicketListCard key={x.registration.id} registration={x.registration} event={x.event} now={now} />)
        )}
      </section>
    </main>
  );
}
