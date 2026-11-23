import { Headset } from "lucide-react";
import { TicketFill } from "@/components/ui/icons";

/** Header Beranda: logo EventKu di kiri, bantuan WhatsApp di kanan (hanya kalau nomornya diisi). */
export function HomeHeader({ helpUrl }: { helpUrl?: string }) {
  return (
    <div className="flex h-[52px] items-center justify-between border-b border-border pl-[20px] pr-[8px]">
      <p className="flex items-center gap-[8px] text-[21px] font-bold tracking-[-0.2px] text-primary">
        <TicketFill size={24} className="text-primary" />
        EventKu
      </p>
      {helpUrl && (
        <a
          href={helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bantuan lewat WhatsApp"
          className="press flex size-[44px] items-center justify-center text-primary"
        >
          <Headset size={24} aria-hidden />
        </a>
      )}
    </div>
  );
}
