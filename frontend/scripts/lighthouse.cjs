const { chromium } = require('@playwright/test');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({channel:'chrome',args:['--remote-debugging-port=9225']});
  try {
    const { default:lighthouse }=await import('lighthouse');
    const run=await lighthouse('http://127.0.0.1:3001',{port:9225,output:['json','html'],logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
    fs.writeFileSync('verification/lighthouse-final.json',run.report[0]);
    fs.writeFileSync('verification/lighthouse-final.html',run.report[1]);
    console.log(JSON.stringify({scores:Object.fromEntries(Object.entries(run.lhr.categories).map(([k,v])=>[k,v.score*100])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index','total-byte-weight'].map(k=>[k,run.lhr.audits[k]?.displayValue]))},null,2));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
