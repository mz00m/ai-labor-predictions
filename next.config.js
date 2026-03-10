/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/api/research/digest": ["./src/data/digests/**/*.json"],
  },
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
