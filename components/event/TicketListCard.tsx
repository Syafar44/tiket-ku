"use client";

import Link from "next/link";
import { useState } from "react";
import { Star } from "lucide-react";
import { cx } from "@/lib/format";
import { fullTitle } from "@/lib/event";
import { daysUntil, formatDateMedium, formatTimeRange, getEventStatus } from "@/lib/time";
import type { EventItem, EventStatus, Registration } from "@/lib/types";
import { useRegistrations } from "@/store/useRegistrations";
import { useToast } from "@/store/useToast";
import { PinFill } from "@/components/ui/icons";
import { Poster } from "./Poster";

const STATUS: Record<EventStatus, { label: string; className: string }> = {
  upcoming: { label: "Terdaftar", className: "text-link" },
  ongoing: { label: "Berlangsung", className: "text-success" },
  ended: { label: "Selesai", className: "text-text-muted" },
};

interface TicketListCardProps {
  registration: Registration;
  event: EventItem;
  now: number;
}

export function TicketListCard({ registration, event, now }: TicketListCardProps) {
  const status = getEventStatus(event, now);
  const days = daysUntil(event.startAt, now);

  return (
    <article className="border-b border-border px-[19px] pb-[24px] pt-[20px]">
      <Link href={`/tiket/${registration.id}`} className="press flex gap-[18px]" aria-label={`Buka tiket ${event.title}`}>
        <div className="h-[120px] w-[83px] shrink-0 overflow-hidden rounded-[7px]">
          <Poster title={event.title} gradient={event.gradient} imageUrl={event.posterUrl} titleClassName="text-[10px]" sizes="83px" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="line-clamp-2 text-[19px] font-medium uppercase leading-[22px] text-text" title={fullTitle(event)}>
            {event.title}
          </h3>
          <div className="mt-[8px] space-y-[6px] text-[16px] leading-[19px] text-text">
            <p className="flex items-center gap-[6px]">
              <PinFill size={16} className="shrink-0 text-text-light" />
              <span className="truncate">{event.venue}</span>
            </p>
            <p className="text-text-muted">{formatDateMedium(event.startAt)}</p>
            <p className="font-bold">{formatTimeRange(event)}</p>
          </div>
          <p className={cx("mt-auto pt-[4px] text-right text-[18px] font-medium", STATUS[status].className)}>{STATUS[status].label}</p>
        </div>
      </Link>

      {status !== "ended" ? (
        <div className="mt-[14px] flex items-center justify-between gap-[12px] rounded-[8px] bg-section px-[12px] py-[8px]">
          <span className="text-[14px] font-medium text-text">
            {status === "ongoing" ? "Sedang berlangsung" : days <= 0 ? "Dimulai hari ini" : `Dimulai dalam ${days} hari`}
          </span>
          <Link
            href={`/tiket/${registration.id}`}
            className="press hit-y relative inline-flex h-[28px] shrink-0 items-center rounded-full bg-primary px-[12px] text-[13px] font-bold text-accent"
          >
            Lihat Tiket
          </Link>
        </div>
      ) : (
        <RatingBox registration={registration} />
      )}
    </article>
  );
}

function RatingBox({ registration }: { registration: Registration }) {
  const rate = useRegistrations((s) => s.rate);
  const toast = useToast((s) => s.show);
  const [hover, setHover] = useState(0);

  if (registration.rating) {
    return (
      <div className="mt-[14px] flex h-[44px] items-center gap-[8px] rounded-[10px] border border-border bg-notice-bg px-[14px]">
        <Star size={18} strokeWidth={0} fill="currentColor" className="text-rating" aria-hidden />
        <span className="text-[19px] font-bold text-text">{registration.rating}</span>
        <span className="text-[14px] text-text-muted">Nilaimu</span>
      </div>
    );
  }

  return (
    <div className="mt-[14px] flex items-center justify-between gap-[8px] rounded-[10px] border border-warn-border bg-warn-soft px-[14px] py-[8px]">
      <p className="text-[14px] font-medium text-text">Beri rating sesi ini</p>
      <div className="flex" role="group" aria-label="Beri rating 1 sampai 5 bintang" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} bintang`}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => {
              rate(registration.id, n);
              toast("Terima kasih atas penilaianmu!");
            }}
            className="press flex size-[36px] items-center justify-center"
          >
            <Star
              size={24}
              strokeWidth={0}
              fill="currentColor"
              className={cx("transition-colors duration-150", n <= hover ? "text-rating" : "text-nav-inactive")}
              aria-hidden
            />
          </button>
        ))}
      </div>
    </div>
  );
}
