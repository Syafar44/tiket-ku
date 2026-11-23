import { ImageResponse } from "next/og";

/** Gambar Open Graph default (dipakai halaman tanpa poster, termasuk event yang belum punya posterUrl). */
export const alt = "EventKu — Workshop AI gratis GSA UMKT, Samarinda";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #1A2C50 0%, #3E5C9A 100%)",
          color: "white",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -160,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.10)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 220,
            bottom: -220,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: 4, color: "#FDC93D" }}>GRATIS · GSA UMKT</div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 104, fontWeight: 700, lineHeight: 1 }}>EventKu</div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 40, color: "rgba(255,255,255,0.88)" }}>Workshop AI untuk mahasiswa di Samarinda</div>
      </div>
    ),
    size,
  );
}
