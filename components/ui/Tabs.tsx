"use client";

import { cx } from "@/lib/format";

export interface TabItem<T extends string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string> {
  tabs: [TabItem<T>, TabItem<T>];
  value: T;
  onChange: (value: T) => void;
  /** px, default 45 */
  height?: number;
  idPrefix: string;
  className?: string;
}

export function tabIds(idPrefix: string, value: string) {
  return { tab: `${idPrefix}-tab-${value}`, panel: `${idPrefix}-panel-${value}` };
}

/** Dua kolom sama lebar, indikator 2px biru selebar setengah layar. */
export function Tabs<T extends string>({ tabs, value, onChange, height = 45, idPrefix, className }: TabsProps<T>) {
  const index = Math.max(
    0,
    tabs.findIndex((t) => t.value === value),
  );
  return (
    <div role="tablist" className={cx("relative grid grid-cols-2 border-b border-border bg-white", className)} style={{ height }}>
      {tabs.map((t) => {
        const active = t.value === value;
        const ids = tabIds(idPrefix, t.value);
        return (
          <button
            key={t.value}
            id={ids.tab}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={ids.panel}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                const next = tabs[(index + 1) % 2];
                onChange(next.value);
                document.getElementById(tabIds(idPrefix, next.value).tab)?.focus();
              }
            }}
            className={cx(
              "text-[15.5px] font-bold uppercase transition-colors duration-200",
              active ? "text-text" : "text-text-muted",
            )}
          >
            {t.label}
          </button>
        );
      })}
      <span
        aria-hidden
        className="absolute -bottom-px left-0 h-[2px] w-1/2 bg-link transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
    </div>
  );
}
