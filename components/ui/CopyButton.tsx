import Image from "next/image";
import { cx } from "@/lib/format";
import copyIcon from "@/public/icons/copy-14-link.svg";
import copiedIcon from "@/public/icons/check-14-success.svg";

interface CopyButtonProps {
  copied: boolean;
  onClick: () => void;
  /** Untuk aria-label, mis. "judul acara" */
  label: string;
}

/** Pill "Salin" → "Disalin" (hijau) setelah diketuk. */
export function CopyButton({ copied, onClick, label }: CopyButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copied ? `${label} sudah disalin` : `Salin ${label}`}
      className={cx(
        "press hit-y relative flex shrink-0 items-center gap-[5px] rounded-[14px] py-[6px] pl-[10px] pr-[12px] duration-200",
        copied ? "bg-success-soft" : "bg-link-soft",
      )}
    >
      <Image src={copied ? copiedIcon : copyIcon} alt="" width={14} height={14} className="shrink-0" />
      <span className={cx("whitespace-nowrap text-[13px] font-bold leading-normal", copied ? "text-success" : "text-link")}>
        {copied ? "Disalin" : "Salin"}
      </span>
    </button>
  );
}
