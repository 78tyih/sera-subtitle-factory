/**
 * check-studio.cjs — Studio V2.7 QA: five-step workflow, style-first default,
 * quick controls under the preview, and Basic/Advanced in the inspector.
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

  await p.goto(BASE + '/studio/', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2200);

  /* 1. default step is 03 Style, and it shows a preset browser */
  const initial = await p.evaluate(() => {
    const txt = document.body.innerText;
    return {
      hasSteps: ['01', '02', '03', '04', '05'].every((n) => txt.includes(n)),
      styleFirst: txt.includes('选一个样式') || txt.includes('Pick a style'),
      masterBadges: (txt.match(/主样式/g) || []).length
    };
  });
  console.log('default step:', JSON.stringify(initial));
  await p.screenshot({ path: path.join(OUT, 'v7-studio-style.png') });

  /* 2. quick controls exist and work (change font size, see the stage react) */
  const size = p.locator('input[type=range]').first();
  await size.evaluate((el) => {
    el.value = '96';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await p.waitForTimeout(800);
  const fontPx = await p.evaluate(() => {
    const w = document.querySelector('.cap-word');
    return w ? getComputedStyle(w).fontSize : null;
  });
  console.log('quick control Size → stage font-size:', fontPx);

  /* 3. pick a master, then Customize → Refine shows Basic */
  await p.click('text=口播冲击 · 黄');
  await p.waitForTimeout(900);
  await p.click('button:has-text("精调此样式")');
  await p.waitForTimeout(900);
  const refine = await p.evaluate(() => {
    const txt = document.body.innerText;
    return { basic: txt.includes('基础'), advanced: txt.includes('高级'), fontSizeKnob: txt.includes('字号') };
  });
  console.log('refine panel:', JSON.stringify(refine));
  await p.screenshot({ path: path.join(OUT, 'v7-studio-refine.png') });

  /* 4. Advanced keeps the full inspector */
  await p.click('button:has-text("高级")');
  await p.waitForTimeout(800);
  const adv = await p.evaluate(() => document.body.innerText.includes('字距') || document.body.innerText.includes('字重'));
  console.log('advanced shows tracking:', adv);

  /* 5. export step */
  await p.click('button:has-text("05")');
  await p.waitForTimeout(800);
  const exp = await p.evaluate(() => { const t = document.body.innerText.toLowerCase(); return ['json','srt','vtt','ass'].every((k) => t.includes(k)); });
  console.log('export step lists 4 formats:', exp);
  await p.screenshot({ path: path.join(OUT, 'v7-studio-export.png') });

  console.log('ERRORS', errs.length ? JSON.stringify(errs.slice(0, 3)) : 'none');
  await b.close();
})();
