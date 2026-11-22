"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { Download, MessageCircle } from "lucide-react";
import { copyText } from "@/lib/clipboard";
import { ORGANIZER_LABEL } from "@/lib/config";
import { cx, initials } from "@/lib/format";
import { fullTitle } from "@/lib/event";
import { formatCountdown, formatSchedule, formatTime, getEventStatus } from "@/lib/time";
import type { EventItem, EventStatus, SiteConfig } from "@/lib/types";
import { useHydrated } from "@/lib/useHydrated";
import { useNow } from "@/lib/useNow";
import { useRegistrations } from "@/store/useRegistrations";
import { useToast } from "@/store/useToast";
import { AppBar } from "@/components/layout/AppBar";
import { BottomActionBar } from "@/components/layout/BottomActionBar";
import { StickyHeader } from "@/components/layout/StatusSafeArea";
import { CopyField } from "@/components/presensi/CopyField";
import { CtaButton, OutlinePillLink, PrimaryPillLink } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { PinFill, TicketFill } from "@/components/ui/icons";
import { TicketSkeleton } from "@/components/ui/Skeleton";
import { Poster } from "./Poster";
import checkBanner from "@/public/icons/check-22-success.svg";
import checkChipLink from "@/public/icons/check-12-link.svg";
import checkChipSuccess from "@/public/icons/check-12-success.svg";
import clockIcon from "@/public/icons/clock-22-gold.svg";
import copyAllIcon from "@/public/icons/copy-18-link.svg";
import lockSmall from "@/public/icons/lock-16.svg";

type CopyKey = "name" | "title" | "gsaId" | "eventId";

/** Toast di halaman ini muncul tepat di atas CTA (86px) + jarak 14px. */
const TOAST = { icon: "check" as const, bottom: 100 };

const STEPS = [
  "Tunggu sampai sesi selesai, formulir terbuka otomatis.",
  'Ketuk "Salin" pada tiap data, atau "Salin Semua Data".',
  "Buka formulir presensi, lalu tempel data ke kolom yang sesuai.",
];

const CHIP: Record<EventStatus, { label: string; bg: string; text: string; icon?: typeof checkChipLink }> = {
  upcoming: { label: "Terdaftar", bg: "bg-link-soft", text: "text-link", icon: checkChipLink },
  ongoing: { label: "Berlangsung", bg: "bg-success-soft", text: "text-success", icon: checkChipSuccess },
  ended: { label: "Selesai", bg: "bg-disabled-bg", text: "text-text-muted" },
};

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cx("w-full rounded-[12px] bg-white p-[16px]", className)}>{children}</section>;
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-[11.5px] font-bold uppercase tracking-[0.6px] text-text-muted">{children}</p>;
}

