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
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event tidak ditemukan" };

  const title = fullTitle(event);
  const description = `${formatSchedule(event)} · ${event.venue}. Gratis untuk semua mahasiswa, daftar lewat EventKu.`;
  const url = `/event/${slug}`;
  // Tanpa posterUrl: gambar default dari app/opengraph-image.tsx. Harus ditulis eksplisit, karena begitu halaman
  // mengisi `openGraph` sendiri, gambar dari opengraph-image di root tidak lagi diwariskan.
  const images = event.posterUrl
    ? [{ url: event.posterUrl, alt: title }]
    : [{ url: "/opengraph-image", width: 1200, height: 630, alt: title, type: "image/png" }];

  return {
    title: event.title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: "EventKu", locale: "id_ID", url, title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const event = await getEventBySlug((await params).slug);
  if (!event) notFound();
  const { prodiOptions } = await getSiteConfig();
  return <EventDetailView event={event} prodiOptions={prodiOptions} />;
}
