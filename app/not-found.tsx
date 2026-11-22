import { StatusSafeArea } from "@/components/layout/StatusSafeArea";
import { PrimaryPillLink } from "@/components/ui/Button";
import { TicketFill } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <main>
      <StatusSafeArea />
      <div className="flex flex-col items-center px-[32px] py-[96px] text-center">
        <span className="flex size-[88px] items-center justify-center rounded-full bg-section">
          <TicketFill size={44} className="text-nav-inactive" />
        </span>
        <h1 className="mt-[16px] text-[19px] font-bold text-text">Halaman tidak ditemukan</h1>
        <p className="mt-[6px] text-[15px] leading-[21px] text-text-muted">Event atau halaman yang kamu cari mungkin sudah tidak tersedia.</p>
        <PrimaryPillLink href="/" className="mt-[20px]">
          Kembali ke Beranda
        </PrimaryPillLink>
      </div>
    </main>
  );
}
