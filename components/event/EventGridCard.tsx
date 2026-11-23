import Link from "next/link";
import { fullTitle } from "@/lib/event";
import { durationMinutes, formatScheduleShort } from "@/lib/time";
import type { EventItem } from "@/lib/types";
import { MetaBadge, TrackBadge } from "@/components/ui/Badge";
import { Poster } from "./Poster";
import { RegistrantCountLabel } from "./RegistrantCountLabel";
import { SaveButton } from "./SaveButton";

/** Kartu grid 2 kolom: poster 170×254 radius 12 + info. */
export function EventGridCard({ event, ended = false }: { event: EventItem; ended?: boolean }) {
  return (
    <div className="relative min-w-0">
      <Link href={`/event/${event.slug}`} className="press block">
        <div className="relative aspect-[170/254] w-full overflow-hidden rounded-[12px]">
          <Poster title={event.title} gradient={event.gradient} imageUrl={event.posterUrl} titleClassName="text-[17px]" sizes="170px" />
          {ended && (
            <>
              <span aria-hidden className="absolute inset-0 bg-white/35" />
              <span className="absolute left-[10px] top-[10px] rounded-[6px] bg-text/75 px-[8px] py-[3px] text-[12px] font-bold leading-[14px] text-white">
                Selesai
              </span>
            </>
          )}
        </div>
        <TrackBadge track={event.track} className="mt-[10px]" />
        <h3 className="mt-[6px] line-clamp-2 text-[17px] font-semibold uppercase leading-[21px] text-text" title={fullTitle(event)}>
          {event.title}
        </h3>
        <p className="mt-[6px] text-[13.5px] leading-[18px] text-text-light">
          {event.category} · {formatScheduleShort(event)}
        </p>
        <p className="mt-[4px] flex items-center gap-[6px] text-[15px] font-medium text-link">
          {ended ? (
            <span className="text-text-muted">Acara sudah selesai</span>
          ) : (
            <RegistrantCountLabel event={event} fallback={<MetaBadge>{durationMinutes(event)} menit</MetaBadge>} />
          )}
        </p>
      </Link>
      <SaveButton slug={event.slug} title={event.title} className="absolute right-px top-px" />
    </div>
  );
}

export function EventGrid({ events }: { events: EventItem[] }) {
  if (events.length === 0) {
    return <p className="px-[20px] text-[14px] text-text-muted">Belum ada event minggu ini.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-x-[13px] gap-y-[24px] px-[20px]">
      {events.map((e) => (
        <EventGridCard key={e.slug} event={e} />
      ))}
    </div>
  );
}
