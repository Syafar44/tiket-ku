import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Registration } from "@/lib/types";

interface RegistrationsState {
  registrations: Registration[];
  /** Tambah pendaftaran. Diabaikan jika event ini sudah didaftar di perangkat ini. */
  add: (r: Registration) => void;
  /** Rating 1–5 */
  rate: (id: string, rating: number) => void;
}

/** Pendaftaran di perangkat ini. Satu event hanya bisa didaftar sekali per perangkat. */
export const useRegistrations = create<RegistrationsState>()(
  persist(
    (set) => ({
      registrations: [],
      add: (r) =>
        set((s) => (s.registrations.some((x) => x.eventSlug === r.eventSlug) ? s : { registrations: [r, ...s.registrations] })),
      rate: (id, rating) => set((s) => ({ registrations: s.registrations.map((r) => (r.id === id ? { ...r, rating } : r)) })),
    }),
    {
      name: "eventku-registrations",
      version: 1,
      partialize: (s) => ({ registrations: s.registrations }),
    },
  ),
);

export function findRegistration(list: Registration[], eventSlug: string): Registration | undefined {
  return list.find((r) => r.eventSlug === eventSlug);
}
