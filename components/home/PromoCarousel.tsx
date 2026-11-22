"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { promos } from "@/data/promos";
import { cx } from "@/lib/format";

/** Banner promo full width 146px, auto-slide 4 detik, satu titik indikator per slide. */
export function PromoCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Timer di-reset setiap slide berubah (termasuk geser manual).
  useEffect(() => {
    const t = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const next = (index + 1) % promos.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: next === 0 ? "auto" : "smooth" });
    }, 4000);
    return () => clearTimeout(t);
  }, [index]);

  const onScroll = () => {
    const el = ref.current;
    if (!el || el.clientWidth === 0) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  return (
    <section aria-roledescription="carousel" aria-label="Promo" className="relative mt-[6px]">
      <div ref={ref} onScroll={onScroll} className="no-scrollbar flex h-[146px] snap-x snap-mandatory overflow-x-auto">
        {promos.map((p, i) => (
          <Link
            key={p.title}
            href={p.href}
            aria-roledescription="slide"
            aria-label={`${p.title}, ${p.subtitle} (${i + 1} dari ${promos.length})`}
            className="relative block h-full w-full shrink-0 snap-center overflow-hidden"
            style={{ background: `linear-gradient(120deg, ${p.gradient[0]} 0%, ${p.gradient[1]} 100%)` }}
          >
            <span aria-hidden className="absolute -right-[40px] -top-[50px] size-[180px] rounded-full bg-white/10" />
            <span aria-hidden className="absolute -bottom-[70px] right-[70px] size-[140px] rounded-full bg-white/8" />
            <div className="relative flex h-full flex-col justify-center px-[22px] pb-[14px]">
              <span className="text-[12px] font-bold uppercase tracking-[1px] text-accent">{p.kicker}</span>
              <span className="mt-[4px] text-[22px] font-bold leading-[26px] text-white">{p.title}</span>
              <span className="mt-[4px] text-[13.5px] text-white/85">{p.subtitle}</span>
            </div>
          </Link>
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[9px] flex justify-center gap-[11.5px]">
        {promos.map((p, i) => (
          <span
            key={p.title}
            className={cx("size-[6.5px] rounded-full transition-colors duration-200", i === index ? "bg-primary" : "bg-white/85")}
          />
        ))}
      </div>
    </section>
  );
}
