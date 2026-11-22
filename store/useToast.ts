import { create } from "zustand";

export interface ToastOptions {
  /** Ikon di kiri teks */
  icon?: "check";
  /** Jarak dari bawah layar (px), default 150 */
  bottom?: number;
}

interface ToastState extends ToastOptions {
  message: string | null;
  key: number;
  show: (message: string, options?: ToastOptions) => void;
  hide: () => void;
}

export const useToast = create<ToastState>()((set) => ({
  message: null,
  key: 0,
  show: (message, options) => set((s) => ({ message, key: s.key + 1, icon: options?.icon, bottom: options?.bottom })),
  hide: () => set({ message: null }),
}));
