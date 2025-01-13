/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CLOUDAMQP_URL: process.env.CLOUDAMQP_URL,
  },
};

module.exports = nextConfig; 