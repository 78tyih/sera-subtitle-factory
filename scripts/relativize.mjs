/**
 * relativize.mjs — make ./out openable straight from the filesystem.
 *
 *   node scripts/relativize.mjs        (after: SSF_EXPORT=1 next build)
 *
 * Next's static export writes absolute asset paths (/ _next/...), which break
 * under file://. This rewrites them to relative ones and copies the result to
 * ./out-local, so `out-local/studio/index.html` opens with a double click
 * (and preview panels that only handle local HTML files work too).
 *
 * Caveat: client-side routing still needs a server for the smoothest ride.
 * Links are rewritten to the real index.html files so plain navigation works.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'out');
const dest = path.join(root, 'out-local');

if (!fs.existsSync(src)) {
  console.error('[relativize] ./out not found — run: npm run export');
  process.exit(1);
}

const ROUTES = ['studio', 'library', 'recipes'];

function copyTree(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isDirectory()) copyTree(a, b);
    else fs.copyFileSync(a, b);
  }
}

function prefixFor(htmlPath) {
  const rel = path.relative(dest, path.dirname(htmlPath));
  const depth = rel === '' ? 0 : rel.split(path.sep).length;
  return depth === 0 ? './' : '../'.repeat(depth);
}

function rewrite(htmlPath) {
  const root = prefixFor(htmlPath);
  let s = fs.readFileSync(htmlPath, 'utf8');
  const before = s;

  /* assets */
  s = s.replace(/(href|src|content)="\/sera-subtitle-factory\/_next\//g, `$1="${root}_next/`);
  s = s.replace(/(href|src|content)="\/_next\//g, `$1="${root}_next/`);
  s = s.replace(/url\(\/sera-subtitle-factory\/_next\//g, `url(${root}_next/`);
  s = s.replace(/url\(\/_next\//g, `url(${root}_next/`);

  /* routes → real files so a double click navigates correctly */
  s = s.replace(/href="\/sera-subtitle-factory\/?"/g, `href="${root}index.html"`);
  s = s.replace(/href="\/"/g, `href="${root}index.html"`);
  for (const r of ROUTES) {
    s = s.replace(new RegExp(`href="/sera-subtitle-factory/${r}/?"`, 'g'), `href="${root}${r}/index.html"`);
    s = s.replace(new RegExp(`href="/${r}/?"`, 'g'), `href="${root}${r}/index.html"`);
  }

  /* embedded RSC payload route strings (keeps hydration calm under file://) */
  for (const r of ROUTES) {
    s = s.replace(new RegExp(`"/sera-subtitle-factory/${r}/"`, 'g'), `"${root}${r}/index.html"`);
    s = s.replace(new RegExp(`"/${r}/"`, 'g'), `"${root}${r}/index.html"`);
  }
  s = s.replace(/"\/sera-subtitle-factory\/_next\//g, `"${root}_next/`);
  s = s.replace(/"\/_next\//g, `"${root}_next/`);

  if (s !== before) fs.writeFileSync(htmlPath, s, 'utf8');
  return s !== before;
}

fs.rmSync(dest, { recursive: true, force: true });
copyTree(src, dest);

let n = 0;
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(f);
    else if (entry.name.endsWith('.html') && rewrite(f)) n++;
  }
};
walk(dest);

console.log(`[relativize] out-local/ ready — ${n} html files rewritten`);
console.log(`  open: out-local/studio/index.html`);
