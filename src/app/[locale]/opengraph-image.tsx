import { ImageResponse } from "next/og";
import { locales } from "@/lib/i18n";

export const alt = "Rama Alsaab — Creative Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const CAT =
  "M20 22 L 18 4 L 28 14 C 30 13.5, 34 13.5, 36 14 L 46 4 L 44 22 C 47 26, 47 32, 43 36 C 50 44, 52 56, 50 70 C 56 70, 62 66, 62 58 C 62 54, 58 52, 58 48 C 58 46, 61 46, 62 48 C 66 54, 66 74, 50 76 L 18 76 C 12 76, 12 70, 16 66 C 14 56, 14 44, 21 36 C 17 32, 17 26, 20 22 Z";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F4EEE9",
          padding: "72px 88px",
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <div style={{ fontSize: 22, letterSpacing: 8, color: "#882A2A", fontFamily: "sans-serif" }}>HELLO, I&apos;M</div>
          <div style={{ fontSize: 132, lineHeight: 0.95, color: "#1E1B1B", marginTop: 24 }}>Rama</div>
          <div style={{ fontSize: 132, lineHeight: 0.95, color: "#1E1B1B" }}>Alsaab</div>
          <div style={{ fontSize: 40, color: "#1E1B1B", marginTop: 36, fontFamily: "sans-serif", fontWeight: 300 }}>Creative Developer</div>
          <div style={{ fontSize: 24, color: "#6E5E59", marginTop: 14, fontFamily: "sans-serif" }}>
            VR · Mixed Reality · Unreal Engine · Autodesk Maya · ESP32
          </div>
        </div>
        <div
          style={{
            width: 360,
            height: 450,
            alignSelf: "center",
            borderTopLeftRadius: 180,
            borderTopRightRadius: 180,
            background: "#E8DDD2",
            border: "2px solid #D7C9BA",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 40,
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: 70, right: 90, width: 64, height: 64, borderRadius: 64, background: "#882A2A" }} />
          <svg width="200" height="250" viewBox="0 0 64 80">
            <path d={CAT} fill="#1E1B1B" />
          </svg>
        </div>
      </div>
    ),
    size,
  );
}
