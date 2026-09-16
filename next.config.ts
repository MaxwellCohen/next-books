import type { NextConfig } from 'next';

const isCloudflare = Boolean(process.env.CLOUDFLARE || process.env.WORKERS_CI);

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    inlineCss: true,
    useOffline: !isCloudflare,
  },
  images: {
    // Cloudflare Images is optional; skip the optimizer on Workers builds.
    unoptimized: Boolean(process.env.CLOUDFLARE || process.env.WORKERS_CI),
    remotePatterns: [
      {
        hostname: '*.gr-assets.com',
        port: '',
        protocol: 'https',
      },
    ],
  },
  partialPrefetching: !isCloudflare,
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
