# 4. Tecnologías e implementación

## 4.1 Criterios de selección

Compatibilidad móvil sin instalar app · reconocimiento de imágenes · modelos 3D · cámara y HTTPS · costo y licencias · facilidad de publicación por QR · documentación oficial · dependencia de servicios externos · viabilidad para una demostración académica.

## 4.2 Opciones evaluadas

| Opción | Seguimiento | Navegadores | Costo / licencia | Dependencia externa | Evaluación |
|---|---|---|---|---|---|
| **MindAR (image tracking)** | Imagen natural (ilustración) | Navegadores con WebGL + `getUserMedia` (Android e iOS) | Gratuito, MIT | Ninguna (archivos locales) | **Elegida** |
| AR.js | Marcadores tipo patrón/código de barras, imagen (NFT) y ubicación | Igual que MindAR | Gratuito, MIT | Ninguna | Viable. Los marcadores clásicos exigen un borde negro cuadrado (menos estético para una cartilla); el seguimiento NFT requiere generar descriptores aparte. |
| WebXR `immersive-ar` | Superficies (planos) | Chrome Android con ARCore; en Safari de iPhone no se encontró soporte general en la información consultada | Estándar web | Ninguna | Descartada: dejaría fuera a usuarios de iPhone y no ancla a la cartilla. |
| Plataformas comerciales (8th Wall, Zappar, la mostrada en clase, etc.) | Variable | Variable | Planes y límites de uso que cambian; requieren cuenta | Alta (servicio del proveedor) | Descartadas para el MVP: cuenta obligatoria, posibles costos y límites; el código no queda bajo control del equipo. El profesor permitió investigar alternativas (E6). |
| three.js puro | — (solo 3D) | Todos con WebGL | MIT | Ninguna | Usado solo para la vista 3D sin cámara. |

## 4.3 Tecnologías seleccionadas y justificación

| Tecnología | Versión | Por qué |
|---|---|---|
| **MindAR** | 1.2.5 | Seguimiento de imágenes naturales en el navegador; integración oficial con A-Frame; compilador de marcadores incluido; MIT. La guía oficial de inicio rápido usa esta versión. |
| **A-Frame** | 1.6.0 | Escena declarativa sobre three.js; es la versión que usa la guía oficial de MindAR. |
| **three.js** | 0.164.1 | Misma versión del motor incluido en A-Frame 1.6.0 (super-three 0.164), para que `models.js` funcione igual en RA y en la vista 3D. |
| **qrcode-generator** | 2.0.4 | QR en el propio navegador, sin servicios externos; MIT. |
| **Fraunces / Work Sans** | Fontsource 5.3.0 | Tipografías abiertas (OFL), servidas localmente. |
| **Playwright + Chromium** | 1.64.1 | Pruebas automatizadas con cámara simulada; generación del PDF; compilación de marcadores y exportación GLB. Solo en desarrollo. |
| **Mermaid** | 11.17.2 | Diagramas como código. Solo en desarrollo. |
| **Python (Pillow, OpenCV, PyMuPDF)** | — | Ilustraciones procedurales, videos de prueba, decodificación de QR. Solo en desarrollo. |

No se usa ningún *framework* de interfaz ni empaquetador: el sitio son archivos estáticos legibles y publicables tal cual.

## 4.4 Requisitos de la plataforma web

- **HTTPS obligatorio** para la cámara (excepto `localhost`). GitHub Pages y Netlify lo ofrecen gratis.
- **WebGL** para dibujar los modelos.
- **`getUserMedia`** con cámara trasera (`facingMode: environment`).
- Permiso de cámara concedido por el usuario tras una acción explícita.

## 4.5 Implementación (resumen por componente)

**Marcadores (`scripts/generar_marcadores.py`).** Ilustraciones procedurales de 1200×900 con mucho detalle, bordes irregulares y semillas fijas (reproducibles). Cada una incluye un código (`BAR-01`, `CHI-02`, `SGL-03`) y el rótulo «ilustración original (no a escala)».

**Compilación (`scripts/compilar_targets.mjs`).** Ejecuta el compilador oficial de MindAR (`Compiler.compileImageTargets`) en Chromium sin interfaz y guarda un `.mind` por lugar. Es equivalente a usar la herramienta web de compilación de MindAR.

**Contenido (`js/data.js`).** Cada dato es un objeto `{ t, fuente[] }`; los puntos de información tienen `{ id, titulo, texto, fuente[] }`; las fuentes tienen título, URL y nota. La interfaz numera las fuentes automáticamente.

**Modelos (`js/models.js`).** `build(THREE, id)` devuelve `{ root, hotspots, update(dt), setAction(on) }`:
- *Barichara:* plaza de adoquines (`InstancedMesh`), templo con fachada de sillares de tonos variados, dos torres, casas con teja y 10 columnas interiores que se revelan al volver translúcidos los muros.
- *Chicamocha:* terreno de 120×88 segmentos con un valle sinuoso, terrazas de color como estratos, faldón lateral, río (tubo), dos estaciones y cabina que recorre una curva de Bézier.
- *San Gil:* lecho de agua, isla orgánica extruida, 14 árboles con 14 filamentos de «barba de viejo» cada uno que oscilan, espuma que corre por el río.
Los pines son *sprites* con textura de canvas (sin fuentes externas).

**Experiencia RA (`ar.html`).** Comprobación de compatibilidad → panel explicativo → sondeo de cámara → `mindar-image-system.start()` → eventos `arReady`, `targetFound`, `targetLost`, `arError`. Gestos con *pointer events*; raycasting contra pines; chips accesibles equivalentes; libera la cámara en `pagehide`; elimina el botón VR que A-Frame inyecta.

**Vista 3D (`vista3d.html`).** three.js con OrbitControls, autorrotación hasta el primer toque, mismos pines y acción; cámara que se aleja en pantallas verticales; aviso permanente «no es realidad aumentada».

**Brochure (`brochure.html` → `scripts/generar_brochure.mjs`).** 6 páginas A4 con CSS de impresión; los QR se generan con la URL de publicación; si la base es local, se muestra un aviso «QR de prueba local».

## 4.6 Fuentes técnicas consultadas (14 de octubre de 2026)

- MindAR, documentación oficial — Quick Start: https://hiukim.github.io/mind-ar-js-doc/quick-start/overview
- Paquetes npm y sus licencias (verificadas en `package.json` de cada paquete instalado): `mind-ar@1.2.5` (MIT), `aframe@1.6.0` (MIT), `three@0.164.1` (MIT), `qrcode-generator@2.0.4` (MIT), `@fontsource/fraunces` y `@fontsource/work-sans` (OFL-1.1).
- AR.js (organización y repositorios): https://github.com/AR-js-org
- Estado de WebXR entre navegadores (2026): https://vr.org/articles/webxr-interop-2026-cross-browser-standard — solo menciona Safari en visionOS; no se encontró evidencia de `immersive-ar` general en Safari para iPhone.
