import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // The React Compiler ESLint plugin flags standard data-fetching-in-effect
  // patterns as errors; we handle correctness via TypeScript + runtime checks,
  // so lint is run separately with `npm run lint` and not as a build gate.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;