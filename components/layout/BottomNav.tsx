"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { cx } from "@/lib/format";
import { CompassFill, HomeFill, TicketFill } from "@/components/ui/icons";

const ITEMS: { href: string; label: string; Icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { href: "/", label: "Beranda", Icon: HomeFill },
  { href: "/jelajah", label: "Jelajah", Icon: CompassFill },
  { href: "/tiket", label: "Tiket", Icon: TicketFill },
];

/** Hanya tampil di halaman level atas. */
const VISIBLE_ON = new Set(["/", "/jelajah", "/tiket"]);

export function BottomNav() {
  const pathname = usePathname();
  if (!VISIBLE_ON.has(pathname)) return null;

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto h-[85px] w-full max-w-[393px] border-t border-border bg-white"
    >
      <ul className="grid h-full grid-cols-3">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="press flex h-[60px] flex-col items-center justify-center gap-[3px]"
              >
                <span className="relative">
                  <Icon size={24} className={cx("transition-colors duration-200", active ? "text-primary" : "text-nav-inactive")} />
                  {active && (
                    <span aria-hidden className="absolute -right-[2px] top-[1px] h-[2.5px] w-[6px] rounded-full bg-accent" />
                  )}
                </span>
                <span className={cx("text-[13px]", active ? "font-medium text-heading" : "font-normal text-text-muted")}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
