import { cx } from "@/lib/format";
import { CopyButton } from "@/components/ui/CopyButton";

interface CopyFieldProps {
  label: string;
  value: string;
  /** Warna garis kiri */
  accent: "link" | "success" | "danger";
  copied: boolean;
  /** Kosongkan untuk menyembunyikan tombol Salin (mis. data belum tersedia) */
  onCopy?: () => void;
}

const ACCENT = { link: "border-l-link", success: "border-l-success", danger: "border-l-danger" } as const;

/** Kartu data yang bisa disalin, dengan garis warna 3px di kiri. */
export function CopyField({ label, value, accent, copied, onCopy }: CopyFieldProps) {
  return (
    <div className={cx("flex w-full flex-col gap-[6px] rounded-[12px] border-l-3 bg-white py-[14px] pl-[16px] pr-[14px]", ACCENT[accent])}>
      <p className="whitespace-nowrap text-[11.5px] font-bold uppercase leading-normal tracking-[0.6px] text-text-muted">{label}</p>
      <div className="flex w-full items-center gap-[12px]">
        <p className={cx("min-w-0 flex-1 break-words text-[15px] font-medium leading-[20px]", onCopy ? "text-text" : "text-text-muted")}>{value}</p>
        {onCopy && <CopyButton copied={copied} onClick={onCopy} label={label.toLowerCase()} />}
      </div>
    </div>
  );
}
