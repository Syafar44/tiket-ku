"use client";

import type { ReactNode } from "react";
import { formatNumber } from "@/lib/format";
import type { EventItem } from "@/lib/types";
import { useRegistrantCount } from "@/store/useRegistrantCounts";

/** "23 orang daftar" (ikut naik setelah user mendaftar). Kalau 0, tampilkan `fallback`. */
export function RegistrantCountLabel({ event, fallback }: { event: Pick<EventItem, "slug" | "registrantCount">; fallback: ReactNode }) {
  const count = useRegistrantCount(event);
  return count ? <>{formatNumber(count)} orang daftar</> : <>{fallback}</>;
}
