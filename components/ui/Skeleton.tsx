import { cx } from "@/lib/format";

export function Sk({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div aria-hidden style={style} className={cx("animate-pulse rounded-[6px] bg-disabled-bg", className)} />;
}

/** Sama dengan StickyHeader: hanya sebesar safe area perangkat. */
function SafeArea() {
  return <div className="h-[env(safe-area-inset-top)]" />;
}

/** Header Beranda: logo + ikon bantuan. */
function HomeBarSkeleton() {
  return (
    <div className="flex h-[52px] items-center justify-between border-b border-border pl-[20px] pr-[18px]">
      <Sk className="h-[24px] w-[120px]" />
      <Sk className="size-[24px] rounded-full" />
    </div>
  );
}

/** Baris chip kategori (Jelajah). */
function ChipsSkeleton() {
  return (
    <div className="flex h-[52px] items-center gap-[7px] border-b border-border px-[20px]">
      {[70, 120, 70, 60].map((w, i) => (
        <Sk key={i} className="h-[30px] rounded-full" style={{ width: w }} />
      ))}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat">
      <SafeArea />
      <HomeBarSkeleton />
      <Sk className="mt-[6px] h-[146px] rounded-none" />
      <div className="px-[22px] pt-[18px]">
        <Sk className="h-[24px] w-[200px]" />
      </div>
      <div className="mt-[20px] flex gap-[16px] overflow-hidden px-[20px]">
        <Sk className="h-[290px] w-[200px] shrink-0 rounded-[13px]" />
        <Sk className="h-[290px] w-[200px] shrink-0 rounded-[13px]" />
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat">
      <SafeArea />
      <ChipsSkeleton />
      <div className="px-[20px] pt-[16px]">
        <Sk className="h-[24px] w-[160px]" />
      </div>
      <div className="grid grid-cols-2 gap-[13px] p-[20px]">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i}>
            <Sk className="aspect-[170/254] w-full rounded-[12px]" />
            <Sk className="mt-[10px] h-[18px] w-[80%]" />
            <Sk className="mt-[8px] h-[14px] w-[50%]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat">
      <Sk className="h-[201px] rounded-none" />
      <div className="-mt-[60px] px-[20px]">
        <div className="flex gap-[17px] rounded-[10px] border border-border bg-white px-[17px] py-[16px]">
          <Sk className="h-[144px] w-[95px] rounded-[8px]" />
          <div className="flex-1 space-y-[10px]">
            <Sk className="h-[22px] w-[90%]" />
            <Sk className="h-[16px] w-[70%]" />
            <Sk className="h-[16px] w-[60%]" />
            <Sk className="h-[16px] w-[50%]" />
          </div>
        </div>
      </div>
      <div className="mt-[20px] flex gap-[10px] px-[20px]">
        {Array.from({ length: 3 }, (_, i) => (
          <Sk key={i} className="h-[50px] w-[70px] rounded-[4px]" />
        ))}
      </div>
    </div>
  );
}

export function SuccessSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat" className="px-[20px]">
      <SafeArea />
      <div className="flex flex-col items-center pt-[40px]">
        <Sk className="size-[88px] rounded-full" />
        <Sk className="mt-[18px] h-[28px] w-[200px]" />
        <Sk className="mt-[8px] h-[16px] w-[160px]" />
      </div>
      <Sk className="mt-[24px] h-[130px] w-full rounded-[12px]" />
      <Sk className="mt-[24px] h-[48px] w-full rounded-full" />
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat">
      <SafeArea />
      <div className="h-[50px] border-b border-border" />
      <div className="space-y-[24px] p-[20px]">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex gap-[18px]">
            <Sk className="h-[120px] w-[83px] rounded-[7px]" />
            <div className="flex-1 space-y-[10px]">
              <Sk className="h-[20px] w-[85%]" />
              <Sk className="h-[16px] w-[60%]" />
              <Sk className="h-[16px] w-[50%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TicketSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat">
      <SafeArea />
      <div className="h-[45px] border-b border-border" />
      <div className="mx-[20px] mt-[12px] overflow-hidden rounded-[12px]">
        <Sk className="h-[166px] rounded-none" />
        <Sk className="mt-px h-[110px] rounded-none" />
        <Sk className="mt-px h-[220px] rounded-none" />
      </div>
    </div>
  );
}
