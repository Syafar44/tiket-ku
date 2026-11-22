"use client";

import Link from "next/link";
import { CalendarDays, Check, MapPin, MessageCircle } from "lucide-react";
import { formatSchedule } from "@/lib/time";
import type { EventItem } from "@/lib/types";
import { useHydrated } from "@/lib/useHydrated";
import { findRegistration, useRegistrations } from "@/store/useRegistrations";
import { StatusSafeArea } from "@/components/layout/StatusSafeArea";
import { PrimaryPillLink } from "@/components/ui/Button";
import { SuccessSkeleton } from "@/components/ui/Skeleton";

/** Halaman "Kamu terdaftar!" setelah konfirmasi pendaftaran. */
export function RegisterSuccessView({ event }: { event: EventItem }) {
  const hydrated = useHydrated();
  const registration = useRegistrations((s) => findRegistration(s.registrations, event.slug));

  if (!hydrated) return <SuccessSkeleton />;

  if (!registration) {
    return (
      <main className="px-[32px] text-center">
        <StatusSafeArea />
        <p className="pt-[80px] text-[17px] font-bold text-text">Kamu belum terdaftar di event ini</p>
        <p className="mt-[6px] text-[15px] text-text-muted">Buka detail event lalu tekan Daftar Sekarang.</p>
        <PrimaryPillLink href={`/event/${event.slug}`} className="mt-[20px]">
          Lihat Detail Event
        </PrimaryPillLink>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-section px-[20px] pb-[40px]">
      <StatusSafeArea />
      <div className="flex flex-col items-center pt-[40px] text-center">
        <span className="flex size-[88px] animate-pop-in items-center justify-center rounded-full bg-success-soft">
          <span className="flex size-[60px] items-center justify-center rounded-full bg-success text-white">
            <Check size={34} strokeWidth={3} aria-hidden />
          </span>
        </span>
        <h1 className="mt-[18px] text-[26px] font-bold text-text">Kamu terdaftar!</h1>
        <p className="mt-[4px] text-[15px] text-text-muted">
          {registration.name ? (
            <>
              Atas nama <span className="font-bold text-text">{registration.name}</span>
              {registration.prodi && <> · {registration.prodi}</>}
            </>
          ) : (
            "Pendaftaranmu sudah tersimpan."
          )}
        </p>
      </div>

      <section className="mt-[24px] rounded-[12px] bg-white p-[16px]">
        <p className="text-[12px] font-medium uppercase tracking-[1px] text-gold-text">{event.category}</p>
        <h2 className="mt-[4px] text-[17px] font-bold leading-[22px] text-text">{event.title}</h2>
        {event.subtitle && <p className="mt-[2px] text-[14px] leading-[19px] text-text-muted">{event.subtitle}</p>}
        <p className="mt-[10px] flex items-start gap-[8px] text-[14px] leading-[19px] text-text">
          <CalendarDays size={16} className="mt-[1px] shrink-0 text-text-light" aria-hidden />
          {formatSchedule(event)}
        </p>
        <p className="mt-[6px] flex items-start gap-[8px] text-[14px] leading-[19px] text-text">
          <MapPin size={16} className="mt-[1px] shrink-0 text-text-light" aria-hidden />
          {event.venue}
        </p>
      </section>

      <p className="mt-[14px] text-center text-[13.5px] leading-[19px] text-text-muted">
        Cukup datang tepat waktu. Presensi resmi diisi di akhir sesi lewat halaman tiket.
      </p>

      <div className="mt-[24px] flex flex-col gap-[10px]">
        {event.waGroupUrl && (
          <a
            href={event.waGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="press flex h-[48px] items-center justify-center gap-[8px] rounded-full bg-success text-[16px] font-bold text-white"
          >
            <MessageCircle size={20} aria-hidden />
            Gabung Grup WhatsApp
          </a>
        )}
        <Link
          href={`/tiket/${registration.id}`}
          className={
            event.waGroupUrl
              ? "press flex h-[48px] items-center justify-center rounded-full border-[1.5px] border-primary bg-white text-[16px] font-bold text-primary"
              : "press flex h-[48px] items-center justify-center rounded-full bg-primary text-[16px] font-bold text-accent"
          }
        >
          Lihat Tiket Saya
        </Link>
        <Link href="/" className="press flex min-h-[44px] items-center justify-center text-[15px] font-medium text-link">
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
