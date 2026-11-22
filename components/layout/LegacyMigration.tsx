"use client";

import { useEffect } from "react";
import { migrateLegacyStorage } from "@/lib/legacyStorage";

/** Jalankan migrasi data localStorage versi lama sekali saat aplikasi dibuka. */
export function LegacyMigration() {
  useEffect(() => {
    migrateLegacyStorage();
  }, []);
  return null;
}
