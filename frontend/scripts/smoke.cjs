const { chromium } = require('@playwright/test');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const messages = [];
  page.on('console', m => { if (['error','warning'].includes(m.type())) messages.push(m.text()); });
  page.on('pageerror', e => messages.push(e.message));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-scene-state="ready"]', { timeout: 60000 });
  fs.mkdirSync('verification', { recursive: true });
  await page.screenshot({ path: 'verification/stage1.png', fullPage: true });
  console.log(JSON.stringify({ state: await page.locator('.fuel-stage').getAttribute('data-scene-state'), messages }));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForSelector('[data-scene-state="poster"]');
  console.log('Reduced motion: poster visible, canvas count =', await page.locator('canvas').count());
  await browser.close();
})().catch(e => { console.error(e); process.exitCode = 1; });
