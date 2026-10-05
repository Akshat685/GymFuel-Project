const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ channel:'chrome', args: process.env.SOFTWARE ? ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] : [] });
  try {
    const page = await browser.newPage({ viewport:{width:1440,height:900} });
    await page.goto('http://localhost:3000/?sceneDebug=1');
    await page.waitForSelector('[data-scene-state="ready"]');
    await page.waitForTimeout(12000);
    console.log(await page.evaluate(() => {
      const gl = document.querySelector('canvas').getContext('webgl2');
      const debug = gl.getExtension('WEBGL_debug_renderer_info');
      return {renderer:debug && gl.getParameter(debug.UNMASKED_RENDERER_WEBGL), metrics:window.__fuelMetrics};
    }));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
