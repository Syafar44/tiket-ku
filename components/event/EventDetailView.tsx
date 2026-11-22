"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Backpack, Check, ChevronLeft, Heart, Share2 } from "lucide-react";
import { formatNumber, initials } from "@/lib/format";
import { fullTitle } from "@/lib/event";
import { formatCountdownWords, formatSchedule, getEventStatus } from "@/lib/time";
import type { EventItem } from "@/lib/types";
import { useHydrated } from "@/lib/useHydrated";
import { useNow } from "@/lib/useNow";
import { useRegistrantCount } from "@/store/useRegistrantCounts";
import { findRegistration, useRegistrations } from "@/store/useRegistrations";
import { useSaved } from "@/store/useSaved";
import { useToast } from "@/store/useToast";
import { BottomActionBar } from "@/components/layout/BottomActionBar";
import { CtaButton } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { EventInfoCard } from "./EventInfoCard";
import { Poster } from "./Poster";
import { RegisterSheet } from "./RegisterSheet";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-[17px] font-bold text-text">{title}</h2>
      <div className="mt-[10px]">{children}</div>
    </section>
  );
}

export function EventDetailView({ event, prodiOptions }: { event: EventItem; prodiOptions: string[] }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const now = useNow(1000);
  const isSaved = useSaved((s) => s.saved.includes(event.slug));
  const toggleSaved = useSaved((s) => s.toggle);
  const registration = useRegistrations((s) => findRegistration(s.registrations, event.slug));
  const toast = useToast((s) => s.show);
  const registrantCount = useRegistrantCount(event);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Waktu & data perangkat baru dipakai setelah hydration supaya HTML server dan klien sama.
  const status = hydrated ? getEventStatus(event, now) : null;
  const saved = hydrated && isSaved;
  const reg = hydrated ? registration : undefined;

  const stripText =
    status === "upcoming"
      ? `DIMULAI DALAM ${formatCountdownWords(Date.parse(event.startAt) - now)}`
      : status === "ongoing"
        ? "SEDANG BERLANGSUNG"
        : status === "ended"
          ? "ACARA SUDAH SELESAI"
          : "GRATIS UNTUK SEMUA MAHASISWA";

  const goBack = () => (window.history.length > 1 ? router.back() : router.push("/"));

  const share = async () => {
    const url = window.location.href;
    const text = `${fullTitle(event)}\n${formatSchedule(event)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, text, url });
        return;
      }
    } catch {
      return; // dibatalkan pengguna
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank", "noopener,noreferrer");
  };

  const cta = !status
    ? { label: "DAFTAR SEKARANG", disabled: true, onClick: undefined }
    : reg
      ? { label: "LIHAT TIKET SAYA", disabled: false, onClick: () => router.push(`/tiket/${reg.id}`) }
      : status === "ended"
        ? { label: "ACARA SUDAH SELESAI", disabled: true, onClick: undefined }
        : { label: "DAFTAR SEKARANG", disabled: false, onClick: () => setSheetOpen(true) };

  return (
    <main className="pb-[120px]">
      {/* Hero */}
      <div className="relative h-[201px] overflow-hidden">
        <Poster title={event.title} gradient={event.gradient} imageUrl={event.posterUrl} showTitle={false} sizes="393px" priority />
        <div aria-hidden className="absolute inset-0 bg-black/60" />
        <button
          type="button"
          onClick={goBack}
          aria-label="Kembali"
          className="press absolute left-[9px] top-[47px] flex size-[44px] items-center justify-center"
        >
          <span className="flex size-[26px] items-center justify-center rounded-full bg-primary text-white">
            <ChevronLeft size={18} strokeWidth={2.5} aria-hidden />
          </span>
        </button>
        <button
          type="button"
          onClick={share}
          aria-label="Bagikan event"
          className="press absolute right-[9px] top-[47px] flex size-[44px] items-center justify-center"
        >
          <span className="flex size-[26px] items-center justify-center rounded-full bg-primary text-white">
            <Share2 size={14} strokeWidth={2.5} aria-hidden />
          </span>
        </button>
      </div>

      <div className="-mt-[90px]">
        <EventInfoCard event={event} stripText={stripText} />
      </div>

      {/* Pendaftar & simpan */}
      <div className="flex items-center px-[6px] py-[10px]">
        {registrantCount ? (
          <>
            <div className="flex flex-1 flex-col items-center">
              <span className="text-[26px] font-medium leading-[30px] text-primary">{formatNumber(registrantCount)}</span>
              <span className="text-[12.5px] text-text-muted">Orang sudah daftar</span>
            </div>
            <div aria-hidden className="h-[34px] w-px bg-border" />
          </>
        ) : null}
        <button
          type="button"
          aria-pressed={saved}
          onClick={() => toast(toggleSaved(event.slug) ? "Event disimpan" : "Event dihapus dari simpanan")}
          className="press flex flex-1 flex-col items-start pl-[20px]"
        >
          <span className="flex items-center gap-[6px] text-[16px] font-medium text-text">
            <Heart size={21} className="text-danger" fill={saved ? "currentColor" : "none"} strokeWidth={2} aria-hidden />
            Simpan event
          </span>
          <span className="pl-[27px] text-[12.5px] text-text-muted">{saved ? "Tersimpan di perangkat ini" : "Untuk dilihat nanti"}</span>
        </button>
      </div>

      <Divider thick />

      <div className="space-y-[24px] px-[20px] py-[20px]">
        <Section title="Untuk siapa">
          <p className="text-[15px] leading-[22px] text-text">{event.audience}</p>
          <p className="mt-[4px] text-[13px] text-text-muted">Terbuka untuk semua mahasiswa.</p>
        </Section>

        <Section title="Yang akan kamu pelajari">
          <ul className="space-y-[10px]">
            {event.learnings.map((item) => (
              <li key={item} className="flex gap-[10px] text-[15px] leading-[21px] text-text">
                <span className="mt-[2px] flex size-[18px] shrink-0 items-center justify-center rounded-full bg-link-soft text-link">
                  <Check size={12} strokeWidth={3} aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Yang perlu dibawa">
          <ul className="space-y-[8px]">
            {event.bring.map((item) => (
              <li key={item} className="flex items-center gap-[10px] rounded-[8px] border border-warn-border bg-warn-soft px-[12px] py-[8px] text-[15px] text-text">
                <Backpack size={16} className="shrink-0 text-gold-text" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Tentang acara">
          <p className="text-[15px] leading-[22px] text-text">{event.description}</p>
        </Section>

        <Section title="Pemateri">
          <div className="flex items-center gap-[12px]">
            <span
              aria-hidden
              className="flex size-[48px] shrink-0 items-center justify-center rounded-full text-[17px] font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${event.gradient[0]}, ${event.gradient[1]})` }}
            >
              {initials(event.speaker.name)}
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-text">{event.speaker.name}</p>
              <p className="text-[13.5px] text-text-muted">{event.speaker.role}</p>
            </div>
          </div>
        </Section>
      </div>

      <BottomActionBar>
        <CtaButton disabled={cta.disabled} onClick={cta.onClick}>
          {cta.label}
        </CtaButton>
      </BottomActionBar>

      <RegisterSheet event={event} prodiOptions={prodiOptions} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </main>
  );
}
