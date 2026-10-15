# 7. Matriz de pruebas

> Documento generado por `scripts/generar_matriz.mjs` a partir de los resultados reales de `tests/resultados.json` y `tests/resultados_qr.json`.
> Última ejecución: 2026-10-15T00:01:38.364Z · Entorno: Chromium sin interfaz (Playwright), WebGL por SwiftShader, cámara simulada.

## 7.1 Resumen

- Pruebas automatizadas ejecutadas: **21** · aprobadas: **21** · fallidas: **0**.
- Pruebas pendientes (requieren dispositivo físico, publicación o usuarios): **8**.
- Tiempo de detección del marcador con cámara simulada: barichara 3.1 s · chicamocha 3.4 s · sangil 3.2 s (incluye carga de MindAR y del archivo .mind).

**Alcance de la evidencia.** Las pruebas de RA usan el motor real de MindAR en Chromium, alimentado con una cámara simulada que muestra una foto sintética del marcador en perspectiva sobre una mesa. Demuestran que la integración funciona (reconocimiento, anclaje, interacción, manejo de errores), **no** que funcione en un teléfono concreto: eso corresponde a las pruebas pendientes PP-01 a PP-07.

## 7.2 Pruebas ejecutadas

| ID | Función probada | Procedimiento | Resultado esperado | Resultado obtenido | Estado | Evidencia |
|---|---|---|---|---|---|---|
| PT-01 | Carga de la página principal | Abrir index.html en viewport móvil 390×844 y contar los lugares listados. | La página carga sin errores de consola y muestra 3 lugares. | HTTP 200, 3 lugares, 0 errores de consola | ✅ Aprobada | tests/evidence/PT-01_index_movil.png |
| PT-02 | Navegación entre los tres lugares | Desde index, abrir cada lugar; luego seguir el enlace «Siguiente» tres veces. | Cada enlace abre la página del lugar correcto y «Siguiente» recorre los tres en ciclo. | Títulos: Barichara \| Parque Nacional del Chicamocha \| San Gil. Ciclo: chicamocha → sangil → barichara | ✅ Aprobada |  |
| PT-03 | Lugar inexistente | Abrir lugar.html?l=desconocido, ar.html?l=desconocido y una ruta inexistente. | Se muestra un mensaje claro con enlace a los lugares; el servidor devuelve la página 404. | «Lugar no encontrado» · «Lugar no encontrado» · HTTP 404 «Esta página no existe» | ✅ Aprobada |  |
| PT-04 | Enlaces y recursos internos | Recorrer todas las páginas y lugares, recolectar href/src internos y solicitarlos. | Todos los enlaces y recursos internos responden HTTP 200 (sin enlaces rotos). | 26 URL internas verificadas, 0 rotas. Enlaces externos (fuentes, no verificados aquí): 4 | ✅ Aprobada |  |
| PT-05 | Ausencia de dependencias externas en tiempo de ejecución | Abrir ar.html y vista3d.html registrando todas las solicitudes de red. | Ninguna solicitud sale del dominio del sitio (sin CDN, analítica ni rastreadores). | 0 solicitudes externas | ✅ Aprobada |  |
| PT-06 | Diseño adaptable (sin desbordamiento horizontal) | Abrir cada página a 360 px de ancho y comparar scrollWidth con el ancho de la ventana. | Ninguna página produce desplazamiento horizontal en móvil. | 8 páginas sin desbordamiento a 360 px | ✅ Aprobada | tests/evidence/PT-06_ar_inicio_360.png |
| PT-07 | Accesibilidad básica | Revisar en todas las páginas: imágenes con alt, botones/enlaces con nombre accesible, idioma del documento. | Todas las imágenes tienen alt, todos los controles tienen nombre y lang="es". | 6 páginas sin problemas detectados | ✅ Aprobada |  |
| PT-08 | Vista 3D sin cámara | Abrir vista3d.html de cada lugar, esperar el render, pulsar el primer punto y el botón de acción. | El modelo se dibuja, el panel de información muestra el punto y el botón cambia de estado; la página indica que no es RA. | barichara: «Piedra amarilla», acción=true; chicamocha: «Teleférico de 6,3 km», acción=true; sangil: «Barba de viejo», acción=true; errores de consola: 0 | ✅ Aprobada | tests/evidence/PT-08_vista3d_*.png |
| PT-09 | Contexto no seguro (HTTP fuera de localhost) | Abrir ar.html mediante http://santander.test (resuelto a 127.0.0.1) para simular un sitio sin HTTPS. | Se muestra el panel «Dispositivo o conexión no compatible» explicando HTTPS y se ofrece la vista 3D. | «Dispositivo o conexión no compatible» · menciona HTTPS: true · alternativa: vista3d.html?l=barichara | ✅ Aprobada | tests/evidence/PT-09_no_https.png |
| PT-10 | Permiso de cámara denegado | Simular que el usuario rechaza el permiso: getUserMedia se sustituye antes de cargar la página para que lance NotAllowedError (el diálogo de permisos real no puede automatizarse en modo sin interfaz). Pulsar «Activar cámara». | Se muestra «Permiso de cámara denegado» con instrucciones para habilitarlo, botón Reintentar y acceso a la vista 3D. | «Permiso de cámara denegado» (error NotAllowedError); Reintentar visible: true; alternativa: vista3d.html?l=chicamocha | ✅ Aprobada | tests/evidence/PT-10_permiso_denegado.png |
| PT-10b | Dispositivo sin cámara | Chromium real sin cámara disponible (sin dispositivo simulado). Pulsar «Activar cámara». | getUserMedia falla con NotFoundError y se muestra «No se encontró una cámara» con acceso a la vista 3D. | «No se encontró una cámara» (error NotFoundError) | ✅ Aprobada | tests/evidence/PT-10b_sin_camara.png |
| PT-11 | RA: permiso concedido y reconocimiento del marcador (barichara) | Cámara simulada con tests/fixtures/barichara.png (marcador en perspectiva sobre una mesa). Abrir ar.html?l=barichara, pulsar «Activar cámara» y esperar el evento targetFound de MindAR. | MindAR arranca (arReady), reconoce la ilustración (targetFound), oculta la guía de escaneo, muestra los controles y dibuja el modelo anclado. | Detectado en 3.1 s; fase=rastreando; controles visibles=true; guía oculta=true; errores=0 | ✅ Aprobada | tests/evidence/PT-11_ra_barichara_detectado.png |
| PT-14 | RA: tocar un pin numerado del modelo | Con el marcador detectado, proyectar el pin «columnas» a pantalla y hacer clic sobre él. | Se abre la hoja de información con el título del punto y su fuente. | Clic en (263, 178) → «10 columnas monolíticas»; Fuente: Wikipedia, la enciclopedia libre · Wikipedia (inglés… | ✅ Aprobada | tests/evidence/PT-14_ra_pin_tocado.png |
| PT-15 | RA: controles del modelo | Pulsar girar derecha ×2, ampliar ×1, «Ver las 10 columnas» y luego restablecer. | La rotación pasa a π/4 y la escala de 0,8 a 0,96; el botón de acción alterna su estado (aria-pressed) y su etiqueta; restablecer vuelve a 0 rad y escala 0,8. | rot=0.785 rad, escala=0.96; acción=true («Ocultar columnas»); tras restablecer rot=0, escala=0.8 | ✅ Aprobada | tests/evidence/PT-15_ra_columnas.png |
| PT-16 | RA: gesto de arrastre para girar | Simular arrastre horizontal de 120 px sobre la vista de cámara. | El modelo gira alrededor de su eje vertical sin abrir información. | rotación tras arrastre = 1.44 rad; hoja abierta=false | ✅ Aprobada |  |
| PT-12 | RA: permiso concedido y reconocimiento del marcador (chicamocha) | Cámara simulada con tests/fixtures/chicamocha.png (marcador en perspectiva sobre una mesa). Abrir ar.html?l=chicamocha, pulsar «Activar cámara» y esperar el evento targetFound de MindAR. | MindAR arranca (arReady), reconoce la ilustración (targetFound), oculta la guía de escaneo, muestra los controles y dibuja el modelo anclado. | Detectado en 3.4 s; fase=rastreando; controles visibles=true; guía oculta=true; errores=0 | ✅ Aprobada | tests/evidence/PT-12_ra_chicamocha_detectado.png |
| PT-13 | RA: permiso concedido y reconocimiento del marcador (sangil) | Cámara simulada con tests/fixtures/sangil.png (marcador en perspectiva sobre una mesa). Abrir ar.html?l=sangil, pulsar «Activar cámara» y esperar el evento targetFound de MindAR. | MindAR arranca (arReady), reconoce la ilustración (targetFound), oculta la guía de escaneo, muestra los controles y dibuja el modelo anclado. | Detectado en 3.2 s; fase=rastreando; controles visibles=true; guía oculta=true; errores=0 | ✅ Aprobada | tests/evidence/PT-13_ra_sangil_detectado.png |
| PT-17 | RA: escena sin marcador | Cámara simulada con una mesa vacía (tests/fixtures/vacio.y4m). Iniciar la RA y esperar 10 s. | No se reconoce ningún marcador; la guía «Apunte a la ilustración» permanece visible y no aparece el modelo. | detecciones=0; guía visible=true | ✅ Aprobada | tests/evidence/PT-17_ra_sin_marcador.png |
| PT-18 | RA: marcador equivocado | Cámara simulada mostrando el marcador de San Gil mientras se abre la experiencia de Barichara; esperar 10 s. | La experiencia de Barichara no reacciona al marcador de otro lugar (no hay falsos positivos). | detecciones=0 | ✅ Aprobada |  |
| PT-19 | QR del brochure: contenido | Rasterizar Santander_AR_brochure_PRUEBA_LOCAL.pdf a 150 ppp y decodificar con OpenCV QRCodeDetector. | 4 QR legibles (portada + 3 lugares) con los destinos correctos. | p.1: http://localhost:8080/index.html; p.3: http://localhost:8080/lugar.html?l=barichara; p.4: http://localhost:8080/lugar.html?l=chicamocha; p.5: http://localhost:8080/lugar.html?l=sangil | ✅ Aprobada | entregables/Santander_AR_brochure_PRUEBA_LOCAL.pdf |
| PT-20 | QR del brochure: destinos accesibles | Solicitar por HTTP cada URL decodificada (servidor de la base indicada en ejecución). | Cada destino responde HTTP 200 con una página de Santander AR. | http://localhost:8080/index.html → HTTP 200; http://localhost:8080/lugar.html?l=barichara → HTTP 200; http://localhost:8080/lugar.html?l=chicamocha → HTTP 200; http://localhost:8080/lugar.html?l=sangil → HTTP 200 (base LOCAL: probado solo en este equipo) | ✅ Aprobada |  |

## 7.3 Pruebas pendientes (no ejecutadas)

| ID | Función a probar | Procedimiento | Resultado esperado | Motivo por el que está pendiente | Estado |
|---|---|---|---|---|---|
| PP-01 | RA en teléfono Android físico (Chrome) | Publicar por HTTPS, escanear el QR impreso, iniciar RA y apuntar a cada ilustración impresa en hoja A4. | Detección en < 5 s con buena luz; modelo estable; 30 fps aproximados. | Sin acceso a un dispositivo físico en el entorno de desarrollo. | ⏳ Pendiente |
| PP-02 | RA en iPhone físico (Safari) | Igual que PP-01 en Safari iOS. | Igual que PP-01; el diálogo de permiso aparece y se respeta. | Sin acceso a un iPhone. | ⏳ Pendiente |
| PP-03 | Diálogo real de permiso de cámara | En un teléfono, pulsar «Activar cámara» y elegir «Bloquear»; luego habilitar desde los ajustes del sitio. | Aparece «Permiso de cámara denegado»; tras habilitar y recargar, la RA funciona. | El diálogo nativo no se puede automatizar en modo sin interfaz (PT-10 lo simula). | ⏳ Pendiente |
| PP-04 | QR con dominio público definitivo | Publicar el sitio, ejecutar `npm run build:brochure -- <URL>` y `npm run test:qr -- entregables/Santander_AR_brochure.pdf`; escanear los QR impresos con 2 teléfonos. | Los 4 QR abren las páginas correctas por HTTPS. | Aún no existe una URL pública: el proyecto no está publicado. | ⏳ Pendiente |
| PP-05 | Pérdida y recuperación del marcador | Con la RA activa, retirar la ilustración del encuadre y volver a enfocarla. | Reaparece la guía de escaneo; al volver, el modelo se ancla de nuevo. | La cámara simulada no permite cambiar la escena durante la prueba; requiere dispositivo. | ⏳ Pendiente |
| PP-06 | Rendimiento y temperatura | Usar la RA 3 minutos continuos en un teléfono de gama media. | Sin cierres del navegador; fluidez aceptable. | Requiere dispositivo físico. | ⏳ Pendiente |
| PP-07 | Condiciones de luz y reflejos | Probar con luz baja, luz directa sobre papel brillante y la ilustración en una pantalla. | Se documenta en qué condiciones falla la detección. | Requiere dispositivo físico y material impreso. | ⏳ Pendiente |
| PP-08 | Prueba de usabilidad con usuarios | Sesión con 5 personas del público objetivo: tareas «abrir un lugar con el QR», «activar la RA», «leer un dato», «usar la acción»; registrar tiempos, errores y escala SUS. | ≥ 4 de 5 completan las tareas sin ayuda; SUS ≥ 68. | No se han realizado sesiones con usuarios. La hipótesis del proyecto sigue sin validar. | ⏳ Pendiente |

## 7.4 Cómo repetir las pruebas

```bash
npm run test:fixtures          # genera los videos Y4M de cámara simulada (≈ 54 MB, no se incluyen en el ZIP)
npm test                       # PT-01 … PT-18 (Playwright + Chromium)
npm start &                    # sirve web/ en http://localhost:8080
npm run build:brochure         # PDF con QR de prueba local
npm run test:qr                # PT-19 y PT-20
npm run matriz                 # regenera este documento
```
