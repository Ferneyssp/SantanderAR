// Renderiza docs/diagramas/*.mmd a SVG y PNG con Mermaid en Chromium sin interfaz.
// Uso: node scripts/renderizar_diagramas.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './lib/browser.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'docs/diagramas');
const mermaidJs = fs.readFileSync(path.join(root, 'node_modules/mermaid/dist/mermaid.min.js'), 'utf8');
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
await page.setContent('<html><body style="margin:0;background:#fff"><div id="o"></div></body></html>');
await page.addScriptTag({ content: mermaidJs });
await page.evaluate(() => mermaid.initialize({ startOnLoad: false, theme: 'neutral', fontFamily: 'DejaVu Sans, sans-serif', securityLevel: 'strict' }));
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.mmd')).sort()) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const svg = await page.evaluate(async ([id, s]) => { const r = await mermaid.render(id, s); document.getElementById('o').innerHTML = r.svg; return r.svg; }, ['d' + f.replace(/\W/g, ''), src]);
  fs.writeFileSync(path.join(dir, f.replace('.mmd', '.svg')), svg);
  await (await page.$('#o svg')).screenshot({ path: path.join(dir, f.replace('.mmd', '.png')) });
  console.log('ok', f);
}
await browser.close();
