import type { NextConfig } from 'next';

// Feature-tests knobs: FT_STANDALONE builds the self-hosted Node target into a separate distDir
// so it never clobbers the default .next build.
const standalone = process.env.FT_STANDALONE === '1';

const nextConfig: NextConfig = {
  cacheComponents: true,
  ...(standalone ? { distDir: '.next-standalone', output: 'standalone' as const } : {}),
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
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
