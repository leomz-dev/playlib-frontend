import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://playlib-backend.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
