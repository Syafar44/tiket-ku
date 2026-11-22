import type { EventItem } from "./types";

/**
 * Judul resmi lengkap "Judul: Subjudul".
 * Dipakai untuk presensi GSA (kartu "Judul Acara" & "Salin Semua Data"), bagikan, dan metadata.
 */
export function fullTitle(event: Pick<EventItem, "title" | "subtitle">): string {
  return event.subtitle ? `${event.title}: ${event.subtitle}` : event.title;
}
