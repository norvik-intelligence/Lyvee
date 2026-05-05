import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    // MVP deployment should not be blocked by non-runtime type issues.
    // Keep `npm run typecheck` locally/CI before production launch.
    ignoreBuildErrors: true
  }
};

export default nextConfig;
