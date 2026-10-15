// Genera docs/07_matriz_pruebas.md a partir de los resultados reales de las pruebas
// (tests/resultados.json y tests/resultados_qr.json) más la lista de pruebas pendientes.
// Uso: node scripts/generar_matriz.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const e2e = JSON.parse(fs.readFileSync(path.join(root, 'tests/resultados.json'), 'utf8'));
const qrFile = path.join(root, 'tests/resultados_qr.json');
const qr = fs.existsSync(qrFile) ? JSON.parse(fs.readFileSync(qrFile, 'utf8')) : [];
const filas = [...e2e.resultados, ...qr];
const cel = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

const PENDIENTES = [
  ['PP-01', 'RA en teléfono Android físico (Chrome)', 'Publicar por HTTPS, escanear el QR impreso, iniciar RA y apuntar a cada ilustración impresa en hoja A4.', 'Detección en < 5 s con buena luz; modelo estable; 30 fps aproximados.', 'Sin acceso a un dispositivo físico en el entorno de desarrollo.'],
  ['PP-02', 'RA en iPhone físico (Safari)', 'Igual que PP-01 en Safari iOS.', 'Igual que PP-01; el diálogo de permiso aparece y se respeta.', 'Sin acceso a un iPhone.'],
  ['PP-03', 'Diálogo real de permiso de cámara', 'En un teléfono, pulsar «Activar cámara» y elegir «Bloquear»; luego habilitar desde los ajustes del sitio.', 'Aparece «Permiso de cámara denegado»; tras habilitar y recargar, la RA funciona.', 'El diálogo nativo no se puede automatizar en modo sin interfaz (PT-10 lo simula).'],
  ['PP-04', 'QR con dominio público definitivo', 'Publicar el sitio, ejecutar `npm run build:brochure -- <URL>` y `npm run test:qr -- entregables/Santander_AR_brochure.pdf`; escanear los QR impresos con 2 teléfonos.', 'Los 4 QR abren las páginas correctas por HTTPS.', 'Aún no existe una URL pública: el proyecto no está publicado.'],
  ['PP-05', 'Pérdida y recuperación del marcador', 'Con la RA activa, retirar la ilustración del encuadre y volver a enfocarla.', 'Reaparece la guía de escaneo; al volver, el modelo se ancla de nuevo.', 'La cámara simulada no permite cambiar la escena durante la prueba; requiere dispositivo.'],
  ['PP-06', 'Rendimiento y temperatura', 'Usar la RA 3 minutos continuos en un teléfono de gama media.', 'Sin cierres del navegador; fluidez aceptable.', 'Requiere dispositivo físico.'],
  ['PP-07', 'Condiciones de luz y reflejos', 'Probar con luz baja, luz directa sobre papel brillante y la ilustración en una pantalla.', 'Se documenta en qué condiciones falla la detección.', 'Requiere dispositivo físico y material impreso.'],
  ['PP-08', 'Prueba de usabilidad con usuarios', 'Sesión con 5 personas del público objetivo: tareas «abrir un lugar con el QR», «activar la RA», «leer un dato», «usar la acción»; registrar tiempos, errores y escala SUS.', '≥ 4 de 5 completan las tareas sin ayuda; SUS ≥ 68.', 'No se han realizado sesiones con usuarios. La hipótesis del proyecto sigue sin validar.'],
];

const aprob = filas.filter((f) => f.estado === 'Aprobada').length;
let md = `# 7. Matriz de pruebas

> Documento generado por \`scripts/generar_matriz.mjs\` a partir de los resultados reales de \`tests/resultados.json\` y \`tests/resultados_qr.json\`.
> Última ejecución: ${e2e.fecha} · Entorno: ${e2e.navegador}.

## 7.1 Resumen

- Pruebas automatizadas ejecutadas: **${filas.length}** · aprobadas: **${aprob}** · fallidas: **${filas.length - aprob}**.
- Pruebas pendientes (requieren dispositivo físico, publicación o usuarios): **${PENDIENTES.length}**.
- Tiempo de detección del marcador con cámara simulada: ${Object.entries(e2e.detecciones || {}).map(([k, v]) => `${k} ${v} s`).join(' · ')} (incluye carga de MindAR y del archivo .mind).

**Alcance de la evidencia.** Las pruebas de RA usan el motor real de MindAR en Chromium, alimentado con una cámara simulada que muestra una foto sintética del marcador en perspectiva sobre una mesa. Demuestran que la integración funciona (reconocimiento, anclaje, interacción, manejo de errores), **no** que funcione en un teléfono concreto: eso corresponde a las pruebas pendientes PP-01 a PP-07.

## 7.2 Pruebas ejecutadas

| ID | Función probada | Procedimiento | Resultado esperado | Resultado obtenido | Estado | Evidencia |
|---|---|---|---|---|---|---|
${filas.map((f) => `| ${f.id} | ${cel(f.funcion)} | ${cel(f.procedimiento)} | ${cel(f.esperado)} | ${cel(f.obtenido)} | ${f.estado === 'Aprobada' ? '✅ Aprobada' : '❌ Fallida'} | ${cel(f.evidencia)} |`).join('\n')}

## 7.3 Pruebas pendientes (no ejecutadas)

| ID | Función a probar | Procedimiento | Resultado esperado | Motivo por el que está pendiente | Estado |
|---|---|---|---|---|---|
${PENDIENTES.map((p) => `| ${p.map(cel).join(' | ')} | ⏳ Pendiente |`).join('\n')}

## 7.4 Cómo repetir las pruebas

\`\`\`bash
npm run test:fixtures          # genera los videos Y4M de cámara simulada (≈ 54 MB, no se incluyen en el ZIP)
npm test                       # PT-01 … PT-18 (Playwright + Chromium)
npm start &                    # sirve web/ en http://localhost:8080
npm run build:brochure         # PDF con QR de prueba local
npm run test:qr                # PT-19 y PT-20
npm run matriz                 # regenera este documento
\`\`\`
`;
fs.writeFileSync(path.join(root, 'docs/07_matriz_pruebas.md'), md);
console.log(`ok docs/07_matriz_pruebas.md (${filas.length} ejecutadas, ${aprob} aprobadas, ${PENDIENTES.length} pendientes)`);
