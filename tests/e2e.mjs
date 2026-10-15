// Santander AR — pruebas automatizadas de extremo a extremo (Playwright + Chromium sin interfaz).
// La cámara se simula con videos Y4M generados por scripts/generar_video_prueba.py, que muestran
// el marcador impreso sobre una mesa. Esto valida el reconocimiento con el motor real de MindAR,
// pero NO sustituye las pruebas en un teléfono físico.
// Uso: CHROMIUM_PATH=/ruta/chromium node tests/e2e.mjs   (o npm test)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer, launchBrowser } from '../scripts/lib/browser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EVID = path.join(root, 'tests/evidence');
fs.mkdirSync(EVID, { recursive: true });
const FIX = path.join(root, 'tests/fixtures');
const LUGARES = ['barichara', 'chicamocha', 'sangil'];
const MOBILE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const PORT = 8796;
const { server, base } = await startServer(path.join(root, 'web'), PORT);

const resultados = [];
async function prueba(id, funcion, procedimiento, esperado, fn) {
  const t0 = Date.now();
  let estado = 'Aprobada', obtenido = '', evidencia = '';
  try {
    const r = await fn();
    obtenido = r.obtenido; evidencia = r.evidencia || '';
    if (r.ok === false) estado = 'Fallida';
  } catch (e) { estado = 'Fallida'; obtenido = 'Error: ' + e.message.split('\n')[0]; }
  resultados.push({ id, funcion, procedimiento, esperado, obtenido, estado, evidencia, ms: Date.now() - t0 });
  console.log(`${estado === 'Aprobada' ? '✔' : '✘'} ${id} ${funcion} — ${obtenido}`);
}
const shot = async (page, name) => { await page.screenshot({ path: path.join(EVID, name) }); return `tests/evidence/${name}`; };
function vigilar(page) {
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(e.message));
  return errs;
}

let browser = await launchBrowser();

// ───────── Navegación y contenido
await prueba('PT-01', 'Carga de la página principal', 'Abrir index.html en viewport móvil 390×844 y contar los lugares listados.',
  'La página carga sin errores de consola y muestra 3 lugares.', async () => {
    const ctx = await browser.newContext(MOBILE); const p = await ctx.newPage(); const errs = vigilar(p);
    const resp = await p.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
    const n = await p.locator('.lugar-row').count();
    const ev = await shot(p, 'PT-01_index_movil.png'); await ctx.close();
    return { ok: resp.status() === 200 && n === 3 && errs.length === 0, obtenido: `HTTP ${resp.status()}, ${n} lugares, ${errs.length} errores de consola`, evidencia: ev };
  });

await prueba('PT-02', 'Navegación entre los tres lugares', 'Desde index, abrir cada lugar; luego seguir el enlace «Siguiente» tres veces.',
  'Cada enlace abre la página del lugar correcto y «Siguiente» recorre los tres en ciclo.', async () => {
    const ctx = await browser.newContext(MOBILE); const p = await ctx.newPage(); const errs = vigilar(p);
    const vistos = [];
    for (const id of LUGARES) {
      await p.goto(`${base}/index.html`); await p.click(`a.lugar-row[href="lugar.html?l=${id}"]`);
      await p.waitForSelector('.lugar-hero h1'); vistos.push(await p.textContent('.lugar-hero h1'));
    }
    const ciclo = [];
    await p.goto(`${base}/lugar.html?l=barichara`);
    for (let i = 0; i < 3; i++) { await p.click('text=/Siguiente:/'); await p.waitForSelector('.lugar-hero h1'); ciclo.push(new URL(p.url()).searchParams.get('l')); }
    await ctx.close();
    const ok = vistos.length === 3 && ciclo.join(',') === 'chicamocha,sangil,barichara' && errs.length === 0;
    return { ok, obtenido: `Títulos: ${vistos.join(' | ')}. Ciclo: ${ciclo.join(' → ')}` };
  });

await prueba('PT-03', 'Lugar inexistente', 'Abrir lugar.html?l=desconocido, ar.html?l=desconocido y una ruta inexistente.',
  'Se muestra un mensaje claro con enlace a los lugares; el servidor devuelve la página 404.', async () => {
    const ctx = await browser.newContext(MOBILE); const p = await ctx.newPage();
    await p.goto(`${base}/lugar.html?l=desconocido`); const a = await p.textContent('h1');
    await p.goto(`${base}/ar.html?l=desconocido`); await p.waitForSelector('#panel-error:not([hidden])'); const b = await p.textContent('#err-t');
    const r = await p.goto(`${base}/no-existe.html`); const c = await p.textContent('h1');
    await ctx.close();
    return { ok: a.includes('no encontrado') && b.includes('no encontrado') && r.status() === 404, obtenido: `«${a}» · «${b}» · HTTP ${r.status()} «${c}»` };
  });

