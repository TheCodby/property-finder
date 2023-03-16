/** @type {import('next').NextConfig} */
const withPreconstruct = require("@preconstruct/next");

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "property-finderf.s3.amazonaws.com",
      },
    ],
  },
};
module.exports = withPreconstruct(nextConfig);
