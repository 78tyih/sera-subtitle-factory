/**
 * serve.mjs — zero-dependency static server for the SSF static export (./out).
 *
 *   npm run static      → build + serve on http://127.0.0.1:4311
 *   node scripts/serve.mjs
 *
 * Handles both `/studio` and `/studio/` (directory index) so the app works
 * through any static preview panel, CDN or file drop.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'out');
const port = Number(process.env.PORT || 4311);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

if (!fs.existsSync(outDir)) {
  console.error('[serve] ./out not found — run: npm run export');
  process.exit(1);
}

const BASE = process.env.SSF_BASE_PATH || '/sera-subtitle-factory';

function resolveFile(urlPath) {
  let raw = decodeURIComponent(urlPath.split('?')[0]);
  /* static export uses basePath — strip it so the local server can serve the files */
  if (raw === BASE || raw.startsWith(BASE + '/')) raw = raw.slice(BASE.length) || '/';
  const clean = raw.replace(/^\/+/, '');
  const candidates = [];
  if (!clean) candidates.push('index.html');
  else {
    candidates.push(clean);
    candidates.push(`${clean}.html`);
    candidates.push(path.join(clean, 'index.html'));
  }
  for (const c of candidates) {
    const file = path.join(outDir, c);
    if (file.startsWith(outDir) && fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  /* SPA-ish fallback: unknown path → 404 page from the export */
  const notFound = path.join(outDir, '404.html');
  return fs.existsSync(notFound) ? notFound : null;
}

http
  .createServer((req, res) => {
    const file = resolveFile(req.url || '/');
    if (!file) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404');
      return;
    }
    const status = file.endsWith('404.html') ? 404 : 200;
    res.writeHead(status, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => {
    console.log(`Sera Subtitle Factory (static) → http://127.0.0.1:${port}`);
    console.log(`  studio  http://127.0.0.1:${port}/studio/`);
    console.log(`  library http://127.0.0.1:${port}/library/`);
  });
