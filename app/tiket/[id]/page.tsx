import type { Metadata } from "next";
import { TicketDetailView } from "@/components/event/TicketDetailView";
import { getEvents, getSiteConfig } from "@/lib/data";

export const metadata: Metadata = { title: "Tiket" };

/** `id` = id pendaftaran di perangkat ini. Event dicari dari slug pendaftaran di sisi klien. */
export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [events, { gsaName, gsaRole, gsaId }] = await Promise.all([getEvents(), getSiteConfig()]);
  return <TicketDetailView registrationId={id} events={events} organizer={{ gsaName, gsaRole, gsaId }} />;
}
