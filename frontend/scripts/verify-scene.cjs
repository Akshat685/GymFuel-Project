const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');
const baseURL = process.env.VERIFY_URL || 'http://localhost:3000';
const args = process.env.SOFTWARE ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : [];
const result = { url: baseURL, renderer: process.env.SOFTWARE ? 'Chrome / SwiftShader software WebGL2' : 'Chrome / hardware WebGL2', scenarios: {} };
const errors = [];
const warnings = [];
const capture = page => {
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
    if (message.type() === 'warning') warnings.push(message.text());
  });
};
(async () => {
  fs.mkdirSync('verification', { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args });
  try {
    for (const [name, viewport] of Object.entries({ desktop: {width:1440,height:900}, mobile: {width:390,height:844} })) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: name === 'mobile' ? 2 : 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      capture(page);
      await page.addInitScript(() => {
        window.__cls = 0;
        new PerformanceObserver(list => list.getEntries().forEach(e => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
      });
      await page.goto(`${baseURL}/?sceneDebug=1`);
      await page.waitForSelector('[data-scene-state="ready"]', { timeout: 60000 });
      await page.waitForTimeout(8500);
      await page.screenshot({ path: `verification/${name}.png`, scale: 'css' });
      await page.screenshot({ path: `verification/${name}-full.png`, fullPage: true });
      result.scenarios[name] = await page.evaluate(() => ({ metrics: window.__fuelMetrics, cls: window.__cls, horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth, canvasSize: {width: document.querySelector('canvas').width, height: document.querySelector('canvas').height} }));
      expect(result.scenarios[name].horizontalOverflow).toBe(false);
      const canvas = page.locator('.fuel-canvas canvas');
      const a = await canvas.screenshot();
      await page.waitForTimeout(600);
      expect(a.equals(await canvas.screenshot())).toBe(false);
      await page.getByRole('button', { name:'Pause shaker animation' }).click();
      await page.waitForTimeout(300);
      const paused = await canvas.screenshot();
      await page.waitForTimeout(400);
      expect(paused.equals(await canvas.screenshot())).toBe(true);
      await page.getByRole('button', { name:'Resume shaker animation' }).click();
      if (name === 'mobile') {
        await page.evaluate(() => { document.querySelector('.fuel-footer').style.marginBottom = '900px'; window.scrollTo(0, document.querySelector('.fuel-stage').getBoundingClientRect().bottom + window.scrollY + 20); });
        await page.waitForTimeout(400);
        const frames = await page.evaluate(() => window.__fuelMetrics?.frames);
        await page.waitForTimeout(600);
        expect(await page.evaluate(() => window.__fuelMetrics?.frames)).toBe(frames);
        result.scenarios.mobile.offscreenPaused = true;
        await page.screenshot({ path: 'verification/mobile-form.png' });
      }
      await page.close();
    }
    for (const scenario of ['reduced-motion', 'save-data', 'low-end']) {
      const page = await browser.newPage({ reducedMotion: scenario === 'reduced-motion' ? 'reduce' : 'no-preference' });
      capture(page);
      if (scenario === 'save-data') await page.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true, addEventListener() {}, removeEventListener() {} } }));
      if (scenario === 'low-end') await page.addInitScript(() => Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 2 }));
      await page.goto(baseURL);
      await page.waitForTimeout(1500);
      await expect(page.locator('.fuel-stage')).toHaveAttribute('data-scene-state', 'poster');
      expect(await page.locator('canvas').count()).toBe(0);
      await expect(page.getByLabel('Email address')).toBeVisible();
      await page.screenshot({ path:`verification/${scenario}.png`, fullPage:true });
      result.scenarios[scenario] = { poster: true, canvasCount: 0 };
      await page.close();
    }
    const page = await browser.newPage({ viewport: {width:390,height:844}, isMobile:true, hasTouch:true });
    capture(page);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline:false, latency:150, downloadThroughput:200000, uploadThroughput:90000 });
    await page.goto(`${baseURL}/?sceneDebug=1`, {waitUntil:'domcontentloaded',timeout:120000});
    await expect(page.getByRole('heading', {name:'Welcome back.'})).toBeAttached();
    await page.waitForSelector('[data-scene-state="ready"]', {timeout:120000});
    await page.waitForTimeout(7000);
    result.scenarios.throttled = { cpu: '4x slowdown', network: '1.6 Mbps / 150 ms', metrics: await page.evaluate(() => window.__fuelMetrics) };
    await cdp.send('Emulation.setCPUThrottlingRate', {rate:1});
    await page.evaluate(() => document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
    await expect(page.locator('.fuel-stage')).toHaveAttribute('data-scene-state', 'poster');
    result.scenarios.contextLoss = { poster: true };
    await page.close();
  } finally { await browser.close(); }
  const disabled = await chromium.launch({channel:'chrome',args:['--disable-webgl']});
  try {
    const page = await disabled.newPage(); capture(page);
    await page.goto(baseURL); await page.waitForTimeout(1200);
    await expect(page.locator('.fuel-stage')).toHaveAttribute('data-scene-state','poster');
    expect(await page.locator('canvas').count()).toBe(0);
    result.scenarios.webglDisabled = { poster: true };
  } finally { await disabled.close(); }
  result.errors = errors; result.warnings = warnings;
  fs.writeFileSync(process.env.SOFTWARE ? 'verification/results-software.json' : 'verification/results.json', JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
  expect(errors).toEqual([]);
  expect(warnings.filter(m => /deprecated/i.test(m))).toEqual([]);
})().catch(error => { console.error(error); process.exitCode=1; });



