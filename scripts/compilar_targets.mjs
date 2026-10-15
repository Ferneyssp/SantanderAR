// Compila los marcadores PNG a archivos .mind de MindAR usando el compilador
// oficial de MindAR ejecutado en Chromium sin interfaz (Playwright).
// Equivale a usar la herramienta web oficial "Image Targets Compiler" de MindAR.
// Uso: node scripts/compilar_targets.mjs   (requiere CHROMIUM_PATH o el Chromium de Playwright)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer, launchBrowser } from './lib/browser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LUGARES = ['barichara', 'chicamocha', 'sangil'];

const { server, base } = await startServer(root, 8791);
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  page.on('console', (m) => m.type() === 'error' && console.error('[navegador]', m.text()));
  await page.goto(`${base}/tools/compilar-targets.html`);
  await page.waitForFunction(() => window.ready === true);
  for (const id of LUGARES) {
    const t0 = Date.now();
    const b64 = await page.evaluate((src) => window.compileTarget(src), `/web/assets/markers/${id}.png`);
    const out = path.join(root, 'web/assets/targets', `${id}.mind`);
    fs.writeFileSync(out, Buffer.from(b64, 'base64'));
    console.log(`ok ${id}.mind  ${fs.statSync(out).size} bytes  ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  }
} finally {
  await browser.close();
  server.close();
}
