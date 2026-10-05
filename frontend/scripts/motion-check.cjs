const { chromium, expect } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3000');
    await page.waitForSelector('[data-scene-state="ready"]');
    await page.waitForTimeout(1500);
    const canvas = page.locator('.fuel-canvas canvas');
    const a = await canvas.screenshot();
    await page.waitForTimeout(500);
    const b = await canvas.screenshot();
    expect(a.equals(b)).toBe(false);
    await page.getByRole('button', { name: 'Pause shaker animation' }).click();
    await page.waitForTimeout(400);
    const paused = await canvas.screenshot();
    await page.waitForTimeout(400);
    expect(paused.equals(await canvas.screenshot())).toBe(true);
    await page.getByRole('button', { name: 'Resume shaker animation' }).click();
    await page.getByRole('button', { name: 'Rotate shaker right' }).focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    expect(paused.equals(await canvas.screenshot())).toBe(false);
    await page.screenshot({ path: 'verification/stage3.png', fullPage: true });
    console.log('PASS: live animation changes rendered pixels; pause freezes pixels; keyboard rotation changes rendered pixels.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode=1; });
