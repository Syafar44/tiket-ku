"use client";

import { Heart } from "lucide-react";
import { cx } from "@/lib/format";
import { useHydrated } from "@/lib/useHydrated";
import { useSaved } from "@/store/useSaved";
import { useToast } from "@/store/useToast";

/** Tombol simpan bulat 30px (putih 45%) dengan hati putih. Area sentuh 44px. */
export function SaveButton({ slug, title, className }: { slug: string; title: string; className?: string }) {
  const hydrated = useHydrated();
  const isSaved = useSaved((s) => s.saved.includes(slug));
  const toggle = useSaved((s) => s.toggle);
  const toast = useToast((s) => s.show);
  const saved = hydrated && isSaved;

  return (
    <button
      type="button"
      aria-label={saved ? `Hapus ${title} dari simpanan` : `Simpan ${title}`}
      aria-pressed={saved}
      onClick={() => toast(toggle(slug) ? "Event disimpan" : "Event dihapus dari simpanan")}
      className={cx("press flex size-[44px] items-center justify-center", className)}
    >
      <span className="flex size-[30px] items-center justify-center rounded-full bg-white/45 backdrop-blur-[2px]">
        <Heart
          size={16}
          strokeWidth={saved ? 0 : 2}
          fill={saved ? "#F0605D" : "#FFFFFF"}
          className={saved ? "text-danger" : "text-white"}
          aria-hidden
        />
      </span>
    </button>
  );
}
