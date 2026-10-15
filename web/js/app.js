/* Santander AR — utilidades compartidas de interfaz (sin dependencias). */
(function () {
  const D = window.SANTANDER_DATA;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const param = (name) => new URLSearchParams(location.search).get(name);

  /** Numeración estable de fuentes para una lista de claves. */
  function indiceFuentes(claves) {
    const orden = [];
    claves.forEach((k) => { if (!orden.includes(k)) orden.push(k); });
    return orden;
  }

  /** Referencias [n] enlazadas a la lista de fuentes de la página. */
  function refs(fuentes, orden) {
    return fuentes.map((k) => `<a class="ref" href="#fuente-${orden.indexOf(k) + 1}" aria-label="Fuente ${orden.indexOf(k) + 1}">[${orden.indexOf(k) + 1}]</a>`).join('');
  }

  function listaFuentes(orden) {
    return orden.map((k, i) => {
      const f = D.FUENTES[k];
      return `<li id="fuente-${i + 1}"><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titulo)}</a>. ${esc(f.nota)} Consultado el ${esc(D.FECHA_CONSULTA)}.</li>`;
    }).join('');
  }

  /** Nombres de fuente de un punto de información (para la hoja de RA/visor). */
  function fuentesTexto(claves) {
    return claves.map((k) => D.FUENTES[k].titulo.split(' — ').slice(-1)[0]).filter((v, i, a) => a.indexOf(v) === i).join(' · ');
  }

  /** Hoja inferior de información reutilizable. */
  function crearHoja() {
    const el = document.createElement('aside');
    el.className = 'sheet'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'false'); el.setAttribute('aria-labelledby', 'sheet-t');
    el.innerHTML = '<button class="cerrar" type="button" aria-label="Cerrar información">×</button><div class="eyebrow" id="sheet-k"></div><h3 id="sheet-t"></h3><p id="sheet-p"></p><p class="src" id="sheet-s"></p>';
    document.body.appendChild(el);
    const cerrar = () => { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); };
    el.querySelector('.cerrar').addEventListener('click', cerrar);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
    cerrar();
    return {
      mostrar(punto, indice) {
        el.querySelector('#sheet-k').textContent = `Punto ${indice} · dato verificado`;
        el.querySelector('#sheet-t').textContent = punto.titulo;
        el.querySelector('#sheet-p').textContent = punto.texto;
        el.querySelector('#sheet-s').textContent = 'Fuente: ' + fuentesTexto(punto.fuente) + '. Más detalles en la página del lugar.';
        el.classList.add('open'); el.setAttribute('aria-hidden', 'false');
        el.querySelector('.cerrar').focus({ preventScroll: true });
      },
      cerrar,
      get abierta() { return el.classList.contains('open'); },
    };
  }

  /** Comprobaciones de compatibilidad previas a la RA. Devuelve lista de problemas. */
  function compatibilidad() {
    const problemas = [];
    if (!window.isSecureContext) problemas.push({ codigo: 'inseguro', texto: 'La página no se abrió por HTTPS. Los navegadores solo permiten la cámara en sitios seguros (https:// o localhost).' });
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) problemas.push({ codigo: 'sin-camara-api', texto: 'Este navegador no ofrece acceso a la cámara (getUserMedia). Pruebe con Chrome o Safari actualizados.' });
    try {
      const c = document.createElement('canvas');
      if (!(c.getContext('webgl2') || c.getContext('webgl'))) problemas.push({ codigo: 'sin-webgl', texto: 'El dispositivo no soporta WebGL, necesario para dibujar el modelo 3D.' });
    } catch (e) { problemas.push({ codigo: 'sin-webgl', texto: 'No fue posible inicializar WebGL.' }); }
    return problemas;
  }

  /** Traduce errores de getUserMedia a mensajes comprensibles. */
  function mensajeErrorCamara(err) {
    const n = err && err.name;
    if (n === 'NotAllowedError' || n === 'SecurityError') return { titulo: 'Permiso de cámara denegado', texto: 'Santander AR necesita la cámara solo para reconocer la ilustración y dibujar el modelo encima. Para habilitarla, toque el ícono de candado o de ajustes junto a la dirección del sitio, permita «Cámara» y recargue la página.' };
    if (n === 'NotFoundError' || n === 'OverconstrainedError') return { titulo: 'No se encontró una cámara', texto: 'El dispositivo no tiene una cámara disponible. Puede explorar el modelo en la vista 3D sin cámara.' };
    if (n === 'NotReadableError' || n === 'AbortError') return { titulo: 'La cámara está ocupada', texto: 'Otra aplicación o pestaña está usando la cámara. Ciérrela y vuelva a intentarlo.' };
    return { titulo: 'No se pudo iniciar la cámara', texto: 'Ocurrió un error inesperado al abrir la cámara' + (n ? ` (${n})` : '') + '. Recargue la página o use la vista 3D sin cámara.' };
  }

  window.SAR = { D, esc, param, refs, listaFuentes, indiceFuentes, fuentesTexto, crearHoja, compatibilidad, mensajeErrorCamara };
})();
