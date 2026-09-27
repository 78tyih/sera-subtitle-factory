/**
 * check-masters.cjs — browser QA for the six V2.3 Master Styles.
 * Opens /library (Featured), verifies the masters sit first, then hovers each
 * tile so the motion plays and captures what the caption actually looks like.
 */
const { chromium } = require('playwright-core');
const path = require('path');

const EXEC =
  process.env.HOME +
  '/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const BASE = process.env.SSF_BASE || 'http://127.0.0.1:4311/sera-subtitle-factory';
const OUT = path.join(__dirname, '..', 'assets', 'verify');

(async () => {
  const b = await chromium.launch({ executablePath: EXEC });
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message.slice(0, 120)));

  await p.goto(BASE + '/library/', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2000);

  const cards = await p.$$('article');
  console.log('featured cards:', cards.length);

  const names = await p.evaluate(() =>
    Array.from(document.querySelectorAll('article'))
      .slice(0, 8)
      .map((a) => ({
        name: a.querySelector('.text-\\[13px\\]')?.textContent ?? '?',
        master: a.innerText.includes('主样式') || a.innerText.includes('MASTER')
      }))
  );
  console.log('first cards:', JSON.stringify(names, null, 0));

  await p.screenshot({ path: path.join(OUT, 'v3-masters-grid.png') });

  /* hover each of the first six tiles → motion plays → capture the tile */
  for (let i = 0; i < Math.min(6, cards.length); i++) {
    await cards[i].hover();
    await p.waitForTimeout(1400); // let the sweep / snap land
    await cards[i].screenshot({ path: path.join(OUT, `v3-master-${i + 1}.png`) });
    await p.waitForTimeout(200);
  }

  /* open the first master's detail drawer to check the new V2 rows */
  await cards[0].click();
  await p.waitForTimeout(1200);
  const drawer = await p.evaluate(() => {
    const dl = document.querySelector('dl');
    if (!dl) return null;
    return Array.from(dl.querySelectorAll('div')).map((d) => d.innerText.replace(/\n/g, ': '));
  });
  console.log('drawer rows:', JSON.stringify(drawer));
  await p.screenshot({ path: path.join(OUT, 'v3-master-drawer.png') });

  console.log('ERRORS', errs.length ? JSON.stringify(errs.slice(0, 3)) : 'none');
  await b.close();
})();
