/**
 * Next config.
 * Default            → `next start` (dynamic server, port 4310)
 * SSF_EXPORT=1       → static export into ./out (served by scripts/serve.mjs)
 *
 * The whole app is client-side, so the static build is functionally identical
 * and survives being opened through any static preview panel / CDN.
 */
const isExport = process.env.SSF_EXPORT === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isExport
    ? {
        output: 'export',
        trailingSlash: true,
        /* GitHub Pages serves from /<repo>/ — asset URLs must carry that prefix */
        basePath: '/sera-subtitle-factory'
      }
    : {})
};

export default nextConfig;
