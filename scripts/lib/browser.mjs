// Utilidades compartidas por los scripts que usan un navegador sin interfaz.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.glb': 'model/gltf-binary',
  '.mind': 'application/octet-stream', '.pdf': 'application/pdf',
};

/** Sirve `root` en 127.0.0.1:port. Devuelve { server, base }. */
export function startServer(root, port) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.normalize(path.join(root, p));
    if (!f.startsWith(root) || !fs.existsSync(f) || !fs.statSync(f).isFile()) {
      const nf = path.join(root, '404.html');
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      return fs.existsSync(nf) ? fs.createReadStream(nf).pipe(res) : res.end('404');
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((ok) => server.listen(port, '127.0.0.1', () => ok({ server, base: `http://127.0.0.1:${port}` })));
}

/**
 * Lanza Chromium. Usa CHROMIUM_PATH si existe; si no, el Chromium instalado por
 * `npx playwright install chromium`. `extraArgs` permite, p. ej., una cámara simulada.
 */
export async function launchBrowser(extraArgs = []) {
  const executablePath = process.env.CHROMIUM_PATH || undefined;
  return chromium.launch({
    executablePath,
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist', ...extraArgs],
  });
}
