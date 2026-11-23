"use client";

import { formatCountdownWords, getEventStatus } from "@/lib/time";
import type { EventItem } from "@/lib/types";
import { useHydrated } from "@/lib/useHydrated";
import { useNow } from "@/lib/useNow";

/**
 * Teks strip kuning di Detail Event ("DIMULAI DALAM 5 HARI 4 JAM", dst.).
 * Dipisah jadi komponen sendiri supaya tick tiap detik hanya me-render ulang teks ini,
 * bukan seluruh halaman detail atau form daftar di dalam sheet.
 */
export function EventStatusStrip({ event }: { event: Pick<EventItem, "startAt" | "endAt"> }) {
  const hydrated = useHydrated();
  const now = useNow(1000);
  if (!hydrated) return <>GRATIS UNTUK SEMUA MAHASISWA</>;

  const status = getEventStatus(event, now);
  if (status === "ongoing") return <>SEDANG BERLANGSUNG</>;
  if (status === "ended") return <>ACARA SUDAH SELESAI</>;
  return <>DIMULAI DALAM {formatCountdownWords(Date.parse(event.startAt) - now)}</>;
}
