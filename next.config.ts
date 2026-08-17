import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  serverExternalPackages: [],
  images: {
    qualities: [25, 50, 75, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "eneshieylmelcsexetiq.supabase.co",
      },
    ],
  },
};

export default nextConfig;
