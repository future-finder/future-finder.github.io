import { chromium } from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:4390';
const out = 'artifacts/visual-review';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const darkSystemContext = await browser.newContext({ colorScheme: 'dark' });
const defaultThemePage = await darkSystemContext.newPage();
await defaultThemePage.goto(origin + '/');
assert.equal(await defaultThemePage.locator('html').getAttribute('data-theme'), 'light', 'first visit uses the reference light palette regardless of system theme');
await darkSystemContext.close();
const routes = [
  ['home', '/'], ['research', '/research/'], ['projects', '/projects/'], ['notes', '/notes/'], ['about', '/about/'],
  ['research-detail', '/research/lettucedetect/'], ['project-detail', '/projects/eloveris/'], ['memory-detail', '/projects/novelst/'], ['note-detail', '/notes/stack-expressions/'],
];
const results = [];
const errors = [];
const images = [];
for (const width of [1440, 768, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 960 }, colorScheme: 'light', reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(`${width}: ${error.message}`));
  for (const [name, route] of routes) {
    const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, route);
    await page.evaluate(() => document.fonts.ready);
    const check = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      failedImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src),
      h1: document.querySelectorAll('h1').length,
      contentWidth: document.querySelector('.prose')?.getBoundingClientRect().width,
    }));
    assert.equal(check.overflow, false, `${route} overflows at ${width}px`);
    assert.equal(check.failedImages.length, 0, `${route} image loading`);
    assert.equal(check.h1, 1, `${route} has one primary heading`);
    assert.doesNotMatch(await page.locator('body').innerText(), /本次网站改版|上述内容依据个人 CV|截图尚待补充|公开页面只记录/, 'production copy excludes delivery scaffolding');
    assert.equal(await page.locator('.hero').count() ? await page.locator('.hero').evaluate(el => getComputedStyle(el).animationName) : 'none', 'none', 'reduced motion');
    const filename = `${name}-${width}.png`;
    await page.screenshot({ path: `${out}/${filename}`, fullPage: true });
    images.push({ name, width, filename, route });
    results.push({ route, width, ...check });
  }
  if (width === 390) {
    await page.goto(origin + '/');
    await page.locator('[data-menu-toggle]').click();
    await assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'true');
    await page.locator('.mobile-nav a').filter({ hasText: 'Research' }).click();
    await page.waitForURL('**/research');
    assert.equal(await page.locator('.mobile-nav').isVisible(), false);
    await page.goto(origin + '/notes/stack-expressions/');
    assert.equal(await page.locator('.toc').isVisible(), true);
    await page.locator('.toc a').first().click();
    assert.ok(new URL(page.url()).hash);
    if (await page.locator('.copy-code').count()) {
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.locator('.copy-code').first().click();
      await page.waitForFunction(() => document.querySelector('.copy-code')?.textContent === 'Copied');
    }
  }
  await context.close();
  console.log(`Verified ${routes.length} pages at ${width}px.`);
}
const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, colorScheme: 'light' });
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
await page.goto(origin + '/projects/');
await page.locator('[data-project-filter="active"]').click();
assert.equal(await page.locator('[data-project-status]:visible').count(), 2);
await page.locator('[data-project-filter="reproduction"]').click();
assert.equal(await page.locator('[data-project-status]:visible').count(), 1);
await page.locator('[data-project-filter="all"]').click();
assert.equal(await page.locator('[data-project-status]:visible').count(), 3);
await page.goto(origin + '/');
await page.keyboard.press('Control+k');
await page.locator('[data-search-input]').fill('LettuceDetect');
await page.locator('.search-result').first().waitFor();
assert.ok((await page.locator('.search-result').count()) > 0);
await page.keyboard.press('Escape');
await page.waitForFunction(() => !document.querySelector('[data-search-dialog]')?.hasAttribute('open'));
assert.equal(await page.locator('[data-search-dialog]').getAttribute('open'), null);
await page.locator('[data-theme-toggle]').click(); // light -> dark
assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
await page.screenshot({ path: `${out}/home-dark-1440.png`, fullPage: true });
await page.reload();
assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
await page.setViewportSize({ width: 390, height: 960 });
await page.screenshot({ path: `${out}/home-dark-390.png`, fullPage: true });
await page.goto(origin + '/projects/lettuce-detect/');
await page.waitForURL('**/research/lettucedetect/');
assert.ok((await page.locator('h1').textContent()).includes('LettuceDetect'));
assert.equal(errors.length, 0, errors.join('\n'));
await browser.close();
fs.writeFileSync(`${out}/results.json`, JSON.stringify({ results, checks: ['27 viewport/route checks', 'no horizontal overflow', 'images loaded', 'one h1 per page', 'mobile menu navigation', 'mobile table of contents', 'code copy', 'project filters', 'Pagefind search', 'Escape closes dialog', 'persistent dark theme', 'legacy research redirect'], errors }, null, 2));
fs.writeFileSync(`${out}/index.html`, `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>网站视觉验收</title><style>body{margin:0;padding:40px;font-family:system-ui;background:#f4f7fb;color:#182b46}h1{font-family:Georgia}section{margin:40px 0}h2{font-size:20px}main{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}a{display:block;color:#316bb3;text-decoration:none}img{width:100%;border:1px solid #dce5ef;border-radius:6px}p{font-size:13px}@media(max-width:700px){body{padding:20px}main{grid-template-columns:1fr}}</style><h1>实际页面渲染 · 视觉验收</h1><p>1440px 桌面 / 768px 平板 / 390px 手机。点击查看完整 PNG。所有图片均由本地构建后的实际页面截图。</p>${routes.map(([name, route]) => `<section><h2>${name} · ${route}</h2><main>${images.filter(img => img.name === name).map(img => `<a href="${img.filename}"><p>${img.width}px</p><img loading="lazy" src="${img.filename}" alt="${name} ${img.width}px"/></a>`).join('')}</main></section>`).join('')}<section><h2>Dark mode</h2><main><a href="home-dark-1440.png"><img src="home-dark-1440.png" alt="深色桌面"/></a><a href="home-dark-390.png"><img src="home-dark-390.png" alt="深色手机"/></a></main></section></html>`);
console.log(`Verified ${results.length} viewport/route combinations and all interaction checks. Screenshots: ${out}`);
