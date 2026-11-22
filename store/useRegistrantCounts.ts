import { create } from "zustand";
import type { EventItem } from "@/lib/types";

interface RegistrantCountsState {
  /** slug → jumlah pendaftar terbaru setelah user ini mendaftar (hanya di memori). */
  counts: Record<string, number>;
  set: (slug: string, count: number) => void;
}

/**
 * Jumlah pendaftar yang diperbarui secara lokal setelah berhasil daftar,
 * sebelum data spreadsheet (cache 60 detik) ikut ter-update. Tidak disimpan ke localStorage.
 */
export const useRegistrantCounts = create<RegistrantCountsState>()((set) => ({
  counts: {},
  set: (slug, count) => set((s) => ({ counts: { ...s.counts, [slug]: count } })),
}));

/** Angka terbesar antara data server dan pembaruan lokal. 0 = sembunyikan. */
export function useRegistrantCount(event: Pick<EventItem, "slug" | "registrantCount">): number {
  const local = useRegistrantCounts((s) => s.counts[event.slug]);
  return Math.max(event.registrantCount ?? 0, local ?? 0);
}
