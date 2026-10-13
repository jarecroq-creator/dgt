/**
 * Zero-dependency static server for the web export (`pnpm run build:web` -> dist/).
 * Serves clean URLs (/practice -> practice.html) and falls back to index.html.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT) || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
};

function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const candidates = [clean, `${clean}.html`, path.join(clean, 'index.html')];
  for (const candidate of candidates) {
    const file = path.join(ROOT, candidate);
    if (file.startsWith(ROOT) && fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  return null;
}

if (!fs.existsSync(ROOT)) {
  console.error('dist/ not found. Run `pnpm run build:web` first.');
  process.exit(1);
}

http
  .createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost');
    const file = resolveFile(pathname) ?? path.join(ROOT, 'index.html');
    const ext = path.extname(file);
    const immutable = pathname.startsWith('/_expo/static/') || pathname.startsWith('/assets/');
    res.writeHead(200, {
      'content-type': MIME_TYPES[ext] || 'application/octet-stream',
      'cache-control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, '0.0.0.0', () => console.log(`Conduce DGT web on http://localhost:${PORT}`));
