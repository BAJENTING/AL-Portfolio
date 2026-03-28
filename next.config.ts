import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['127.0.0.1'],
  experimental: {
    turbopack: {
      root: path.resolve(__dirname),
    },
  } as unknown as Record<string, unknown>, // Cast to unknown Record because types might not be updated for Next.js 16 yet
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
