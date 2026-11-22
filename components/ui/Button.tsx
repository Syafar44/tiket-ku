import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/format";
import { TicketFill } from "./icons";

interface CtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Tampilkan ikon tiket di kiri teks */
  withIcon?: boolean;
}

/** CTA bawah: 50px, navy, teks kuning 17.5px Bold. */
export function CtaButton({ withIcon = true, disabled, className, children, ...rest }: CtaButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cx(
        "press flex h-[50px] w-full items-center justify-center gap-[8px] text-[17.5px] font-bold uppercase tracking-[0.4px]",
        disabled ? "bg-disabled-bg text-text-disabled" : "bg-primary text-accent",
        className,
      )}
      {...rest}
    >
      {withIcon && <TicketFill size={22} />}
      {children}
    </button>
  );
}

/** Tombol outline pill, mis. "Lihat Lokasi". */
export function OutlinePillLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const cls = cx(
    "press hit-y relative inline-flex h-[31px] items-center gap-[6px] rounded-full border border-link bg-link-soft pl-[18px] pr-[20px] text-[15px] font-bold text-link",
    className,
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** Tombol pill navy sedang (empty state, dsb). */
export function PrimaryPillLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cx(
        "press inline-flex h-[44px] items-center justify-center gap-[8px] rounded-full bg-primary px-[28px] text-[15px] font-bold text-accent",
        className,
      )}
    >
      {children}
    </Link>
  );
}
