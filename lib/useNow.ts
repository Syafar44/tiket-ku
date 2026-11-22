"use client";

import { useEffect, useState } from "react";

/** Waktu sekarang (epoch ms) yang diperbarui tiap `intervalMs`. Hanya untuk Client Component. */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
