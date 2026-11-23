/**
 * Data mock event. JANGAN impor file ini dari komponen.
 * Semua akses data lewat `getEvents()` / `getEventBySlug()` di `lib/data.ts`,
 * supaya sumbernya nanti bisa diganti ke Google Spreadsheet.
 */
import { ORGANIZER } from "@/lib/config";
import type { EventItem } from "@/lib/types";

const VENUE = "Ruang 2.14, Lantai 2, Gedung E UMKT";
const MAPS_UMKT = "https://www.google.com/maps/search/?api=1&query=Universitas%20Muhammadiyah%20Kalimantan%20Timur%2C%20Samarinda";
const SPEAKER = { name: ORGANIZER.gsaName, role: ORGANIZER.gsaRole };

/** Field bersama semua sesi workshop GSA. */
const base = {
  // Data cadangan tidak punya info jalur: semua dianggap Rising Star dan tidak featured.
  track: "Rising Star" as const,
  featured: false,
  venue: VENUE,
  mapsUrl: MAPS_UMKT,
  speaker: SPEAKER,
  // TODO: isi link Google Form presensi GSA per event (presenceFormUrl)
  // TODO: isi link grup WhatsApp per event (waGroupUrl)
  // TODO: isi link materi per event jika ada (materialsUrl)
};

export const events: EventItem[] = [
  {
    ...base,
    slug: "work-smart-study-smarter",
    title: "Work Smart, Study Smarter",
    subtitle: "Persiapan Ujian Efektif Tanpa Begadang dengan Gemini Notebook",
    category: "AI untuk Belajar",
    startAt: "2026-10-15T21:00:00+08:00",
    endAt: "2026-10-15T22:00:00+08:00",
    audience: "Mahasiswa TI Kelas Malam",
    description:
      "Musim ujian sering berarti begadang dan membaca ulang materi tanpa arah. Di sesi ini kita memakai Gemini Notebook untuk mengubah materi kuliah menjadi ringkasan, audio, dan kuis latihan. Belajar jadi lebih terarah tanpa harus begadang.",
    learnings: [
      "Mengunggah & mengelola materi kuliah (PDF/slide) di Gemini Notebook",
      "Memakai Audio Overview & ringkasan pintar",
      "Membuat kuis latihan mandiri untuk persiapan ujian",
    ],
    bring: ["Laptop atau HP", "Materi kuliah (PDF/slide)"],
    gradient: ["#1A2C50", "#4C6FBF"],
    eventId: "EV#20414",
    registrantCount: 15,
  },
  {
    ...base,
    slug: "coding-101-with-ai",
    title: "Coding 101 with AI",
    subtitle: "Membangun Fundamental Pemrograman Interaktif dengan Gemini Canvas",
    category: "Coding",
    startAt: "2026-10-16T16:00:00+08:00",
    endAt: "2026-10-16T17:00:00+08:00",
    audience: "Mahasiswa TI semester 1 (Kelas Internasional)",
    description:
      "Logika pemrograman di semester awal sering terasa abstrak. Sesi ini mengenalkan Gemini Canvas sebagai tutor yang bisa menjelaskan, menjalankan, dan membantu memperbaiki kode secara interaktif, sekaligus mengenal program Google Student Ambassador Indonesia.",
    learnings: [
      "Mengenal program GSA Indonesia",
      "Memakai Gemini Canvas sebagai tutor pemrograman",
      "Debugging dengan fitur highlight",
      "Mengubah pseudocode ke bahasa pemrograman",
    ],
    bring: ["Laptop"],
    gradient: ["#0F3B5F", "#1FA2A6"],
    eventId: "EV#20415",
    registrantCount: 15,
  },
  {
    ...base,
    slug: "riset-cerdas",
    title: "Riset Cerdas",
    subtitle: "Menyusun Makalah Berbasis Sumber Terpercaya dengan Gemini Deep Research",
    category: "Riset",
    startAt: "2026-11-28T16:00:00+08:00",
    endAt: "2026-11-28T17:00:00+08:00",
    audience: "Mahasiswa non-TI (Manajemen, Akuntansi, Psikologi, Kesehatan)",
    description:
      "Tugas makalah menuntut sumber yang kredibel, bukan sekadar hasil pencarian pertama. Di sesi ini kamu belajar merumuskan pertanyaan riset, memakai Gemini Deep Research untuk menelusuri sumber, lalu memverifikasi dan mengutipnya dengan etis.",
    learnings: [
      "Mengenal program GSA Indonesia",
      "Merumuskan pertanyaan riset & memakai Deep Research",
      "Memverifikasi kredibilitas sumber",
      "Etika AI & cara menghindari plagiarisme",
    ],
    bring: ["Laptop atau HP", "Topik tugas sendiri"],
    gradient: ["#0D4D3A", "#5FBF8A"],
    eventId: "EV#20418",
    registrantCount: 9,
  },
  {
    ...base,
    slug: "from-idea-to-prototype",
    title: "From Idea to Prototype",
    subtitle: "Membangun Aplikasi AI Pertamamu dengan Google AI Studio dan Gemini API",
    category: "Coding",
    startAt: "2026-11-30T16:00:00+08:00",
    endAt: "2026-11-30T17:00:00+08:00",
    audience: "Mahasiswa TI yang sudah paham dasar pemrograman",
    description:
      "Punya ide aplikasi tapi bingung mulai dari mana? Sesi hands-on ini membawamu dari merancang prompt di Google AI Studio, membuat API key, sampai memanggil Gemini API dari kode hingga jadi prototype sederhana.",
    learnings: [
      "Mengenal ekosistem developer Google lewat GSA",
      "Merancang & menguji prompt di Google AI Studio",
      "Membuat API key & memanggil Gemini API dari kode",
      "Alur dari ide sampai prototype",
    ],
    bring: ["Laptop (wajib, sesi hands-on)"],
    gradient: ["#2E2A6E", "#E0567B"],
    eventId: "EV#20419",
    registrantCount: 13,
  },
  {
    ...base,
    slug: "siap-kerja-dengan-ai",
    title: "Siap Kerja dengan AI",
    subtitle: "Menyusun CV dan Simulasi Interview Menggunakan Gemini Gems",
    category: "Karier",
    startAt: "2026-12-02T16:00:00+08:00",
    endAt: "2026-12-02T17:00:00+08:00",
    audience: "Mahasiswa tingkat akhir semua prodi",
    description:
      "Menjelang lulus, CV yang rapi dan latihan interview jadi bekal penting. Di sesi ini kamu membuat Gem kustom di Gemini untuk mereview CV dan berperan sebagai pewawancara, lalu berlatih simulasi interview secara berpasangan.",
    learnings: [
      "Mengenal program GSA Indonesia",
      "Membuat Gem kustom di Gemini",
      "Gem “Reviewer CV” untuk memperbaiki CV",
      "Gem “Interviewer” + simulasi interview berpasangan",
    ],
    bring: ["Laptop atau HP", "Draf CV"],
    gradient: ["#3A1F0F", "#F2994A"],
    eventId: "EV#20420",
    registrantCount: 4,
  },
];
