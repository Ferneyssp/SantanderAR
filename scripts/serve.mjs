// Servidor estático mínimo para desarrollo y pruebas (sin dependencias).
// Uso:
//   node scripts/serve.mjs                 -> http://localhost:8080 (sirve ./web)
//   node scripts/serve.mjs --port 9000 --root web
//   node scripts/serve.mjs --https         -> https://<ip-local>:8443 con certificado
//                                             autofirmado (requiere openssl). Útil para
//                                             probar la cámara desde un móvil en la misma red.
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : def;
};
const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(projectDir, opt('root', 'web'));
const useHttps = opt('https', false) === true;
const port = Number(opt('port', useHttps ? 8443 : 8080));
const host = opt('host', useHttps ? '0.0.0.0' : '127.0.0.1');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
  '.glb': 'model/gltf-binary', '.mind': 'application/octet-stream',
  '.pdf': 'application/pdf', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

function handler(req, res) {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  const file = path.normalize(path.join(root, urlPath));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end('Prohibido'); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) {
      const nf = path.join(root, '404.html');
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      return fs.existsSync(nf) ? fs.createReadStream(nf).pipe(res) : res.end('No encontrado');
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(file).pipe(res);
  });
}

function lanIPs() {
  return Object.values(os.networkInterfaces()).flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal).map((i) => i.address);
}

if (useHttps) {
  const certDir = path.join(projectDir, '.cert');
  const key = path.join(certDir, 'key.pem');
  const cert = path.join(certDir, 'cert.pem');
  if (!fs.existsSync(key)) {
    fs.mkdirSync(certDir, { recursive: true });
    execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '30',
      '-keyout', key, '-out', cert, '-subj', '/CN=santander-ar-local']);
  }
  https.createServer({ key: fs.readFileSync(key), cert: fs.readFileSync(cert) }, handler)
    .listen(port, host, () => {
      console.log(`Santander AR (HTTPS, certificado autofirmado) sirviendo ${root}`);
      for (const ip of ['localhost', ...lanIPs()]) console.log(`  https://${ip}:${port}/`);
      console.log('El navegador mostrará una advertencia de certificado: acéptela solo en su red local.');
    });
} else {
  http.createServer(handler).listen(port, host, () => {
    console.log(`Santander AR sirviendo ${root} en http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/`);
  });
}
