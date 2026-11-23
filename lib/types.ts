export type EventCategory = "AI untuk Belajar" | "Coding" | "Riset" | "Karier";

export type EventStatus = "upcoming" | "ongoing" | "ended";

export type EventItem = {
  slug: string;
  /** Judul, mis. "Prompting 101 untuk Mahasiswa Baru" (dipakai di poster & kartu) */
  title: string;
  /** Subjudul, mis. "Menulis Perintah yang Efektif agar Gemini Menjadi Partner Belajar" */
  subtitle?: string;
  category: EventCategory;
  /** ISO dengan offset WITA, mis. "2026-11-28T16:00:00+08:00" */
  startAt: string;
  /** ISO */
  endAt: string;
  /** "Ruang 2.14, Lantai 2, Gedung E UMKT" */
  venue: string;
  mapsUrl?: string;
  /** "Untuk siapa" (informasi saja, bukan syarat) */
  audience: string;
  /** Latar belakang singkat */
  description: string;
  /** Yang akan dipelajari */
  learnings: string[];
  /** Yang perlu dibawa */
  bring: string[];
  speaker: { name: string; role: string };
  gradient: [string, string];
  posterUrl?: string;
  /** Event ID untuk presensi, mis. "EV#20418" */
  eventId?: string;
  /** Link Google Form presensi GSA */
  presenceFormUrl?: string;
  materialsUrl?: string;
  waGroupUrl?: string;
  /** Untuk social proof */
  registrantCount?: number;
};

export type Registration = {
  id: string;
  eventSlug: string;
  name: string;
  prodi: string;
  /** ISO */
  registeredAt: string;
  /** 1–5 */
  rating?: number;
};

/** Data penyelenggara & pilihan form (dari tab config spreadsheet, fallback `lib/config.ts`). */
export type SiteConfig = {
  gsaName: string;
  gsaRole: string;
  gsaId: string;
  city: string;
  /** Selalu diakhiri "Lainnya" */
  prodiOptions: string[];
  /** Nomor WhatsApp bantuan (opsional), mis. "081234567890" atau "6281234567890". Kosong = ikon bantuan disembunyikan. */
  helpWhatsapp?: string;
};

export type Profile = {
  name: string;
  prodi: string;
  remember: boolean;
};
