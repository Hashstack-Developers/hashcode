import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phone LAN access (http://192.168.x.x:3000) needs this or HMR/dev resources break
  allowedDevOrigins: ["192.168.100.116", "127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
