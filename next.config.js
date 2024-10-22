/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
};

module.exports = nextConfig;
