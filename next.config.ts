import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: false,
  experimental: {
    inlineCss: true,
    useOffline: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '*.gr-assets.com',
        port: '',
        protocol: 'https',
      },
    ],
  },
  partialPrefetching: false,
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
