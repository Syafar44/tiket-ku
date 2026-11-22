import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TicketFill } from "@/components/ui/icons";

export function SectionHeader({ title, href = "/jelajah" }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between pb-[16px] pl-[22px] pr-[20px] pt-[18px]">
      <h2 className="flex items-center gap-[8px] text-[21px] font-bold text-heading">
        <TicketFill size={20} className="text-primary" />
        {title}
      </h2>
      <Link
        href={href}
        aria-label={`Lihat semua ${title}`}
        className="press hit-y relative flex h-[21px] w-[70px] items-center justify-center gap-[1px] rounded-full bg-accent-soft text-[13px] font-medium text-primary"
      >
        Semua
        <ChevronRight size={13} strokeWidth={2.5} aria-hidden />
      </Link>
    </div>
  );
}
