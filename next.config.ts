import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: false,
  experimental: {
    inlineCss: false,
    useOffline: false,
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
  reactCompiler: false,
  typedRoutes: true,
};

export default nextConfig;
