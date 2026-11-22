import { StickyHeader } from "@/components/layout/StatusSafeArea";
import { TopBar } from "@/components/layout/TopBar";
import { PromoCarousel } from "@/components/home/PromoCarousel";
import { SectionHeader } from "@/components/home/SectionHeader";
import { HomeEvents } from "@/components/home/HomeEvents";
import { EventGrid } from "@/components/event/EventGridCard";
import { activeEvents, getEvents } from "@/lib/data";

/** Hitung ulang tiap jam supaya event yang sudah selesai otomatis turun dari Beranda. */
/** Data spreadsheet di-cache 60 detik. */
export const revalidate = 60;

export default async function HomePage() {
  const events = activeEvents(await getEvents());
  return (
    <main className="pb-[100px]">
      <StickyHeader>
        <TopBar />
      </StickyHeader>
      <PromoCarousel />
      <SectionHeader title="Event Mendatang" />
      <HomeEvents events={events} />
      <SectionHeader title="Minggu Ini" />
      <EventGrid events={events} />
    </main>
  );
}
