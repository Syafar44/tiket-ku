import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegisterSuccessView } from "@/components/event/RegisterSuccessView";
import { getEventBySlug, getEvents } from "@/lib/data";

type Params = Promise<{ slug: string }>;

export const metadata: Metadata = { title: "Kamu terdaftar!" };

/** Data spreadsheet di-cache 60 detik. */
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export default async function RegisterSuccessPage({ params }: { params: Params }) {
  const event = await getEventBySlug((await params).slug);
  if (!event) notFound();
  return <RegisterSuccessView event={event} />;
}
