import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 promoted this out of `experimental`.
  typedRoutes: true,
};

export default nextConfig;
