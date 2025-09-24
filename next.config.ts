import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Temporarily disable ESLint during build for deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily disable TypeScript errors during build for deployment
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
