/** @type {import('next').NextConfig} */
const { securityHeaders } = require('./lib/security-headers');

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  generateEtags: false,
  // Disable source maps in dev to prevent webpack:// errors
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
      {
        protocol: 'http',
        hostname: 'localhost',
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
  // Optimize fonts
  optimizeFonts: true,
  // Production optimizations
  productionBrowserSourceMaps: false,
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Optimize bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 250000,
        cacheGroups: {
          default: false,
          vendors: false,
          // Framework bundle (React, Next.js)
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Large libraries bundle
          lib: {
            test(module) {
              return module.size() > 160000;
            },
            name: 'lib',
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          // Common chunks
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 20,
          },
          // Framer Motion separate chunk
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            priority: 35,
            reuseExistingChunk: true,
          },
        },
      };

      // Minimize duplicate modules
      config.optimization.providedExports = true;
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    return config;
  },
}

module.exports = nextConfig
