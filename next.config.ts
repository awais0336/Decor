import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  serverExternalPackages: [],
  images: {
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
