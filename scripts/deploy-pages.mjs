/**
 * deploy-pages.mjs — publish ./out to the gh-pages branch (GitHub Pages).
 *
 *   npm run pages
 *
 * Requires git + `gh` and a public repository. Enable Pages once with source = gh-pages branch, path = "/".
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'out');
if (!fs.existsSync(path.join(out, 'index.html'))) {
  console.error('[pages] ./out/index.html not found — run: npm run export first');
  process.exit(1);
}

const slug = execSync('gh repo view --json nameWithOwner -q .nameWithOwner', { cwd: root }).toString().trim();
const [owner, repo] = slug.split('/');
console.log(`[pages] repo: ${slug}`);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ssf-pages-'));
const run = (cmd, cwd) => execSync(cmd, { stdio: 'inherit', cwd });

run(`git clone -q --depth 1 https://github.com/${slug}.git ${tmp}`, root);
run('git checkout -q --orphan gh-pages', tmp);
try { execSync('git rm -rq --cached .', { cwd: tmp, stdio: 'ignore' }); } catch (e) { /* empty tree is fine */ }
for (const entry of fs.readdirSync(tmp)) {
  if (entry === '.git') continue;
  fs.rmSync(path.join(tmp, entry), { recursive: true, force: true });
}
fs.cpSync(out, tmp, { recursive: true });
fs.writeFileSync(path.join(tmp, '.nojekyll'), '');
run('git add -A', tmp);
run('git -c user.name=78tyih -c user.email=online@niuniu.ai commit -q -m "deploy: static site"', tmp);
run('git push -qf origin gh-pages', tmp);
console.log(`[pages] deployed → https://${owner}.github.io/${repo}/`);
