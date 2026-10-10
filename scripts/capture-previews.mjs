import { chromium } from '@playwright/test';
const browser = await chromium.launch();
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 960 }, reducedMotion: 'reduce', colorScheme: 'light' });
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4390', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `artifacts/visual-review/home-firstfold-${width}.png` });
  await page.close();
}
await browser.close();
