// Genera el brochure PDF (A4, 6 páginas) a partir de web/brochure.html.
// Los QR apuntan a la URL base indicada; sin argumento usan el servidor local (QR de prueba).
//   node scripts/generar_brochure.mjs https://usuario.github.io/santander-ar/
//   node scripts/generar_brochure.mjs            -> QR de prueba local, marcados como tales
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer, launchBrowser } from './lib/browser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseArg = process.argv[2];
const outDir = path.join(root, 'entregables');
fs.mkdirSync(outDir, { recursive: true });

const { server, base } = await startServer(path.join(root, 'web'), 8794);
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  const url = `${base}/brochure.html` + (baseArg ? `?base=${encodeURIComponent(baseArg)}` : `?base=${encodeURIComponent('http://localhost:8080/')}`);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const info = await page.evaluate(() => window.__brochure);
  const nombre = baseArg ? 'Santander_AR_brochure.pdf' : 'Santander_AR_brochure_PRUEBA_LOCAL.pdf';
  const out = path.join(outDir, nombre);
  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  fs.writeFileSync(path.join(outDir, nombre.replace('.pdf', '_qr.json')), JSON.stringify(info, null, 2));
  console.log(`ok ${out}`);
  console.log(`base de los QR: ${info.base}${info.local ? '  (LOCAL: solo para pruebas)' : ''}`);
  info.qrs.forEach((q) => console.log('  QR →', q));
} finally {
  await browser.close();
  server.close();
}
