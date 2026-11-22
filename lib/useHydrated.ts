"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * false saat SSR & hydration, true setelahnya.
 * Dipakai supaya state dari localStorage (Zustand persist) tidak bikin hydration mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
