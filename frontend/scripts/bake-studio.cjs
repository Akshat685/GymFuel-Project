// Rebuild the lighting asset offline with the pinned Three.js version.
const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({channel:'chrome'});
  try {
    const page=await browser.newPage();
    await page.route('http://fuel-bake.test/**', async route=> {
      const url=new URL(route.request().url());
      if(url.pathname==='/') return route.fulfill({contentType:'text/html',body:`<script type="importmap">{"imports":{"three":"/three.module.js"}}</script><script type="module">
        import * as THREE from 'three';
        import {RoomEnvironment} from '/RoomEnvironment.js';
        const gl=new THREE.WebGLRenderer();
        const room=new RoomEnvironment();
        const generator=new THREE.PMREMGenerator(gl);
        const target=generator.fromScene(room,.06,.1,20,{size:64});
        const pixels=new Uint16Array(target.width*target.height*4);
        gl.readRenderTargetPixels(target,0,0,target.width,target.height,pixels);
        window.result={width:target.width,height:target.height,pixels:Array.from(pixels)};
        target.dispose();room.dispose();generator.dispose();gl.dispose();
      </script>`});
      const files={'/three.module.js':'build/three.module.js','/three.core.js':'build/three.core.js','/RoomEnvironment.js':'examples/jsm/environments/RoomEnvironment.js'};
      if(!files[url.pathname])return route.abort();
      return route.fulfill({contentType:'application/javascript',body:fs.readFileSync(path.resolve('node_modules/three',files[url.pathname]))});
    });
    await page.goto('http://fuel-bake.test');
    await page.waitForFunction(()=>window.result);
    const {width,height,pixels}=await page.evaluate(()=>window.result);
    const data=new Uint16Array(pixels);
    fs.writeFileSync('public/fuel-studio.bin',Buffer.from(data.buffer));
    fs.writeFileSync('src/components/fuel/studio-map.json',JSON.stringify({width,height})+'\n');
    console.log({width,height,bytes:data.byteLength,nonzero:pixels.filter(p=>p!==0).length});
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
