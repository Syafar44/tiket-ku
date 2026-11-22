import type { Metadata } from "next";
import { ExploreView } from "@/components/event/ExploreView";
import { getEvents } from "@/lib/data";
import { getEventStatus } from "@/lib/time";

export const metadata: Metadata = { title: "Jelajah Event" };

/** Data spreadsheet di-cache 60 detik. */
export const revalidate = 60;

export default async function JelajahPage() {
  const now = Date.now();
  const events = await getEvents();
  // Akan datang & berlangsung dulu (terdekat di atas), lalu yang selesai (terbaru di atas).
  const active = events.filter((e) => getEventStatus(e, now) !== "ended");
  const ended = events.filter((e) => getEventStatus(e, now) === "ended").reverse();
  return <ExploreView events={[...active, ...ended]} endedSlugs={ended.map((e) => e.slug)} />;
}
