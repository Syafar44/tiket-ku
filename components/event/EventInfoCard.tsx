import type { ReactNode } from "react";
import { formatDateLong, formatTimeRange } from "@/lib/time";
import type { EventItem } from "@/lib/types";
import { TrackBadge } from "@/components/ui/Badge";
import { OutlinePillLink } from "@/components/ui/Button";
import { PinFill, TicketFill } from "@/components/ui/icons";
import { Poster } from "./Poster";

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start">
      <dt className="w-[78px] shrink-0 text-text-light">{label}</dt>
      <dd className="min-w-0 text-text">{children}</dd>
    </div>
  );
}

/**
 * Strip kuning (status/hitung mundur) + kartu info putih yang menimpanya.
 * `strip` = isi teks strip; dikirim sebagai komponen sendiri supaya tick hitung mundur tidak me-render ulang kartu.
 */
export function EventInfoCard({ event, strip }: { event: EventItem; strip: ReactNode }) {
  return (
    <div className="relative z-10 px-[20px]">
      <div className="flex h-[40px] items-start justify-center gap-[6px] rounded-[10px] bg-accent pt-[6px] text-primary" aria-live="off">
        <TicketFill size={16} />
        <span className="text-[13px] font-bold leading-[16px] tabular-nums">{strip}</span>
      </div>
      <div className="relative -mt-[13px] flex gap-[17px] rounded-[10px] border border-border bg-white px-[17px] py-[16px]">
        <div className="h-[144px] w-[95px] shrink-0 overflow-hidden rounded-[8px]">
          <Poster title={event.title} gradient={event.gradient} imageUrl={event.posterUrl} titleClassName="text-[12px]" sizes="95px" />
        </div>
        <div className="min-w-0 flex-1">
          <TrackBadge track={event.track} className="mb-[6px]" />
          <h1 className="text-[20px] font-bold leading-[24px] text-text">{event.title}</h1>
          <dl className="mt-[8px] space-y-[5px] text-[15px] leading-[17.6px]">
            <InfoRow label="Kategori">{event.category}</InfoRow>
            <InfoRow label="Tanggal">{formatDateLong(event.startAt)}</InfoRow>
            <InfoRow label="Waktu">{formatTimeRange(event)}</InfoRow>
            <InfoRow label="Lokasi">{event.venue}</InfoRow>
          </dl>
          {event.mapsUrl && (
            <OutlinePillLink href={event.mapsUrl} external className="mt-[12px]">
              <PinFill size={16} />
              Lihat Lokasi
            </OutlinePillLink>
          )}
        </div>
      </div>
    </div>
  );
}
