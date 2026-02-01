import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Configuração vazia para silenciar o erro do Turbopack (Next.js 16+)
  // já que o next-pwa injeta configurações de webpack.
  turbopack: {},
  
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
