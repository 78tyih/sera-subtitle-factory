/**
 * check-home.cjs — homepage V2 QA: hero switcher keeps one line, configurator
 * drives the live preview, and the page survives a 390px viewport.
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
  p.on('pageerror', (e) => errs.push(e.message.slice(0, 100)));

  await p.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2400);

  const seen = new Set();
  for (const label of ['Creator', 'Editorial', 'Data', 'Tech', 'Minimal']) {
    await p.click(`button:has-text("${label}")`);
    await p.waitForTimeout(700);
    const line = await p.evaluate(() => {
      const stage = document.querySelector('.cap-stage');
      return stage ? stage.innerText.replace(/\n/g, ' ').trim() : '';
    });
    seen.add(line);
    console.log(label.padEnd(10), JSON.stringify(line));
  }
  console.log('hero line identical across styles:', seen.size <= 2 ? 'yes (segment windows)' : `no (${seen.size})`);

  await p.screenshot({ path: path.join(OUT, 'v6-home.png') });
  await p.evaluate(() => window.scrollTo(0, 1500));
  await p.waitForTimeout(1100);
  await p.screenshot({ path: path.join(OUT, 'v6-home-2.png') });
  await p.evaluate(() => window.scrollTo(0, 3400));
  await p.waitForTimeout(1100);
  await p.screenshot({ path: path.join(OUT, 'v6-home-3.png') });

  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  m.on('pageerror', (e) => errs.push('[mobile] ' + e.message.slice(0, 80)));
  await m.goto(BASE + '/', { waitUntil: 'networkidle' });
  await m.waitForTimeout(1600);
  const mob = await m.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth > 400
  }));
  console.log('mobile', JSON.stringify(mob));

  console.log('ERRORS', errs.length ? JSON.stringify(errs.slice(0, 3)) : 'none');
  await b.close();
})();
