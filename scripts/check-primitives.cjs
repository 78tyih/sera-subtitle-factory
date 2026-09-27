const { chromium } = require('playwright-core');

(async () => {
  const b = await chromium.launch({
    executablePath:
      process.env.HOME +
      '/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
  });
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message.slice(0, 90)));

  await p.goto('http://127.0.0.1:4311/sera-subtitle-factory/library/', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(1500);

  await p.getByRole('button', { name: 'Primitives' }).click();
  await p.waitForTimeout(2500);

  const r = await p.evaluate(() => {
    const names = Array.from(document.querySelectorAll('div')).map((d) => d.textContent).filter((t) => t && ['markerSweep', 'underlineReveal', 'boxFollow', 'karaokeFill', 'snap', 'recoil', 'widen', 'maskReveal', 'blurFocus', 'trackIn', 'hardShadow', 'strokeReveal'].includes(t));
    return {
      primitiveCards: document.querySelectorAll('.cap-stage').length,
      labelled: names.length,
      names: names
    };
  });
  console.log('PRIMITIVES LAB', JSON.stringify(r));
  await p.screenshot({ path: 'assets/verify/v2-primitives.png' });
  console.log('ERRORS', errs.length ? JSON.stringify(errs.slice(0, 3)) : 'none');
  await b.close();
})();
