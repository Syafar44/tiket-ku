import type { Metadata } from "next";
import { MyTicketsView } from "@/components/event/MyTicketsView";
import { getEvents } from "@/lib/data";

export const metadata: Metadata = { title: "Tiket Saya" };

/** Data spreadsheet di-cache 60 detik. */
export const revalidate = 60;

export default async function MyTicketsPage() {
  return <MyTicketsView events={await getEvents()} />;
}
