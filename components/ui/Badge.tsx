import type { ReactNode } from "react";
import { cx } from "@/lib/format";
import type { EventTrack } from "@/lib/types";

/** Badge info kecil abu (gaya badge usia), mis. "60 MNT". */
export function MetaBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center rounded-[2px] bg-disabled-bg px-[4px] py-[1px] text-[10px] font-bold uppercase leading-[12px] text-text-light",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Badge emas di poster, mis. "GRATIS". */
export function GoldBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-[6px] bg-[linear-gradient(90deg,#C9953E,#EBC67E)] px-[8px] py-[3px] text-[12px] font-bold uppercase leading-[14px] text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

const TRACK_STYLE: Record<EventTrack, string> = {
  Achiever: "bg-accent text-primary",
  "Rising Star": "bg-link-soft text-link",
};

/** Badge jalur GSA: Achiever (emas, teks navy) / Rising Star (biru muda, teks biru). */
export function TrackBadge({ track, className }: { track: EventTrack; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-[6px] px-[7px] py-[3px] text-[11.5px] font-bold leading-[14px]",
        TRACK_STYLE[track],
        className,
      )}
    >
      {track}
    </span>
  );
}
