import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // This is a temporary workaround for the cross-origin request issue.
    // In a production environment, you should specify the exact origins.
    allowedDevOrigins: ["*"],
  },
  /* config options here */
};

export default nextConfig;
