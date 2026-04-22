/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/api/research/digest": ["./src/data/digests/**/*.json"],
    "/api/kb/query": ["./wiki/**/*.md"],
  },
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
