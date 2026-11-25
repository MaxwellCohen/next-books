import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: false,
  experimental: {
    inlineCss: true,
    useOffline: true,
  },
  images: {
    // Workers resize through the IMAGES binding in wrangler.jsonc.
    // Vercel and Netlify use the built-in optimizer.
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
