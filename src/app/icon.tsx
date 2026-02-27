import { ImageResponse } from "next/og";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="36"
          height="36"
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
