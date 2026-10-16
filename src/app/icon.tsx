import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#16171c",
          color: "#f5b04c",
          fontSize: 40,
          fontWeight: 700,
          borderRadius: 12,
        }}
      >
        §
      </div>
    ),
    size,
  );
}