await prueba('PT-04', 'Enlaces y recursos internos', 'Recorrer todas las páginas y lugares, recolectar href/src internos y solicitarlos.',
  'Todos los enlaces y recursos internos responden HTTP 200 (sin enlaces rotos).', async () => {
    const ctx = await browser.newContext(); const p = await ctx.newPage();
    const paginas = ['index.html', 'marcadores.html', 'creditos.html', 'brochure.html', ...LUGARES.flatMap((l) => [`lugar.html?l=${l}`, `vista3d.html?l=${l}`])];
    const urls = new Set(); const externos = new Set();
    for (const pg of paginas) {
      await p.goto(`${base}/${pg}`, { waitUntil: 'networkidle' });
      const refs = await p.evaluate(() => [...document.querySelectorAll('a[href],img[src],script[src],link[href]')].map((e) => e.href || e.src));
      refs.forEach((u) => { if (!u || u.startsWith('data:') || u.startsWith('javascript:')) return; const x = new URL(u); if (x.origin === base) urls.add(x.href.split('#')[0]); else externos.add(x.origin); });
    }
    const rotos = [];
    for (const u of urls) { const r = await p.request.get(u); if (r.status() !== 200) rotos.push(`${u} → ${r.status()}`); }
    await ctx.close();
    return { ok: rotos.length === 0, obtenido: `${urls.size} URL internas verificadas, ${rotos.length} rotas${rotos.length ? ': ' + rotos.join('; ') : ''}. Enlaces externos (fuentes, no verificados aquí): ${externos.size}` };
  });

await prueba('PT-05', 'Ausencia de dependencias externas en tiempo de ejecución', 'Abrir ar.html y vista3d.html registrando todas las solicitudes de red.',
  'Ninguna solicitud sale del dominio del sitio (sin CDN, analítica ni rastreadores).', async () => {
    const ctx = await browser.newContext(); const p = await ctx.newPage(); const ext = [];
    p.on('request', (r) => { if (!r.url().startsWith(base) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) ext.push(r.url()); });
    for (const l of LUGARES) { await p.goto(`${base}/vista3d.html?l=${l}`, { waitUntil: 'networkidle' }); await p.goto(`${base}/ar.html?l=${l}`, { waitUntil: 'networkidle' }); }
    await ctx.close();
    return { ok: ext.length === 0, obtenido: ext.length ? 'Externas: ' + ext.join(', ') : '0 solicitudes externas' };
  });

await prueba('PT-06', 'Diseño adaptable (sin desbordamiento horizontal)', 'Abrir cada página a 360 px de ancho y comparar scrollWidth con el ancho de la ventana.',
  'Ninguna página produce desplazamiento horizontal en móvil.', async () => {
    const ctx = await browser.newContext({ ...MOBILE, viewport: { width: 360, height: 760 } }); const p = await ctx.newPage(); const malas = [];
    for (const pg of ['index.html', 'lugar.html?l=barichara', 'lugar.html?l=chicamocha', 'lugar.html?l=sangil', 'marcadores.html', 'creditos.html', 'vista3d.html?l=sangil', 'ar.html?l=barichara']) {
      await p.goto(`${base}/${pg}`, { waitUntil: 'networkidle' });
      const [sw, cw] = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      if (sw > cw + 1) malas.push(`${pg} (${sw}>${cw})`);
    }
    await shot(p, 'PT-06_ar_inicio_360.png'); await ctx.close();
    return { ok: malas.length === 0, obtenido: malas.length ? 'Desbordan: ' + malas.join(', ') : '8 páginas sin desbordamiento a 360 px', evidencia: 'tests/evidence/PT-06_ar_inicio_360.png' };
  });

await prueba('PT-07', 'Accesibilidad básica', 'Revisar en todas las páginas: imágenes con alt, botones/enlaces con nombre accesible, idioma del documento.',
  'Todas las imágenes tienen alt, todos los controles tienen nombre y lang="es".', async () => {
    const ctx = await browser.newContext(MOBILE); const p = await ctx.newPage(); const probl = [];
    for (const pg of ['index.html', 'lugar.html?l=sangil', 'ar.html?l=sangil', 'vista3d.html?l=sangil', 'marcadores.html', 'brochure.html']) {
      await p.goto(`${base}/${pg}`, { waitUntil: 'networkidle' });
      const r = await p.evaluate(() => ({
        lang: document.documentElement.lang,
        sinAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
        sinNombre: [...document.querySelectorAll('button, a[href]')].filter((b) => !(b.getAttribute('aria-label') || b.textContent.trim())).length,
      }));
      if (r.lang !== 'es' || r.sinAlt || r.sinNombre) probl.push(`${pg}: ${JSON.stringify(r)}`);
    }
    await ctx.close();
    return { ok: probl.length === 0, obtenido: probl.length ? probl.join('; ') : '6 páginas sin problemas detectados' };
  });

