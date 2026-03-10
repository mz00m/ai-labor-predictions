/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api/research/digest": ["./src/data/digests/**/*.json"],
    },
  },
};

module.exports = nextConfig;