/** Detail Tiket "EventKu": info acara sebelum/selama sesi, dan presensi resmi setelah selesai. */
export function TicketDetailView({
  registrationId,
  events,
  organizer,
}: {
  registrationId: string;
  events: EventItem[];
  /** Dari `getSiteConfig()` (server). */
  organizer: Pick<SiteConfig, "gsaName" | "gsaRole" | "gsaId">;
}) {
  const hydrated = useHydrated();
  const now = useNow(1000);
  const registration = useRegistrations((s) => s.registrations.find((r) => r.id === registrationId));
  const toast = useToast((s) => s.show);
  const [copied, setCopied] = useState<CopyKey | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  if (!hydrated) return <TicketSkeleton />;

  const event = registration ? events.find((e) => e.slug === registration.eventSlug) : undefined;

  if (!registration || !event) {
    return (
      <main>
        <StickyHeader>
          <AppBar title="EventKu" backHref="/tiket" />
        </StickyHeader>
        <div className="px-[32px] py-[80px] text-center">
          <TicketFill size={48} className="mx-auto text-disabled-bg" />
          <p className="mt-[12px] text-[17px] font-bold text-text">{registration ? "Event sudah tidak tersedia" : "Tiket tidak ditemukan"}</p>
          <p className="mt-[6px] text-[15px] text-text-muted">Pendaftaran tersimpan per perangkat. Coba buka dari perangkat yang dipakai saat mendaftar.</p>
          <PrimaryPillLink href="/tiket" className="mt-[20px]">
            Ke Tiket Saya
          </PrimaryPillLink>
        </div>
      </main>
    );
  }

  const status = getEventStatus(event, now);
  const ended = status === "ended";
  const endTime = formatTime(event.endAt);
  const chip = CHIP[status];

  const copy = async (text: string, message: string, key?: CopyKey) => {
    if (await copyText(text)) {
      setCopied(key ?? null);
      toast(message, TOAST);
    } else {
      toast("Gagal menyalin", { bottom: TOAST.bottom });
    }
  };

  const fields: { key: CopyKey; label: string; value: string | undefined; accent: "link" | "success" | "danger"; message: string }[] = [
    { key: "title", label: "Judul Acara", value: fullTitle(event), accent: "link", message: "Judul acara disalin" },
    { key: "gsaId", label: "GSA ID", value: organizer.gsaId, accent: "success", message: "GSA ID disalin" },
    { key: "eventId", label: "Event ID", value: event.eventId, accent: "danger", message: "Event ID disalin" },
  ];

  const copyAll = () =>
    copy(
      [
        `Judul Acara: ${fullTitle(event)}`,
        `GSA ID: ${organizer.gsaId}`,
        `Event ID: ${event.eventId ?? "-"}`,
        `Nama GSA: ${organizer.gsaName}`,
      ].join("\n"),
      "Semua data disalin",
    );

  const openPresence = () => {
    if (event.presenceFormUrl) window.open(event.presenceFormUrl, "_blank", "noopener,noreferrer");
    else toast("Link presensi akan dibagikan di grup WhatsApp", { bottom: TOAST.bottom });
  };

  return (
    <main className="min-h-dvh bg-section pb-[150px]">
      <StickyHeader>
        <AppBar title="EventKu" backHref="/tiket" />
      </StickyHeader>

      {/* Header ringkas */}
      <section className="flex w-full items-start gap-[14px] bg-white px-[20px] py-[16px]">
        <div className="h-[80px] w-[56px] shrink-0 overflow-hidden rounded-[6px]">
          <Poster
            plain
            title={event.title}
            gradient={event.gradient}
            imageUrl={event.posterUrl}
            titleClassName="px-[5px] pb-[6px] text-[8px] leading-normal"
            sizes="56px"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <div className="flex w-full items-center">
            <p className="min-w-0 flex-1 text-[12px] font-medium uppercase leading-normal tracking-[1px] text-gold-text">{ORGANIZER_LABEL}</p>
            <span className={cx("flex shrink-0 items-center gap-[4px] rounded-[10px] px-[8px] py-[3px]", chip.bg)}>
              {chip.icon && <Image src={chip.icon} alt="" width={12} height={12} className="shrink-0" />}
              <span className={cx("whitespace-nowrap text-[12px] font-bold leading-normal", chip.text)}>{chip.label}</span>
            </span>
          </div>
          <p className="text-[15px] font-bold leading-[19px] text-text">{event.title}</p>
          {event.subtitle && <p className="text-[13px] leading-[17px] text-text">{event.subtitle}</p>}
          <p className="text-[13px] leading-normal text-text-muted">{formatSchedule(event)}</p>
        </div>
      </section>

      <div className="flex w-full flex-col gap-[10px] px-[20px] pt-[12px]">
        {!ended && (
          <>
            {/* Hitung mundur */}
            <Card className="text-center">
              {status === "upcoming" ? (
                <>
                  <p className="text-[13px] text-text-muted">Dimulai dalam</p>
                  <p className="mt-[2px] text-[28px] font-bold tabular-nums leading-[34px] text-link" aria-live="off">
                    {formatCountdown(Date.parse(event.startAt) - now)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[24px] font-bold leading-[30px] text-success">Sedang berlangsung</p>
                  <p className="mt-[2px] text-[13px] text-text-muted">Selesai pukul {endTime} WITA</p>
                </>
              )}
            </Card>

            {/* Lokasi & peserta */}
            <Card>
              <Label>Lokasi</Label>
              <p className="mt-[4px] flex items-start gap-[6px] text-[15px] font-medium leading-[20px] text-text">
                <PinFill size={16} className="mt-[2px] shrink-0 text-text-light" />
                {event.venue}
              </p>
              {event.mapsUrl && (
                <OutlinePillLink href={event.mapsUrl} external className="mt-[10px]">
                  <PinFill size={16} />
                  Lihat Lokasi
                </OutlinePillLink>
              )}
              <div aria-hidden className="my-[14px] h-px bg-border" />
              <Label>Peserta</Label>
              <p className="mt-[4px] text-[15px] font-medium leading-[20px] text-text">
                {registration.name || "—"}
                {registration.prodi && <span className="font-normal text-text-muted"> · {registration.prodi}</span>}
              </p>
            </Card>

            {event.waGroupUrl && (
              <a
                href={event.waGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="press flex w-full items-center justify-center gap-[8px] rounded-[22px] bg-success px-[16px] py-[11px] text-[15px] font-bold leading-normal text-white"
              >
                <MessageCircle size={18} aria-hidden />
                Gabung Grup WhatsApp
              </a>
            )}
          </>
        )}
      </div>

      {/* Presensi resmi */}
      <div className="flex w-full flex-col gap-[4px] px-[20px] pb-[12px] pt-[22px]">
        <h2 className="text-[26px] font-bold leading-normal text-text">
          PRESENSI <span className="text-link">RESMI</span>
        </h2>
        <p className="text-[14px] leading-[19px] text-text-muted">
          {ended ? "Salin data di bawah, lalu isi formulir presensi resmi GSA." : "Siapkan data di bawah untuk mengisi formulir presensi setelah sesi selesai."}
        </p>
      </div>

      <div className="flex w-full flex-col gap-[10px] px-[20px]">
        <div
          className={cx(
            "flex w-full items-center gap-[12px] rounded-[10px] border px-[14px] py-[12px]",
            ended ? "border-success-soft bg-success-soft" : "border-warn-border bg-warn-soft",
          )}
        >
          <Image src={ended ? checkBanner : clockIcon} alt="" width={22} height={22} className="shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-[2px] leading-normal">
            <p className="text-[14px] font-bold text-text">
              {ended ? "Sesi selesai, formulir presensi sudah dibuka" : `Formulir dibuka setelah sesi selesai · ${endTime} WITA`}
            </p>
            {!ended && (
              <p className="text-[13px] tabular-nums text-text-muted">dibuka dalam {formatCountdown(Date.parse(event.endAt) - now)}</p>
            )}
          </div>
        </div>

        {/* Nama GSA penyelenggara */}
        <div className="flex w-full items-center gap-[14px] rounded-[12px] bg-white p-[16px]">
          <span aria-hidden className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-link-soft text-[20px] font-bold text-link">
            {initials(organizer.gsaName, 1)}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-[2px] leading-normal">
            <p className="text-[11.5px] font-bold tracking-[0.6px] text-text-muted">NAMA GSA PENYELENGGARA</p>
            <p className="text-[20px] font-bold text-link">{organizer.gsaName}</p>
            <p className="text-[13px] text-text-muted">{organizer.gsaRole}</p>
          </div>
          <CopyButton copied={copied === "name"} onClick={() => copy(organizer.gsaName, "Nama GSA disalin", "name")} label="nama GSA" />
        </div>

        {fields.map((f) => (
          <CopyField
            key={f.key}
            label={f.label}
            value={f.value ?? "Belum tersedia"}
            accent={f.accent}
            copied={copied === f.key}
            onCopy={f.value ? () => copy(f.value!, f.message, f.key) : undefined}
          />
        ))}

        <button
          type="button"
          onClick={copyAll}
          className="press flex w-full items-center justify-center gap-[8px] rounded-[22px] border-[1.3px] border-link bg-white px-[16px] py-[11px]"
        >
          <Image src={copyAllIcon} alt="" width={18} height={18} className="shrink-0" />
          <span className="whitespace-nowrap text-[15px] font-bold leading-normal text-link">Salin Semua Data</span>
        </button>

        {/* Formulir presensi */}
        <Card className="flex flex-col items-center gap-[12px] px-[16px] py-[20px]">
          <h3 className="w-full text-center text-[16px] font-bold leading-normal text-text">Formulir Presensi Peserta</h3>
          {ended ? (
            event.presenceFormUrl ? (
              <a
                href={event.presenceFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="press flex w-full items-center justify-center rounded-[22px] bg-link px-[20px] py-[11px] text-[15px] font-bold leading-normal text-white"
              >
                Buka Formulir Presensi
              </a>
            ) : (
              <p className="text-center text-[14px] leading-[19px] text-text-muted">Link presensi akan dibagikan di grup WhatsApp.</p>
            )
          ) : (
            <>
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-center gap-[8px] rounded-[22px] bg-disabled-bg px-[20px] py-[11px]"
              >
                <Image src={lockSmall} alt="" width={16} height={16} className="shrink-0" />
                <span className="whitespace-nowrap text-[15px] font-bold leading-normal text-text-disabled">Buka Formulir Presensi</span>
              </button>
              <p className="text-center text-[13px] text-text-muted">Tombol aktif setelah sesi selesai pukul {endTime} WITA.</p>
            </>
          )}
        </Card>

        {/* Cara mengisi */}
        <Card className="flex flex-col gap-[12px]">
          <h3 className="text-[15px] font-bold leading-normal text-text">Cara mengisi presensi</h3>
          <ol className="flex flex-col gap-[12px]">
            {STEPS.map((s, i) => (
              <li key={s} className="flex w-full items-start gap-[10px]">
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-link-soft text-[12px] font-bold leading-normal text-link">
                  {i + 1}
                </span>
                <p className="min-w-0 flex-1 text-[14px] leading-[19px] text-text">{s}</p>
              </li>
            ))}
          </ol>
        </Card>

        {/* Materi (setelah selesai) */}
        {ended && (
          <Card>
            <h3 className="text-[15px] font-bold leading-normal text-text">Materi</h3>
            {event.materialsUrl ? (
              <a
                href={event.materialsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="press mt-[12px] flex w-full items-center justify-center gap-[8px] rounded-[22px] border-[1.3px] border-primary px-[16px] py-[11px] text-[15px] font-bold leading-normal text-primary"
              >
                <Download size={18} aria-hidden />
                Unduh Materi
              </a>
            ) : (
              <p className="mt-[6px] text-[14px] leading-[19px] text-text-muted">Materi akan dibagikan di grup WhatsApp.</p>
            )}
          </Card>
        )}
      </div>

      <BottomActionBar>
        <CtaButton withIcon={false} disabled={!ended} onClick={openPresence}>
          {ended ? "ISI FORMULIR PRESENSI" : `PRESENSI DIBUKA ${endTime} WITA`}
        </CtaButton>
      </BottomActionBar>
    </main>
  );
}
