import { cx } from "@/lib/format";

/** thick = pemisah 8px `surface`; default = garis 1px `border`. */
export function Divider({ thick, className }: { thick?: boolean; className?: string }) {
  return <div aria-hidden className={cx(thick ? "h-[8px] bg-surface" : "h-px bg-border", className)} />;
}
