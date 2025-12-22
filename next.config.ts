import type { NextConfig } from "next";

const nextConfig = {
  // output: "export",
  /* config options here */
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
} as unknown as NextConfig;

export default nextConfig;
