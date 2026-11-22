/** Format tanggal & jam ada di `lib/time.ts` (selalu WITA). File ini hanya util umum. */

const numberFormat = new Intl.NumberFormat("id-ID");

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Inisial untuk avatar, mis. "Syafaruddin" → "S", "Rani Lestari" → "RL". */
export function initials(name: string, max = 2): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, max)
      .map((w) => w[0]!.toUpperCase())
      .join("") || "?"
  );
}
