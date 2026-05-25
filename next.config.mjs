/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static HTML export — produces an /out folder of plain files that can be
  // uploaded to any static host (e.g. GoDaddy cPanel) with no Node runtime.
  output: "export",
  // Emit each route as a directory with index.html so Apache serves clean
  // URLs (/methods/ -> methods/index.html) without rewrite rules.
  trailingSlash: true,
  // next/image optimization needs a server; disable it for static export.
  images: { unoptimized: true },
};

export default nextConfig;
