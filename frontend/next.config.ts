import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Ignora erros de "português" do código no build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignora erros de tipagem estrita no build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withPWA(nextConfig);
