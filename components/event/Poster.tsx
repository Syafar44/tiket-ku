import Image from "next/image";
import { cx } from "@/lib/format";

interface PosterProps {
  title: string;
  gradient: [string, string];
  /** Isi untuk mengganti gradien dengan foto asli */
  imageUrl?: string;
  showTitle?: boolean;
  /** Ukuran teks judul, sesuaikan dengan ukuran poster */
  titleClassName?: string;
  /** Atribut sizes untuk next/image */
  sizes?: string;
  priority?: boolean;
  /** Tanpa lingkaran dekoratif & bayangan; judul memakai titleClassName apa adanya */
  plain?: boolean;
  className?: string;
}

/**
 * Poster event. Mengisi penuh parent (parent yang mengatur ukuran & radius).
 * Tanpa imageUrl: gradien vertikal + dua lingkaran dekoratif + judul putih.
 */
export function Poster({
  title,
  gradient,
  imageUrl,
  showTitle = true,
  titleClassName = "text-[18px]",
  sizes = "200px",
  priority,
  plain,
  className,
}: PosterProps) {
  return (
    <div
      className={cx("relative h-full w-full overflow-hidden", className)}
      style={{ background: `linear-gradient(180deg, ${gradient[0]} 0%, ${gradient[1]} 100%)` }}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={title} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : plain ? (
        showTitle && <span className={cx("absolute inset-x-0 bottom-0 font-bold uppercase text-white", titleClassName)}>{title}</span>
      ) : (
        <>
          <span aria-hidden className="absolute -right-[22%] -top-[12%] aspect-square w-[85%] rounded-full bg-white/12" />
          <span aria-hidden className="absolute -left-[28%] top-[38%] aspect-square w-[70%] rounded-full bg-white/8" />
          {showTitle && (
            <>
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/35 to-transparent" />
              <span
                className={cx(
                  "absolute inset-x-0 bottom-0 p-[10%] font-bold uppercase leading-[1.1] text-white [text-wrap:balance]",
                  titleClassName,
                )}
              >
                {title}
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
}
