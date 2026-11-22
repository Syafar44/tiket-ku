import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedState {
  /** slug event yang disimpan */
  saved: string[];
  /** return true jika sekarang tersimpan */
  toggle: (slug: string) => boolean;
}

export const useSaved = create<SavedState>()(
  persist(
    (set, get) => ({
      saved: [],
      toggle: (slug) => {
        const has = get().saved.includes(slug);
        set({ saved: has ? get().saved.filter((s) => s !== slug) : [...get().saved, slug] });
        return !has;
      },
    }),
    {
      name: "eventku-saved",
      version: 1,
      partialize: (s) => ({ saved: s.saved }),
    },
  ),
);