// ───────── Vista 3D sin cámara (alternativa informativa)
await prueba('PT-08', 'Vista 3D sin cámara', 'Abrir vista3d.html de cada lugar, esperar el render, pulsar el primer punto y el botón de acción.',
  'El modelo se dibuja, el panel de información muestra el punto y el botón cambia de estado; la página indica que no es RA.', async () => {
    const ctx = await browser.newContext(MOBILE); const p = await ctx.newPage(); const errs = vigilar(p); const det = [];
    for (const l of LUGARES) {
      await p.goto(`${base}/vista3d.html?l=${l}`);
      await p.waitForFunction(() => window.__visor && window.__visor.listo);
      await p.click('#chips .chip >> nth=0');
      const t = await p.textContent('#sheet-t');
      await p.click('.sheet .cerrar');
      await p.click('#accion'); const pressed = await p.getAttribute('#accion', 'aria-pressed');
      const banner = await p.textContent('#banner');
      await p.waitForTimeout(400);
      await shot(p, `PT-08_vista3d_${l}.png`);
      det.push(`${l}: «${t}», acción=${pressed}`);
      if (!t || pressed !== 'true' || !banner.includes('no es realidad aumentada')) throw new Error('Estado inesperado en ' + l);
    }
    await ctx.close();
    return { ok: errs.length === 0, obtenido: det.join('; ') + `; errores de consola: ${errs.length}`, evidencia: 'tests/evidence/PT-08_vista3d_*.png' };
  });

// ───────── Comprobaciones de compatibilidad
await prueba('PT-09', 'Contexto no seguro (HTTP fuera de localhost)', 'Abrir ar.html mediante http://santander.test (resuelto a 127.0.0.1) para simular un sitio sin HTTPS.',
  'Se muestra el panel «Dispositivo o conexión no compatible» explicando HTTPS y se ofrece la vista 3D.', async () => {
    const b2 = await launchBrowser([`--host-resolver-rules=MAP santander.test 127.0.0.1`]);
    const ctx = await b2.newContext(MOBILE); const p = await ctx.newPage();
    await p.goto(`http://santander.test:${PORT}/ar.html?l=barichara`);
    await p.waitForSelector('#panel-error:not([hidden])');
    const t = await p.textContent('#err-t'); const txt = await p.textContent('#err-p'); const alt = await p.getAttribute('#err-alt', 'href');
    const ev = await shot(p, 'PT-09_no_https.png'); await b2.close();
    return { ok: txt.includes('HTTPS') && alt.includes('vista3d'), obtenido: `«${t}» · menciona HTTPS: ${txt.includes('HTTPS')} · alternativa: ${alt}`, evidencia: ev };
  });

await prueba('PT-10', 'Permiso de cámara denegado', 'Simular que el usuario rechaza el permiso: getUserMedia se sustituye antes de cargar la página para que lance NotAllowedError (el diálogo de permisos real no puede automatizarse en modo sin interfaz). Pulsar «Activar cámara».',
  'Se muestra «Permiso de cámara denegado» con instrucciones para habilitarlo, botón Reintentar y acceso a la vista 3D.', async () => {
    const ctx = await browser.newContext(MOBILE); const p = await ctx.newPage();
    await p.addInitScript(() => { navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException('Permission denied', 'NotAllowedError')); });
    await p.goto(`${base}/ar.html?l=chicamocha`); await p.click('#iniciar');
    await p.waitForSelector('#panel-error:not([hidden])', { timeout: 15000 });
    const t = await p.textContent('#err-t'); const err = await p.evaluate(() => window.__sar.errorCamara);
    const reintentar = await p.isVisible('#err-reintentar'); const alt = await p.getAttribute('#err-alt', 'href');
    const ev = await shot(p, 'PT-10_permiso_denegado.png'); await ctx.close();
    return { ok: t.includes('denegado') && reintentar && alt.includes('vista3d'), obtenido: `«${t}» (error ${err}); Reintentar visible: ${reintentar}; alternativa: ${alt}`, evidencia: ev };
  });

