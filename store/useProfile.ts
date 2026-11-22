import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "@/lib/types";

interface ProfileState extends Profile {
  /** Simpan nama & prodi (hanya dipanggil jika "Ingat data saya" dicentang). */
  setProfile: (p: { name: string; prodi: string }) => void;
  clearProfile: () => void;
}

const empty: Profile = { name: "", prodi: "", remember: false };

/** Data peserta di perangkat ini, untuk mengisi otomatis form daftar berikutnya. */
export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      ...empty,
      setProfile: ({ name, prodi }) => set({ name, prodi, remember: true }),
      clearProfile: () => set({ ...empty }),
    }),
    {
      name: "eventku-profile",
      version: 1,
      partialize: ({ name, prodi, remember }) => ({ name, prodi, remember }),
    },
  ),
);
