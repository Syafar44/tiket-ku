import { useRegistrantCounts } from "@/store/useRegistrantCounts";
import { useRegistrations } from "@/store/useRegistrations";
import type { EventItem, Registration } from "./types";

const FALLBACK_MESSAGE = "Gagal mendaftar, coba lagi.";
const REQUEST_TIMEOUT_MS = 20000;

/** Gagal daftar; `message` sudah siap ditampilkan ke pengguna. */
export class RegistrationError extends Error {}

/**
 * ID pendaftaran (UUID v4). Dibuat sekali sebelum kirim dan dipakai ulang saat mencoba lagi,
 * supaya klik ganda tidak membuat baris dobel di spreadsheet.
 * `crypto.randomUUID` hanya ada di konteks aman (https/localhost), jadi ada cadangan untuk http di jaringan lokal.
 */
export function newRegistrationId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/**
 * Satu-satunya titik kirim data pendaftaran: POST ke /api/register (diteruskan ke spreadsheet).
 * Hanya kalau berhasil, pendaftaran disimpan di perangkat. Gagal → lempar `RegistrationError`.
 */
export async function submitRegistration(input: {
  event: EventItem;
  name: string;
  prodi: string;
  registrationId: string;
}): Promise<Registration> {
  const name = input.name.trim();
  const prodi = input.prodi.trim();

  let data: { ok?: boolean; error?: string; registrationId?: string; registrantCount?: number } | null = null;
  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: input.event.slug, name, prodi, registrationId: input.registrationId }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) throw new RegistrationError(data?.error || FALLBACK_MESSAGE);
  } catch (err) {
    // Offline / timeout / respons rusak → pesan umum.
    throw err instanceof RegistrationError ? err : new RegistrationError(FALLBACK_MESSAGE);
  }

  const registration: Registration = {
    id: data.registrationId || input.registrationId,
    eventSlug: input.event.slug,
    name,
    prodi,
    registeredAt: new Date().toISOString(),
  };
  useRegistrations.getState().add(registration);
  // Angka pendaftar di layar langsung naik tanpa menunggu revalidate.
  useRegistrantCounts.getState().set(input.event.slug, data.registrantCount ?? (input.event.registrantCount ?? 0) + 1);
  return registration;
}
