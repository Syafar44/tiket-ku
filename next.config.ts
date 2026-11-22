import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Gambar poster/banner event (kolom `posterUrl` di spreadsheet) di-host di Cloudinary.
    // Kalau menambah host lain, samakan juga dengan IMAGE_HOSTS di lib/sheets.ts.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" }],
  },
};

export default nextConfig;
