export interface Promo {
  kicker: string;
  title: string;
  subtitle: string;
  href: string;
  gradient: [string, string];
}

/** Banner promo di Beranda. */
export const promos: Promo[] = [
  {
    kicker: "Gratis",
    title: "Seri Workshop AI GSA UMKT",
    subtitle: "3 sesi gratis, mulai 28 Nov 2026",
    href: "/jelajah",
    gradient: ["#1A2C50", "#3E5C9A"],
  },
  {
    kicker: "Sesi karier",
    title: "Siap Kerja dengan AI",
    subtitle: "2 Des 2026",
    href: "/event/siap-kerja-dengan-ai",
    gradient: ["#3A1F0F", "#C66A2B"],
  },
];
