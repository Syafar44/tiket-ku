import "server-only";
import { cache } from "react";
import { events as localEvents } from "@/data/events";
import { HELP_WHATSAPP, ORGANIZER, PRODI_OPTIONS, PRODI_OTHER } from "./config";
import { fetchSheetData } from "./sheets";
import { getEventStatus } from "./time";
import type { EventItem, SiteConfig } from "./types";

/*
 * Satu-satunya pintu akses data event & config.
 * Sumber utama: Google Spreadsheet (lib/sheets.ts, cache 60 detik).
 * Kalau gagal (env kosong, timeout, error): data lokal `data/events.ts` + `lib/config.ts`.
 */

type SiteData = { events: EventItem[]; config: SiteConfig };

const byStart = (a: EventItem, b: EventItem) => Date.parse(a.startAt) - Date.parse(b.startAt);

/** Pilihan "Lainnya" (input teks bebas) selalu ada dan selalu terakhir. */
function withOther(options: string[]): string[] {
  return [...options.filter((p) => p !== PRODI_OTHER), PRODI_OTHER];
}

const LOCAL: SiteData = {
  events: [...localEvents].sort(byStart),
  config: { ...ORGANIZER, prodiOptions: withOther(PRODI_OPTIONS), helpWhatsapp: HELP_WHATSAPP || undefined },
};

/** Satu log per gangguan: dicetak saat mulai gagal, di-reset saat spreadsheet pulih. */
let usingFallback = false;

const loadData = cache(async (): Promise<SiteData> => {
  try {
    const { events, config } = await fetchSheetData();
    usingFallback = false;
    return { events: [...events].sort(byStart), config: { ...config, prodiOptions: withOther(config.prodiOptions) } };
  } catch (err) {
    if (!usingFallback) {
      usingFallback = true;
      console.error("[EventKu] Gagal mengambil data spreadsheet, memakai data lokal:", err instanceof Error ? err.message : err);
    }
    return LOCAL;
  }
});

/** Semua event, urut dari yang paling awal. */
export async function getEvents(): Promise<EventItem[]> {
  return (await loadData()).events;
}

export async function getEventBySlug(slug: string): Promise<EventItem | undefined> {
  return (await loadData()).events.find((e) => e.slug === slug);
}

export async function getSiteConfig(): Promise<SiteConfig> {
  return (await loadData()).config;
}

/** Event yang belum selesai (akan datang & sedang berlangsung). */
export function activeEvents(list: EventItem[], now: number | Date = Date.now()): EventItem[] {
  return list.filter((e) => getEventStatus(e, now) !== "ended");
}
