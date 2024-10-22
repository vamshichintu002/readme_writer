/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  env: {
    GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
  // Optimize images
  images: {
    domains: ['github.com'],
    minimumCacheTTL: 60,
  },
  // Enable production source maps for better error tracking
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
