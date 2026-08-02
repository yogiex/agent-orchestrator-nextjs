import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/agent-orchestrator-nextjs",
  allowedDevOrigins: ["localhost", "127.0.0.1", "11.11.10.3"],
};

export default nextConfig;
