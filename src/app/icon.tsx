import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "#1a1a2e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Lightbulb outline */}
          <path
            d="M9 21h6M12 3a6 6 0 0 0-4 10.5V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.5A6 6 0 0 0 12 3z"
            stroke="#4ade80"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Neural network nodes inside bulb */}
          <circle cx="12" cy="8" r="1.2" fill="#4ade80" />
          <circle cx="9.5" cy="11" r="1" fill="#4ade80" />
          <circle cx="14.5" cy="11" r="1" fill="#4ade80" />
          {/* Connection lines */}
          <line
            x1="12"
            y1="8"
            x2="9.5"
            y2="11"
            stroke="#4ade80"
            strokeWidth="0.8"
            opacity="0.7"
          />
          <line
            x1="12"
            y1="8"
            x2="14.5"
            y2="11"
            stroke="#4ade80"
            strokeWidth="0.8"
            opacity="0.7"
          />
          <line
            x1="9.5"
            y1="11"
            x2="14.5"
            y2="11"
            stroke="#4ade80"
            strokeWidth="0.6"
            opacity="0.5"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
