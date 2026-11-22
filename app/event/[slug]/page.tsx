import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetailView } from "@/components/event/EventDetailView";
import { getEventBySlug, getEvents, getSiteConfig } from "@/lib/data";
import { fullTitle } from "@/lib/event";
import { formatSchedule } from "@/lib/time";

type Params = Promise<{ slug: string }>;

/** Data spreadsheet di-cache 60 detik. */
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const event = await getEventBySlug((await params).slug);
  return event ? { title: event.title, description: `${fullTitle(event)} · ${formatSchedule(event)}` } : { title: "Event tidak ditemukan" };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const event = await getEventBySlug((await params).slug);
  if (!event) notFound();
  const { prodiOptions } = await getSiteConfig();
  return <EventDetailView event={event} prodiOptions={prodiOptions} />;
}
