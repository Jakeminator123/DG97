/** @type {import('next').NextConfig} */
const { securityHeaders } = require('./lib/security-headers');

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  generateEtags: false,
  // Disable production browser source maps to prevent webpack:// errors
  productionBrowserSourceMaps: false,
  // Fix for hot reload flickering
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  // Better dev experience
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dg97.se',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  // Enable compression (gzip/brotli)
  compress: true,
  // Security headers (disabled in dev to prevent white screen)
  async headers() {
    if (isDev) {
      return [];
    }
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  // Production optimizations
  // experimental: {
  //   optimizeCss: true, // Requires critters package
  // },
}

module.exports = nextConfig
