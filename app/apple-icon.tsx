import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon (iOS): the house + H mark from icon.svg. */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#4A3F78",
      }}
    >
      <svg width="140" height="140" viewBox="0 0 64 64">
        <path
          d="M32 10 8 30h7v24h34V30h7Z"
          fill="none"
          stroke="#C9A24D"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M24 30v18M40 30v18M24 39h16"
          stroke="#F7F4EE"
          strokeWidth="5"
          strokeLinecap="square"
        />
      </svg>
    </div>,
    size,
  );
}
