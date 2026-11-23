import { StickyHeader } from "@/components/layout/StatusSafeArea";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { PromoCarousel } from "@/components/home/PromoCarousel";
import { SectionHeader } from "@/components/home/SectionHeader";
import { HomeEvents } from "@/components/home/HomeEvents";
import { EventGrid } from "@/components/event/EventGridCard";
import { activeEvents, getEvents, getSiteConfig } from "@/lib/data";
import { whatsappHelpUrl } from "@/lib/event";
import { getEventStatus, isInCurrentWeek } from "@/lib/time";
import type { EventItem } from "@/lib/types";

/** Data spreadsheet di-cache 60 detik; halaman dihitung ulang paling lama tiap 60 detik. */
export const revalidate = 60;

/** Dua daftar berisi event yang persis sama (urutan diabaikan). */
function sameEvents(a: EventItem[], b: EventItem[]): boolean {
  if (a.length !== b.length) return false;
  const slugs = new Set(b.map((e) => e.slug));
  return a.every((e) => slugs.has(e.slug));
}

export default async function HomePage() {
  const now = Date.now();
  const [all, config] = await Promise.all([getEvents(), getSiteConfig()]);
  const active = activeEvents(all, now); // akan datang + berlangsung, urut tanggal

  // Carousel utama: event featured yang belum selesai. Kalau belum ada, pakai semua event yang belum selesai.
  const featured = active.filter((e) => e.featured);
  const carousel = featured.length > 0 ? featured : active;
  const carouselTitle = featured.length > 0 ? "GSA Goes to Achiever" : "Event Mendatang";

  // Section lain disembunyikan kalau kosong atau isinya persis sama dengan carousel (tidak menduplikasi).
  const risingStar = all.filter((e) => e.track === "Rising Star" && getEventStatus(e, now) === "upcoming");
  const showRisingStar = risingStar.length > 0 && !sameEvents(risingStar, carousel);
  const thisWeek = active.filter((e) => isInCurrentWeek(e.startAt, now));
  const showThisWeek = thisWeek.length > 0 && !sameEvents(thisWeek, carousel);

  return (
    <main className="pb-[100px]">
      <StickyHeader>
        <HomeHeader helpUrl={whatsappHelpUrl(config.helpWhatsapp)} />
      </StickyHeader>
      <PromoCarousel />
      <SectionHeader title={carouselTitle} />
      <HomeEvents events={carousel} />
      {showRisingStar && (
        <>
          <SectionHeader title="Rising Star" />
          <EventGrid events={risingStar} />
        </>
      )}
      {showThisWeek && (
        <>
          <SectionHeader title="Minggu Ini" />
          <EventGrid events={thisWeek} />
        </>
      )}
    </main>
  );
}
