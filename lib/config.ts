import type { EventCategory } from "./types";

/** Penyelenggara tunggal semua event EventKu. */
export const ORGANIZER = {
  gsaName: "Syafaruddin",
  gsaRole: "Google Student Ambassador 2026",
  gsaId: "GSAID26B20024",
  city: "Samarinda",
};

/** Nomor WhatsApp bantuan cadangan saat spreadsheet tidak bisa diakses. Kosong = ikon bantuan disembunyikan. */
export const HELP_WHATSAPP = "";

/** Label kecil di header tiket & ringkasan event. */
export const ORGANIZER_LABEL = "GSA UMKT";

/** Pilihan program studi di form daftar. Kalau "Lainnya" dipilih, muncul input teks. */
export const PRODI_OPTIONS = [
  "Teknik Informatika",
  "Manajemen",
  "Akuntansi",
  "Psikologi",
  "Keperawatan",
  "Farmasi",
  "Kesehatan Masyarakat",
  "Lainnya",
];

export const PRODI_OTHER = "Lainnya";

export const EVENT_CATEGORIES: EventCategory[] = ["AI untuk Belajar", "Coding", "Riset", "Karier"];

/** Semua waktu event memakai zona ini (WITA, UTC+8, tanpa DST). */
export const TIME_ZONE = "Asia/Makassar";
