const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const root = path.resolve(__dirname, '../build');
const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.ico':'image/x-icon', '.woff2':'font/woff2', '.woff':'font/woff', '.ttf':'font/ttf' };
http.createServer((req,res) => {
  let filename;
  try { filename = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname)); } catch { res.writeHead(400); res.end(); return; }
  if (filename !== root && !filename.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  if (!fs.existsSync(filename) || fs.statSync(filename).isDirectory()) filename = path.join(root,'index.html');
  const data = fs.readFileSync(filename);
  const headers = { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream', 'Vary':'Accept-Encoding' };
  const gzip = /gzip/.test(req.headers['accept-encoding'] || '');
  if(gzip) headers['Content-Encoding']='gzip';
  res.writeHead(200, headers); res.end(gzip ? zlib.gzipSync(data) : data);
}).listen(3001,'127.0.0.1', () => console.log('Production preview: http://127.0.0.1:3001'));
