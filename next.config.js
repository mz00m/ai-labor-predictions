/**
 * Baseline security headers for every route. Deliberately conservative: no
 * script-src or style-src restrictions, so Recharts, Stripe and analytics are
 * unaffected. Public pages stay frameable because ShareCiteBar hands out
 * <iframe> embed codes for prediction charts.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value: "base-uri 'self'; object-src 'none'",
  },
];

/** Logged-in, admin and API surfaces: also block framing (clickjacking). */
const noFrameHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  },
];
const noFrameRoutes = ["/assessment/:path*", "/kb/:path*", "/api/:path*"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    outputFileTracingIncludes: {
      "/api/research/digest": ["./src/data/digests/**/*.json"],
      "/api/kb/query": ["./wiki/**/*.md"],
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Listed after the global rule so these values override it
      ...noFrameRoutes.map((source) => ({ source, headers: noFrameHeaders })),
    ];
  },
};

module.exports = nextConfig;
