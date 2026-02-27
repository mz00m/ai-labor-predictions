import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 58 66"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="39" y="15" width="10" height="46" fill="#F66B5C" />
          <rect x="9" y="35" width="10" height="26" fill="#5C61F6" />
          <rect x="24" y="25" width="10" height="36" fill="#5C61F6" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
