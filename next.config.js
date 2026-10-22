// in dev, run velite alongside next (https://velite.js.org/guide/with-nextjs).
// `pnpm build` runs `velite build` explicitly before `next build`.
if (!process.env.VELITE_STARTED && process.argv.includes('dev')) {
  process.env.VELITE_STARTED = '1';
  import('velite').then(({ build }) => build({ watch: true, clean: false }));
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers: () => {
    return Promise.resolve([
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]);
  },
  turbopack: {
    // ignore fs and path when building for browser, resolves "fs" is not defined error
    resolveAlias: {
      fs: { browser: './src/lib/empty.ts' },
      path: { browser: './src/lib/empty.ts' },
    },
  },
  output: 'standalone',
};

// https://nextjs.org/docs/advanced-features/security-headers
const ContentSecurityPolicy = `
    default-src 'self' analytics.umami.is;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' analytics.umami.is;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data:;
    media-src 'none';
    connect-src *;
    font-src 'self';
`;

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
