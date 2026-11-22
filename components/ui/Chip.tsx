import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/format";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** pill = Beranda (21px), box = Tiket Saya (30px, radius 5) */
  variant?: "pill" | "box";
  selected?: boolean;
}

export function Chip({ variant = "pill", selected = false, className, children, ...rest }: ChipProps) {
  const base =
    variant === "pill"
      ? "h-[21px] rounded-full border px-[10px] text-[13px] font-medium"
      : "h-[30px] rounded-[5px] border-[1.3px] px-[16px] text-[15px] font-bold";
  const state = selected
    ? "border-link text-link"
    : variant === "pill"
      ? "border-border-strong text-text"
      : "border-border-strong text-text shadow-[0_2px_4px_rgba(0,0,0,0.07)]";
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(
        "press hit-y relative inline-flex shrink-0 items-center justify-center whitespace-nowrap bg-white leading-none duration-200",
        base,
        state,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
