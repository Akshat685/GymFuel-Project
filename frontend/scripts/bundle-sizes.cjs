const fs = require('node:fs');
const zlib = require('node:zlib');
const files = fs.readdirSync('build/static/js').filter(f => f.endsWith('.js')).map(f => 'build/static/js/' + f).concat(['build/fuel-studio.bin']);
const sizes = files.map(file => { const content=fs.readFileSync(file); return {file, bytes:content.length, gzipBytes:zlib.gzipSync(content).length}; });
fs.writeFileSync('verification/sizes.json', JSON.stringify(sizes,null,2));
console.log(JSON.stringify(sizes,null,2));
