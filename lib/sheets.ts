import "server-only";
import { z } from "zod";
import { EVENT_TRACKS, type EventItem, type SiteConfig } from "./types";

/*
 * Klien Google Apps Script Web App (spreadsheet EventKu). Hanya berjalan di server:
 * SHEETS_API_URL & SHEETS_API_TOKEN tidak boleh sampai ke browser.
 */

export const SHEETS_TAG = "sheets";

const FETCH_TIMEOUT_MS = 8000;
const REGISTER_TIMEOUT_MS = 15000;

/** Host gambar yang diizinkan (harus sama dengan images.remotePatterns di next.config.ts). */
const IMAGE_HOSTS = ["res.cloudinary.com"];

/**
 * Link gambar langsung dari Cloudinary, mis. https://res.cloudinary.com/<cloud>/image/upload/v1/poster.jpg.
 * http diubah ke https. Link lain (halaman console/share Cloudinary, Google Drive, dll.) → undefined,
 * supaya poster kembali ke gradien alih-alih membuat halaman error.
 */
function normalizeImageUrl(value: string): string | undefined {
  try {
    const url = new URL(value.trim());
    if (url.protocol === "http:") url.protocol = "https:";
    if (url.protocol !== "https:" || !IMAGE_HOSTS.includes(url.hostname)) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

/** Sel kosong di sheet bisa datang sebagai "" atau null → anggap tidak diisi. */
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === "" || v === null ? undefined : v), schema.optional());

const isoDate = z.string().refine((s) => !Number.isNaN(Date.parse(s)), "tanggal ISO tidak valid");

const eventSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: optional(z.string()),
  category: z.string().trim().min(1),
  // Belum diisi / tidak dikenal → "Rising Star" (sama dengan data lokal cadangan).
  track: z.enum(EVENT_TRACKS).catch("Rising Star"),
  // Sel checkbox/teks di sheet: TRUE/FALSE, "ya"/"tidak", 1/0. Kosong → false.
  featured: z.boolean().catch(false),
  startAt: isoDate,
  endAt: isoDate,
  venue: z.string().min(1),
  mapsUrl: optional(z.string()),
  audience: z.string(),
  description: z.string(),
  learnings: z.array(z.string()),
  bring: z.array(z.string()),
  speaker: z.object({ name: z.string(), role: z.string() }),
  gradient: z.tuple([z.string(), z.string()]),
  posterUrl: optional(z.string()),
  eventId: optional(z.string()),
  presenceFormUrl: optional(z.string()),
  materialsUrl: optional(z.string()),
  waGroupUrl: optional(z.string()),
  registrantCount: optional(z.coerce.number().int().min(0)),
}) satisfies z.ZodType<EventItem>;

const configSchema = z.object({
  gsaName: z.string().min(1),
  gsaRole: z.string(),
  gsaId: z.string().min(1),
  city: z.string(),
  prodiOptions: z.array(z.string().min(1)).min(1),
  // Sel angka di sheet (mis. 6281234567890) datang sebagai number → jadikan teks.
  helpWhatsapp: optional(z.union([z.string(), z.number()]).transform(String)),
}) satisfies z.ZodType<SiteConfig>;

const eventsResponseSchema = z.union([
  // Tiap event divalidasi terpisah supaya satu baris rusak tidak menjatuhkan semua event.
  z.object({ ok: z.literal(true), config: configSchema, events: z.array(z.unknown()) }),
  z.object({ ok: z.literal(false), error: z.string().optional() }),
]);

const registerResponseSchema = z.union([
  z.object({
    ok: z.literal(true),
    registrationId: z.string(),
    registrantCount: optional(z.coerce.number().int().min(0)),
    duplicate: optional(z.boolean()),
  }),
  z.object({ ok: z.literal(false), error: z.string() }),
]);

export type SheetData = { config: SiteConfig; events: EventItem[] };
export type RegisterResult = z.infer<typeof registerResponseSchema>;

function credentials() {
  const url = process.env.SHEETS_API_URL;
  const token = process.env.SHEETS_API_TOKEN;
  if (!url || !token) throw new Error("SHEETS_API_URL / SHEETS_API_TOKEN belum diisi");
  return { url, token };
}

/**
 * Toleransi format sheet:
 * - Kolom lama `shortTitle` + `title` lengkap ("Judul: Subjudul") → `title` + `subtitle`.
 * - Waktu tanpa zona ("2026-11-28 16:00") dianggap WITA → "2026-11-28T16:00:00+08:00",
 *   supaya tidak bergeser mengikuti zona server (Vercel = UTC).
 */
