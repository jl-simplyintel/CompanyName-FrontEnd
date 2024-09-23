/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [
      {
        // source: '/',
        // destination: '/home',
        // permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemap',
      },
    ];
  },
};
