import type { EventCategory, EventItem } from "./types";

/**
 * Judul resmi lengkap "Judul: Subjudul".
 * Dipakai untuk presensi GSA (kartu "Judul Acara" & "Salin Semua Data"), bagikan, dan metadata.
 */
export function fullTitle(event: Pick<EventItem, "title" | "subtitle">): string {
  return event.subtitle ? `${event.title}: ${event.subtitle}` : event.title;
}

/**
 * Link wa.me untuk nomor bantuan. Menerima "0812-3456-7890", "+62 812…", "62812…".
 * Nomor kosong/tidak masuk akal → undefined (ikon bantuan disembunyikan).
 */
export function whatsappHelpUrl(number: string | undefined): string | undefined {
  let digits = (number ?? "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  if (digits.length < 9 || digits.length > 15) return undefined;
  return `https://wa.me/${digits}?text=${encodeURIComponent("Halo, saya butuh bantuan soal EventKu.")}`;
}

/** Kategori unik dari daftar event (untuk chip filter), urut abjad. Kategori baru di sheet otomatis ikut. */
export function categoriesOf(events: Pick<EventItem, "category">[]): EventCategory[] {
  return [...new Set(events.map((e) => e.category))].sort((a, b) => a.localeCompare(b, "id"));
}
