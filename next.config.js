// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/dashboard', destination: '/app/dashboard', permanent: false },
      { source: '/pantry', destination: '/app/pantry', permanent: false },
      { source: '/lifestyle', destination: '/app/lifestyle', permanent: false },
      { source: '/food', destination: '/app/food', permanent: false },
      { source: '/seasons', destination: '/app/seasons', permanent: false },
    ];
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_FOODOSCOPE_API_BASE: process.env.NEXT_PUBLIC_FOODOSCOPE_API_BASE,
    NEXT_PUBLIC_FOODOSCOPE_API_KEY: process.env.NEXT_PUBLIC_FOODOSCOPE_API_KEY,
  },
};

module.exports = nextConfig;
