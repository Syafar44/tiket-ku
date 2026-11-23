import { StickyHeader } from "@/components/layout/StatusSafeArea";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { PromoCarousel } from "@/components/home/PromoCarousel";
import { SectionHeader } from "@/components/home/SectionHeader";
import { HomeEvents } from "@/components/home/HomeEvents";
import { EventGrid } from "@/components/event/EventGridCard";
import { activeEvents, getEvents, getSiteConfig } from "@/lib/data";
import { whatsappHelpUrl } from "@/lib/event";
import { isInCurrentWeek } from "@/lib/time";

/** Data spreadsheet di-cache 60 detik; halaman dihitung ulang paling lama tiap 60 detik. */
export const revalidate = 60;

export default async function HomePage() {
  const now = Date.now();
  const [all, config] = await Promise.all([getEvents(), getSiteConfig()]);
  const events = activeEvents(all, now);

  // "Minggu Ini": hanya event yang mulai Senin–Minggu minggu berjalan (WITA).
  // Disembunyikan kalau kosong, atau kalau isinya persis sama dengan carousel (tidak menduplikasi).
  const thisWeek = events.filter((e) => isInCurrentWeek(e.startAt, now));
  const showThisWeek = thisWeek.length > 0 && thisWeek.length < events.length;

  return (
    <main className="pb-[100px]">
      <StickyHeader>
        <HomeHeader helpUrl={whatsappHelpUrl(config.helpWhatsapp)} />
      </StickyHeader>
      <PromoCarousel />
      <SectionHeader title="Event Mendatang" />
      <HomeEvents events={events} />
      {showThisWeek && (
        <>
          <SectionHeader title="Minggu Ini" />
          <EventGrid events={thisWeek} />
        </>
      )}
    </main>
  );
}
