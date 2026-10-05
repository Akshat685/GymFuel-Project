// Fiber 8 supports React 18 but still constructs the deprecated Three.Clock.
// Keep its small clock contract while using Three.Timer, without hiding warnings.
const fs = require('node:fs');
const path = require('node:path');
const root = path.dirname(require.resolve('@react-three/fiber/package.json'));
if (require(path.join(root, 'package.json')).version !== '8.18.0') throw new Error('Review Timer adapter for the new Fiber version.');
let found = 0;
for (const file of fs.readdirSync(path.join(root, 'dist')).filter(f => /^events-.*\.js$/.test(f))) {
  const target = path.join(root, 'dist', file);
  let code = fs.readFileSync(target, 'utf8');
  const pattern = /new (THREE(?:__namespace)?)\.Clock\(\)/g;
  if (pattern.test(code)) {
    code = code.replace(pattern, (_, three) => `new (class FiberTimer extends ${three}.Timer {
      constructor() { super(); this.elapsedTime = 0; this.running = true; }
      start() { this.reset(); this.elapsedTime = 0; this.running = true; }
      stop() { this.running = false; }
      getDelta() { if (!this.running) return 0; this.update(); const delta = super.getDelta(); this.elapsedTime += delta; return delta; }
      getElapsedTime() { this.getDelta(); return this.elapsedTime; }
    })()`);
    fs.writeFileSync(target, code);
    found++;
  } else if (code.includes('class FiberTimer')) found++;
}
if (found !== 3) throw new Error(`Expected three Fiber bundles, found ${found}`);
console.log('Verified Fiber 8 Timer compatibility (ESM, development, production).');
