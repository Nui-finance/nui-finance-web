/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/raffles',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