export function adaptSheetRow(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const row = { ...(raw as Record<string, unknown>) };

  const short = typeof row.shortTitle === "string" ? row.shortTitle.trim() : "";
  if (!row.subtitle && short && typeof row.title === "string") {
    const full = row.title.trim();
    if (full.startsWith(short)) row.subtitle = full.slice(short.length).replace(/^[\s:–—-]+/, "").trim() || undefined;
    row.title = short;
  }

  // track: terima variasi penulisan ("achiever", "Rising star", "rising_star").
  if (typeof row.track === "string") {
    const t = row.track.trim().toLowerCase().replace(/[\s_-]+/g, " ");
    row.track = t === "achiever" ? "Achiever" : t === "rising star" ? "Rising Star" : row.track;
  }
  // featured: sel sheet bisa berupa boolean, "TRUE"/"FALSE", "ya"/"tidak", atau 1/0.
  if (typeof row.featured === "string") row.featured = ["true", "ya", "yes", "y", "1"].includes(row.featured.trim().toLowerCase());
  else if (typeof row.featured === "number") row.featured = row.featured === 1;

  for (const key of ["startAt", "endAt"]) {
    const value = row[key];
    if (typeof value !== "string") continue;
    const m = value.trim().match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(:\d{2})?$/);
    if (m) row[key] = `${m[1]}T${m[2]}${m[3] ?? ":00"}+08:00`;
  }
  return row;
}

/** Baris rusak hanya dicatat sekali per isi kesalahan (respons di-cache, jadi parse berulang tiap request). */
const reportedRows = new Set<string>();
function reportOnce(msg: string) {
  if (reportedRows.has(msg)) return;
  reportedRows.add(msg);
  console.error(msg);
}

/** Ambil config & event published dari spreadsheet. Lempar error kalau gagal/tidak valid. */
export async function fetchSheetData(): Promise<SheetData> {
  const { url, token } = credentials();
  const endpoint = new URL(url);
  endpoint.searchParams.set("action", "events");
  endpoint.searchParams.set("token", token);

  // Pesan error sengaja tidak memuat URL (berisi token).
  const res = await fetch(endpoint, {
    next: { revalidate: 60, tags: [SHEETS_TAG] },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Spreadsheet API membalas HTTP ${res.status}`);

  const parsed = eventsResponseSchema.safeParse(await res.json());
  if (!parsed.success) throw new Error(`Respons spreadsheet tidak valid: ${z.prettifyError(parsed.error)}`);
  if (!parsed.data.ok) throw new Error(`Spreadsheet API: ${parsed.data.error ?? "ok: false"}`);

  const events: EventItem[] = [];
  const missing = (key: string) => parsed.data.ok && parsed.data.events.some((e) => !e || typeof e !== "object" || !(key in e));
  if (missing("track") || missing("featured")) {
    reportOnce('[EventKu] API events belum mengirim "track"/"featured" untuk sebagian event: memakai default track "Rising Star", featured false.');
  }
  parsed.data.events.forEach((raw, i) => {
    const row = eventSchema.safeParse(adaptSheetRow(raw));
    if (row.success) {
      const event = row.data;
      if (event.posterUrl) {
        const posterUrl = normalizeImageUrl(event.posterUrl);
        if (!posterUrl) {
          reportOnce(`[EventKu] posterUrl event "${event.slug}" diabaikan (harus link langsung https://res.cloudinary.com/...): ${event.posterUrl}`);
        }
        event.posterUrl = posterUrl;
      }
      events.push(event);
      return;
    }
    const slug = (raw as { slug?: unknown } | null)?.slug;
    reportOnce(`[EventKu] Event #${i + 1}${typeof slug === "string" ? ` (${slug})` : ""} dilewati: ${z.prettifyError(row.error)}`);
  });

  return { config: parsed.data.config, events };
}

/** Teruskan pendaftaran ke Apps Script (token ditambahkan di sini). */
export async function registerToSheet(input: { slug: string; name: string; prodi: string; registrationId: string }): Promise<RegisterResult> {
  const { url, token } = credentials();
  // Apps Script membalas POST dengan 302 → ikuti redirect. Content-Type harus text/plain (hindari preflight/penolakan).
  const res = await fetch(url, {
    method: "POST",
    redirect: "follow",
    cache: "no-store",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ token, action: "register", ...input }),
    signal: AbortSignal.timeout(REGISTER_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Spreadsheet API membalas HTTP ${res.status}`);

  const parsed = registerResponseSchema.safeParse(await res.json());
  if (!parsed.success) throw new Error(`Respons pendaftaran tidak valid: ${z.prettifyError(parsed.error)}`);
  return parsed.data;
}
