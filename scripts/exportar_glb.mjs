// Exporta los tres modelos procedurales (web/js/models.js) a archivos GLB reutilizables
// en otras plataformas de RA o visores 3D. Uso: node scripts/exportar_glb.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer, launchBrowser } from './lib/browser.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { server, base } = await startServer(root, 8795);
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error(e.message));
  await page.goto(`${base}/tools/exportar-glb.html`);
  await page.waitForFunction(() => window.ready === true);
  for (const id of ['barichara', 'chicamocha', 'sangil']) {
    const b64 = await page.evaluate((i) => window.exportar(i), id);
    const out = path.join(root, 'web/assets/models', `${id}.glb`);
    fs.writeFileSync(out, Buffer.from(b64, 'base64'));
    console.log(`ok ${id}.glb ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
  }
} finally { await browser.close(); server.close(); }
