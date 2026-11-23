import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/format";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** pill = filter kategori (30px), box = kotak radius 5 (30px) */
  variant?: "pill" | "box";
  selected?: boolean;
}

/**
 * Chip filter. Bentuk yang terlihat 30px, tetapi tombolnya setinggi 44px
 * (padding atas-bawah transparan 7px) supaya area sentuh memenuhi minimum 44px.
 */
export function Chip({ variant = "pill", selected = false, className, children, ...rest }: ChipProps) {
  const shape =
    variant === "pill"
      ? "h-[30px] rounded-full border px-[14px] text-[14px] font-medium"
      : "h-[30px] rounded-[5px] border-[1.3px] px-[16px] text-[15px] font-bold";
  const state = selected
    ? "border-link bg-link-soft text-link"
    : variant === "pill"
      ? "border-border-strong bg-white text-text"
      : "border-border-strong bg-white text-text shadow-[0_2px_4px_rgba(0,0,0,0.07)]";
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx("press inline-flex min-h-[44px] shrink-0 items-center py-[7px]", className)}
      {...rest}
    >
      <span
        className={cx(
          "inline-flex items-center justify-center whitespace-nowrap leading-none transition-colors duration-200",
          shape,
          state,
        )}
      >
        {children}
      </span>
    </button>
  );
}
