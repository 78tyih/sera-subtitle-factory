const { chromium } = require('playwright-core');

(async () => {
  const b = await chromium.launch({
    executablePath:
      process.env.HOME +
      '/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
  });
  const errs = [];
  const base = 'http://127.0.0.1:4311/sera-subtitle-factory';

  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', (e) => errs.push('[desktop] ' + e.message.slice(0, 90)));

  for (const [n, path] of [
    ['首页', '/'],
    ['Library', '/library/'],
    ['Studio', '/studio/'],
    ['Recipes', '/recipes/']
  ]) {
    await p.goto(base + path, { waitUntil: 'networkidle', timeout: 60000 });
    await p.waitForTimeout(1800);
    const r = await p.evaluate(() => ({
      brand: document.body.innerText.includes('Sera Captions'),
      powered: document.body.innerText.includes('Powered by Subtitle Factory'),
      len: document.body.innerText.length,
      stages: document.querySelectorAll('.cap-stage').length
    }));
    console.log(n.padEnd(8), JSON.stringify(r));
  }

  await p.goto(base + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: 'assets/verify/v2-home.png' });
  await p.goto(base + '/library/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: 'assets/verify/v2-library.png' });

  const m = await b.newPage({ viewport: { width: 390, height: 844 } });
  m.on('pageerror', (e) => errs.push('[mobile] ' + e.message.slice(0, 90)));
  await m.goto(base + '/', { waitUntil: 'networkidle' });
  await m.waitForTimeout(1500);
  const mr = await m.evaluate(() => ({
    ok: document.body.innerText.length > 200,
    overflow: document.documentElement.scrollWidth > 410
  }));
  await m.screenshot({ path: 'assets/verify/v2-home-mobile.png' });
  console.log('mobile  ', JSON.stringify(mr));
  console.log('ERRORS', errs.length ? JSON.stringify(errs.slice(0, 3)) : 'none');
  await b.close();
})();
