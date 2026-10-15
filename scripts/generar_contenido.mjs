// Genera docs/10_contenido_y_fuentes.md desde web/js/data.js (única fuente del contenido).
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(root, 'web/js/data.js'), 'utf8'), ctx);
const D = ctx.window.SANTANDER_DATA;
const orden = []; D.LUGARES.forEach((l) => [...l.datos, ...l.puntos].forEach((d) => d.fuente.forEach((k) => { if (!orden.includes(k)) orden.push(k); })));
const ref = (fs_) => fs_.map((k) => `[${orden.indexOf(k) + 1}]`).join('');
let md = `# 10. Contenido de los lugares y fuentes\n\n> Generado desde \`web/js/data.js\` con \`node scripts/generar_contenido.mjs\`. Fecha de consulta de las fuentes: ${D.FECHA_CONSULTA}.\n> **Dato** = afirmación verificada en la fuente citada. **Relato** = interpretación narrativa del equipo.\n\n`;
for (const l of D.LUGARES) {
  md += `## ${l.numero}. ${l.nombre}\n\n*${l.subtitulo} · ${l.provincia}* — Marcador \`${l.codigo}\`\n\n${l.resumen}\n\n### Datos verificados\n\n${l.datos.map((d) => `- ${d.t} ${ref(d.fuente)}`).join('\n')}\n\n`;
  md += `### Relato (interpretación del equipo)\n\n> ${l.relato}\n\n### Experiencia 3D: ${l.modelo.titulo}\n\n- Aviso mostrado: «${l.modelo.aviso}»\n- Acción: «${l.modelo.accion.etiqueta}» / «${l.modelo.accion.etiquetaActiva}»\n- Puntos de información:\n${l.puntos.map((p, i) => `  ${i + 1}. **${p.titulo}** — ${p.texto} ${ref(p.fuente)}`).join('\n')}\n\n`;
}
md += `## Fuentes\n\n${orden.map((k, i) => `${i + 1}. ${D.FUENTES[k].titulo}. ${D.FUENTES[k].nota} <${D.FUENTES[k].url}> (consultado el ${D.FECHA_CONSULTA}).`).join('\n')}\n\n`;
md += `## Observaciones editoriales\n\n- Colombia Travel describe el cañón del Chicamocha como «el segundo cañón más grande del planeta» y más profundo que el Gran Cañón del Colorado. Es una afirmación promocional que no se pudo contrastar con una fuente geográfica independiente, por eso **no se incluye** en la experiencia; solo se usan la longitud y profundidad aproximadas que reporta la misma fuente, atribuidas a ella.\n- La crónica de Radio Nacional menciona que Barichara sería «Patrimonio Histórico y Cultural de la Humanidad»; no se encontró respaldo de esa declaratoria en las demás fuentes, por lo que **no se usa**.\n- Para Barichara no se publica un año de fundación: Wikipedia en español no lo indica y la versión en inglés da 1705 sin fuente contrastada. Tampoco se usa la fecha de erección de la parroquia (1751), para no confundirla con la fundación.\n- Los datos de Wikipedia se tomaron de artículos que citan fuentes institucionales (SINIC, Alcaldía, FONTUR, DANE). Para un uso público definitivo conviene confirmarlos con esas fuentes primarias.\n`;
fs.writeFileSync(path.join(root, 'docs/10_contenido_y_fuentes.md'), md); console.log('ok docs/10_contenido_y_fuentes.md');
