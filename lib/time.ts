import type { EventItem, EventStatus } from "./types";

/**
 * Semua perhitungan waktu memakai Asia/Makassar (WITA). Zona ini UTC+8 tanpa DST,
 * jadi cukup digeser 8 jam lalu dibaca dengan getUTC*, hasilnya sama di perangkat mana pun.
 */
const WITA_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAY_MS = 86_400_000;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const DAYS_LONG = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const pad2 = (n: number) => String(n).padStart(2, "0");

function wita(iso: string | number | Date) {
  const d = new Date(new Date(iso).getTime() + WITA_OFFSET_MS);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
    weekday: d.getUTCDay(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
  };
}

const ms = (t: number | Date) => (typeof t === "number" ? t : t.getTime());

export function getEventStatus(event: Pick<EventItem, "startAt" | "endAt">, now: number | Date): EventStatus {
  const t = ms(now);
  if (t < Date.parse(event.startAt)) return "upcoming";
  if (t < Date.parse(event.endAt)) return "ongoing";
  return "ended";
}

export function durationMinutes(event: Pick<EventItem, "startAt" | "endAt">): number {
  return Math.round((Date.parse(event.endAt) - Date.parse(event.startAt)) / 60_000);
}

/** "16:00" */
export function formatTime(iso: string): string {
  const p = wita(iso);
  return `${pad2(p.hour)}:${pad2(p.minute)}`;
}

/** "Sabtu, 28 Nov 2026" */
export function formatDateLong(iso: string): string {
  const p = wita(iso);
  return `${DAYS_LONG[p.weekday]}, ${p.day} ${MONTHS[p.month]} ${p.year}`;
}

/** "Sab, 28 Nov" */
export function formatDateShort(iso: string): string {
  const p = wita(iso);
  return `${DAYS_SHORT[p.weekday]}, ${p.day} ${MONTHS[p.month]}`;
}

/** "Sab, 28 Nov 2026" */
export function formatDateMedium(iso: string): string {
  const p = wita(iso);
  return `${DAYS_SHORT[p.weekday]}, ${p.day} ${MONTHS[p.month]} ${p.year}`;
}

/** "16:00–17:00 WITA" */
export function formatTimeRange(event: Pick<EventItem, "startAt" | "endAt">): string {
  return `${formatTime(event.startAt)}–${formatTime(event.endAt)} WITA`;
}

/** "Sabtu, 28 Nov 2026 · 16:00–17:00 WITA" */
export function formatSchedule(event: Pick<EventItem, "startAt" | "endAt">): string {
  return `${formatDateLong(event.startAt)} · ${formatTimeRange(event)}`;
}

/** "Sab, 28 Nov · 16:00" */
export function formatScheduleShort(event: Pick<EventItem, "startAt">): string {
  return `${formatDateShort(event.startAt)} · ${formatTime(event.startAt)}`;
}

/** Selisih hari kalender (WITA) dari sekarang ke tanggal mulai event. */
export function daysUntil(iso: string, now: number | Date): number {
  const dayIndex = (t: number) => Math.floor((t + WITA_OFFSET_MS) / DAY_MS);
  return dayIndex(Date.parse(iso)) - dayIndex(ms(now));
}

/** "2 hari 04:12:30" atau "04:12:30" */
export function formatCountdown(msLeft: number): string {
  const secs = Math.max(0, Math.floor(msLeft / 1000));
  const d = Math.floor(secs / 86_400);
  const clock = `${pad2(Math.floor((secs % 86_400) / 3600))}:${pad2(Math.floor((secs % 3600) / 60))}:${pad2(secs % 60)}`;
  return d > 0 ? `${d} hari ${clock}` : clock;
}

/** "6 HARI 4 JAM", "4 JAM 12 MENIT", atau "12 MENIT" */
export function formatCountdownWords(msLeft: number): string {
  const mins = Math.max(0, Math.ceil(msLeft / 60_000));
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  if (d > 0) return h > 0 ? `${d} HARI ${h} JAM` : `${d} HARI`;
  if (h > 0) return m > 0 ? `${h} JAM ${m} MENIT` : `${h} JAM`;
  return `${Math.max(m, 1)} MENIT`;
}
