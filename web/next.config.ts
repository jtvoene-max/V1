import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Testfoto's uit het seed-script.
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // Cloudflare Images levert foto's van dit domein.
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
    ],
  },
};

export default nextConfig;
