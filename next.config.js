/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN,
  },
};

module.exports = nextConfig;
