/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
  images: {
    domains: ['github.com'],
    minimumCacheTTL: 60,
  },
  productionBrowserSourceMaps: true,
  // Add these lines for debugging
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    config.infrastructureLogging = { debug: /webpack/ };
    return config;
  },
};

module.exports = nextConfig;