await prueba('PT-10b', 'Dispositivo sin cámara', 'Chromium real sin cámara disponible (sin dispositivo simulado). Pulsar «Activar cámara».',
  'getUserMedia falla con NotFoundError y se muestra «No se encontró una cámara» con acceso a la vista 3D.', async () => {
    const ctx = await browser.newContext(MOBILE); const p = await ctx.newPage();
    await p.goto(`${base}/ar.html?l=sangil`); await p.click('#iniciar');
    await p.waitForSelector('#panel-error:not([hidden])', { timeout: 15000 });
    const t = await p.textContent('#err-t'); const err = await p.evaluate(() => window.__sar.errorCamara);
    const ev = await shot(p, 'PT-10b_sin_camara.png'); await ctx.close();
    return { ok: err === 'NotFoundError' && t.includes('cámara'), obtenido: `«${t}» (error ${err})`, evidencia: ev };
  });

// ───────── Realidad aumentada con cámara simulada
await browser.close();
const detecciones = {};
for (const l of LUGARES) {
  const bAR = await launchBrowser(['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-video-capture=${path.join(FIX, l + '.y4m')}`]);
  const ctx = await bAR.newContext({ viewport: { width: 480, height: 640 } });
  const p = await ctx.newPage(); const errs = vigilar(p);
  const n = { barichara: 'PT-11', chicamocha: 'PT-12', sangil: 'PT-13' }[l];
  await prueba(n, `RA: permiso concedido y reconocimiento del marcador (${l})`,
    `Cámara simulada con tests/fixtures/${l}.png (marcador en perspectiva sobre una mesa). Abrir ar.html?l=${l}, pulsar «Activar cámara» y esperar el evento targetFound de MindAR.`,
    'MindAR arranca (arReady), reconoce la ilustración (targetFound), oculta la guía de escaneo, muestra los controles y dibuja el modelo anclado.', async () => {
      await p.goto(`${base}/ar.html?l=${l}`);
      await p.click('#iniciar');
      const t0 = Date.now();
      await p.waitForFunction(() => window.__sar && window.__sar.vecesEncontrado > 0, null, { timeout: 30000 });
      const seg = ((Date.now() - t0) / 1000).toFixed(1);
      await p.waitForTimeout(1200);
      const s = await p.evaluate(() => ({ fase: window.__sar.fase, modelo: window.__sar.modeloListo, tools: !document.getElementById('tools').hidden, scan: !document.getElementById('scan').hidden }));
      const ev = await shot(p, `${n}_ra_${l}_detectado.png`);
      detecciones[l] = seg;
      return { ok: s.fase === 'rastreando' && s.modelo && s.tools && !s.scan && errs.length === 0, obtenido: `Detectado en ${seg} s; fase=${s.fase}; controles visibles=${s.tools}; guía oculta=${!s.scan}; errores=${errs.length}`, evidencia: ev };
    });
  if (l === 'barichara') {
    await prueba('PT-14', 'RA: tocar un pin numerado del modelo', 'Con el marcador detectado, proyectar el pin «columnas» a pantalla y hacer clic sobre él.',
      'Se abre la hoja de información con el título del punto y su fuente.', async () => {
        const pos = await p.evaluate(() => window.__sar.proyectar('columnas'));
        await p.mouse.click(pos.x, pos.y);
        await p.waitForSelector('.sheet.open', { timeout: 3000 });
        const t = await p.textContent('#sheet-t'); const src = await p.textContent('#sheet-s');
        const ev = await shot(p, 'PT-14_ra_pin_tocado.png');
        await p.click('.sheet .cerrar');
        return { ok: t.includes('columnas') && src.includes('Fuente'), obtenido: `Clic en (${pos.x.toFixed(0)}, ${pos.y.toFixed(0)}) → «${t}»; ${src.slice(0, 60)}…`, evidencia: ev };
      });
    await prueba('PT-15', 'RA: controles del modelo', 'Pulsar girar derecha ×2, ampliar ×1, «Ver las 10 columnas» y luego restablecer.',
      'La rotación pasa a π/4 y la escala de 0,8 a 0,96; el botón de acción alterna su estado (aria-pressed) y su etiqueta; restablecer vuelve a 0 rad y escala 0,8.', async () => {
        await p.click('[data-cmd="der"]'); await p.click('[data-cmd="der"]'); await p.click('[data-cmd="mas"]');
        const a = await p.evaluate(() => ({ r: window.__sar.rotacion, e: window.__sar.escala }));
        await p.click('#accion'); const pr = await p.getAttribute('#accion', 'aria-pressed'); const et = await p.textContent('#accion');
        await p.waitForTimeout(500); const ev = await shot(p, 'PT-15_ra_columnas.png');
        await p.click('[data-cmd="reset"]'); const b = await p.evaluate(() => ({ r: window.__sar.rotacion, e: window.__sar.escala }));
        return { ok: Math.abs(a.r - Math.PI / 4) < 1e-6 && Math.abs(a.e - 0.96) < 1e-6 && pr === 'true' && b.r === 0 && Math.abs(b.e - 0.8) < 1e-6, obtenido: `rot=${a.r.toFixed(3)} rad, escala=${a.e.toFixed(2)}; acción=${pr} («${et}»); tras restablecer rot=${b.r}, escala=${b.e}`, evidencia: ev };
      });
    await prueba('PT-16', 'RA: gesto de arrastre para girar', 'Simular arrastre horizontal de 120 px sobre la vista de cámara.',
      'El modelo gira alrededor de su eje vertical sin abrir información.', async () => {
        await p.mouse.move(240, 300); await p.mouse.down(); await p.mouse.move(300, 300, { steps: 5 }); await p.mouse.move(360, 300, { steps: 5 }); await p.mouse.up();
        const r = await p.evaluate(() => { const s = document.querySelector('a-scene'); let rot = null; s.object3D.traverse((o) => { if (o.type === 'Group' && o.children[0] && o.children[0].name === 'Barichara') rot = o.rotation.y; }); return rot; });
        const abierta = await p.evaluate(() => document.querySelector('.sheet').classList.contains('open'));
        return { ok: r > 1 && !abierta, obtenido: `rotación tras arrastre = ${r.toFixed(2)} rad; hoja abierta=${abierta}` };
      });
  }
  await ctx.close(); await bAR.close();
}

await prueba('PT-17', 'RA: escena sin marcador', 'Cámara simulada con una mesa vacía (tests/fixtures/vacio.y4m). Iniciar la RA y esperar 10 s.',
  'No se reconoce ningún marcador; la guía «Apunte a la ilustración» permanece visible y no aparece el modelo.', async () => {
    const bAR = await launchBrowser(['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-video-capture=${path.join(FIX, 'vacio.y4m')}`]);
    const p = await (await bAR.newContext({ viewport: { width: 480, height: 640 } })).newPage();
    await p.goto(`${base}/ar.html?l=sangil`); await p.click('#iniciar');
    await p.waitForFunction(() => window.__sar.fase === 'escaneando', null, { timeout: 30000 });
    await p.waitForTimeout(10000);
    const s = await p.evaluate(() => ({ n: window.__sar.vecesEncontrado, scan: !document.getElementById('scan').hidden }));
    const ev = await shot(p, 'PT-17_ra_sin_marcador.png'); await bAR.close();
    return { ok: s.n === 0 && s.scan, obtenido: `detecciones=${s.n}; guía visible=${s.scan}`, evidencia: ev };
  });

await prueba('PT-18', 'RA: marcador equivocado', 'Cámara simulada mostrando el marcador de San Gil mientras se abre la experiencia de Barichara; esperar 10 s.',
  'La experiencia de Barichara no reacciona al marcador de otro lugar (no hay falsos positivos).', async () => {
    const bAR = await launchBrowser(['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-video-capture=${path.join(FIX, 'sangil.y4m')}`]);
    const p = await (await bAR.newContext({ viewport: { width: 480, height: 640 } })).newPage();
    await p.goto(`${base}/ar.html?l=barichara`); await p.click('#iniciar');
    await p.waitForFunction(() => window.__sar.fase === 'escaneando', null, { timeout: 30000 });
    await p.waitForTimeout(10000);
    const n = await p.evaluate(() => window.__sar.vecesEncontrado); await bAR.close();
    return { ok: n === 0, obtenido: `detecciones=${n}` };
  });

server.close();
const resumen = { fecha: new Date().toISOString(), navegador: 'Chromium sin interfaz (Playwright), WebGL por SwiftShader, cámara simulada', total: resultados.length, aprobadas: resultados.filter((r) => r.estado === 'Aprobada').length, detecciones, resultados };
fs.writeFileSync(path.join(root, 'tests/resultados.json'), JSON.stringify(resumen, null, 2));
console.log(`\n${resumen.aprobadas}/${resumen.total} pruebas aprobadas. Resultados en tests/resultados.json`);
process.exit(resumen.aprobadas === resumen.total ? 0 : 1);
