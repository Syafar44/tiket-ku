import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import { BottomNav } from "@/components/layout/BottomNav";
import { LegacyMigration } from "@/components/layout/LegacyMigration";
import { Splash } from "@/components/layout/Splash";
import { SPLASH_KEY } from "@/lib/constants";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
  display: "swap",
});

/** URL publik situs untuk link absolut di metadata (og:image, og:url). */
function siteUrl(): URL {
  if (process.env.SITE_URL) return new URL(process.env.SITE_URL);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: "EventKu — Event Kampus Samarinda", template: "%s · EventKu" },
  description: "Daftar workshop AI gratis GSA UMKT di Samarinda lewat EventKu.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1A2C50",
  // Keyboard virtual mengecilkan layout (Chrome Android), jadi sheet & CTA bawah tetap terlihat di atasnya.
  interactiveWidget: "resizes-content",
  // Wajib supaya env(safe-area-inset-*) terisi di perangkat ber-notch.
  viewportFit: "cover",
};

/** Sembunyikan splash sebelum paint jika sudah pernah tampil di sesi ini. */
const splashScript = `try{if(sessionStorage.getItem("${SPLASH_KEY}")==="1")document.documentElement.dataset.splash="seen"}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={roboto.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: splashScript }} />
      </head>
      <body className="font-sans antialiased">
        <div className="relative mx-auto min-h-dvh w-full max-w-[393px] bg-white shadow-[0_0_24px_rgba(14,24,48,0.06)]">
          {children}
          <BottomNav />
          <Toaster />
          <Splash />
          <LegacyMigration />
        </div>
      </body>
    </html>
  );
}
