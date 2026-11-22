import { useProfile } from "@/store/useProfile";
import { useRegistrations } from "@/store/useRegistrations";
import { useSaved } from "@/store/useSaved";
import type { Registration } from "./types";

/** Kunci localStorage dari versi lama (alur jual-beli tiket). */
const LEGACY_KEYS = ["eventku-orders", "eventku-cart", "eventku-prefs"];

/** ID pesanan contoh (seed) di versi lama; bukan pendaftaran asli, jadi tidak dipindahkan. */
const LEGACY_SEED_IDS = new Set(["1760063400123", "1760149800456"]);

type LegacyOrder = {
  id?: string;
  event?: { slug?: string };
  participant?: { name?: string; prodi?: string } | null;
  createdAt?: string;
  rating?: number | null;
};

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as { state?: T }).state ?? null : null;
  } catch {
    return null;
  }
}

/**
 * Pindahkan data versi lama ke store baru (sekali jalan), lalu hapus kunci lamanya.
 * - pesanan → pendaftaran (nama & prodi dari data peserta; rating skala 10 → 5)
 * - event tersimpan → useSaved
 * - data peserta terakhir → useProfile
 */
export function migrateLegacyStorage(): void {
  if (typeof window === "undefined") return;
  let found = false;
  try {
    found = LEGACY_KEYS.some((k) => localStorage.getItem(k) !== null);
  } catch {
    return;
  }
  if (!found) return;

  const orders = read<{ orders?: LegacyOrder[] }>("eventku-orders")?.orders ?? [];
  const regs: Registration[] = orders
    .filter((o) => o.id && o.event?.slug && !LEGACY_SEED_IDS.has(o.id))
    .map((o) => ({
      id: o.id!,
      eventSlug: o.event!.slug!,
      name: o.participant?.name ?? "",
      prodi: o.participant?.prodi ?? "",
      registeredAt: o.createdAt ?? new Date().toISOString(),
      rating: typeof o.rating === "number" ? Math.max(1, Math.min(5, Math.round(o.rating / 2))) : undefined,
    }));
  const { add } = useRegistrations.getState();
  regs.forEach(add);

  const prefs = read<{ saved?: string[]; participant?: { name?: string; prodi?: string } | null }>("eventku-prefs");
  if (prefs?.saved?.length) {
    const current = useSaved.getState().saved;
    useSaved.setState({ saved: [...new Set([...current, ...prefs.saved])] });
  }
  if (prefs?.participant?.name && !useProfile.getState().remember) {
    useProfile.getState().setProfile({ name: prefs.participant.name, prodi: prefs.participant.prodi ?? "" });
  }

  try {
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* abaikan */
  }
}
