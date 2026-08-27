/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api/research/digest": ["./src/data/digests/**/*.json"],
      "/api/kb/query": ["./wiki/**/*.md"],
    },
  },
};

module.exports = nextConfig;
