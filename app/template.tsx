/**
 * Dipasang ulang setiap pindah halaman → halaman baru masuk dengan fade ease-in-out.
 * Sengaja hanya opacity: transform pada pembungkus akan membuat elemen `position: fixed`
 * di dalam halaman (CTA bawah, sheet) ikut bergeser.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
