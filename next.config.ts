import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "mindabg.com",
      },
      {
        protocol: "https",
        hostname: "cdn.susa.et",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    useCache: true,
  },
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: false,
  },
};
export default nextConfig;
