"use client";

import { useEffect, useState } from "react";
import { getEventStatus } from "./time";
import type { EventItem, EventStatus } from "./types";

/** Batas setTimeout di browser (~24,8 hari); lebih dari itu dicek ulang saat timer habis. */
const MAX_TIMEOUT_MS = 2_147_000_000;

/**
 * Status event (akan datang / berlangsung / selesai) yang hanya me-render ulang saat status
 * benar-benar berubah (tepat di startAt dan endAt), bukan tiap detik.
 * `null` sebelum hydration, supaya HTML server dan klien sama.
 */
export function useEventStatus(event: Pick<EventItem, "startAt" | "endAt">): EventStatus | null {
  const [status, setStatus] = useState<EventStatus | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const now = Date.now();
    setStatus(getEventStatus(event, now));
    const next = [Date.parse(event.startAt), Date.parse(event.endAt)].find((t) => t > now);
    if (next === undefined) return;
    const timer = setTimeout(() => setTick((n) => n + 1), Math.min(next - now + 50, MAX_TIMEOUT_MS));
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cukup bergantung pada waktunya, bukan objek event
  }, [event.startAt, event.endAt, tick]);

  return status;
}
