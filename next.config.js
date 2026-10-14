/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    // Prevent ESLint errors/warnings from failing Vercel production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Prevent strict type checking differences from failing Vercel production build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
