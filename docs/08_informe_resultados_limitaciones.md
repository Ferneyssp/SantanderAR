# 8. Informe de resultados y limitaciones

## 8.1 Resultados

| Entregable | Estado | Ubicación |
|---|---|---|
| Sitio web con 3 experiencias RA reales (seguimiento de imagen) | Implementado | `web/` |
| 3 modelos 3D animados e interactivos (+ GLB exportados) | Implementado | `web/js/models.js`, `web/assets/models/` |
| Manejo de permisos, errores e incompatibilidad | Implementado | `web/ar.html`, `web/js/app.js` |
| Vista 3D alternativa (rotulada como no-RA) | Implementado | `web/vista3d.html` |
| Marcadores imprimibles y compilados | Implementado | `web/marcadores.html`, `web/assets/markers/`, `web/assets/targets/` |
| Brochure A4 con QR (web y PDF) | Implementado; PDF con **QR de prueba local** | `web/brochure.html`, `entregables/` |
| Pruebas automatizadas | 21 ejecutadas, 21 aprobadas | `tests/`, [07](07_matriz_pruebas.md) |
| Documentación de ingeniería | Completa | `docs/` |

**Lo verificado de verdad:**
- El motor real de MindAR reconoció las tres ilustraciones en Chromium con una cámara simulada (foto sintética del marcador en perspectiva sobre una mesa) en 3–4 s, y dibujó el modelo anclado. No hubo falsos positivos con una mesa vacía ni con el marcador de otro lugar.
- Tocar un pin proyectado del modelo abrió la información correcta; los controles de giro, escala, acción y restablecer, y el gesto de arrastre, funcionaron.
- Los mensajes de HTTPS ausente, permiso denegado (simulado) y cámara inexistente (real) se muestran con alternativa.
- 0 enlaces internos rotos; 0 solicitudes a dominios externos; sin desbordamiento a 360 px.
- Los 4 QR del PDF se decodificaron con OpenCV y sus destinos respondieron HTTP 200 **en el servidor local**.

## 8.2 Limitaciones reales

1. **No probado en teléfonos físicos.** No hubo acceso a dispositivos Android o iPhone. El reconocimiento en condiciones reales (luz, enfoque, reflejos, papel), la fluidez y la temperatura no están verificados (PP-01, PP-02, PP-05 a PP-07).
2. **Sin URL pública.** El proyecto no se publicó porque no se dispone de una cuenta de hosting autorizada en este entorno. Por eso el PDF incluido usa **QR de prueba local** (`http://localhost:8080/`), marcados como tales. Para el brochure definitivo hay que publicar y regenerar el PDF ([05 §5.3–5.4](05_manual_instalacion.md)).
3. **Hipótesis sin validar.** No se hicieron pruebas con usuarios: no se puede afirmar que la RA mejore la comprensión o el interés turístico (PP-08).
4. **Permiso de cámara real no automatizable.** El rechazo del permiso se probó sustituyendo `getUserMedia`; el diálogo nativo queda pendiente (PP-03).
5. **Modelos simplificados.** Son representaciones educativas no a escala; el templo de Barichara no reproduce la arquitectura real de la catedral.
6. **Ilustraciones en lugar de fotografías.** Se evitó usar fotografías de terceros sin verificar licencias. Fotografías propias o con licencia abierta mejorarían la identificación de los lugares.
7. **Fuentes secundarias.** Parte de los datos procede de Wikipedia (que cita fuentes institucionales) y de un portal promocional; conviene contrastarlos con fuentes primarias (SINIC, alcaldías, Parques/Panachi) antes de un uso público.
8. **Un marcador por experiencia.** Cada página reconoce solo su ilustración; no hay una escena que reconozca los tres marcadores a la vez.
9. **Solo español** y sin modo de alto contraste específico.
10. **Tamaño de descarga** (~4 MB) puede ser lento con datos móviles limitados.

## 8.3 Mejoras futuras (relacionadas con el proyecto final del curso)

- Publicar en GitHub Pages, regenerar el brochure y ejecutar PP-01…PP-08 con 5 usuarios (incluye SUS).
- Añadir más lugares (por ejemplo, Guane, Zapatoca o Girón) reutilizando `data.js` y `models.js`.
- Modelos más detallados (fotogrametría propia o modelos con licencia CC) en GLB, con compresión Draco/Meshopt.
- Narración en audio y subtítulos; versión en inglés.
- Una sola escena con varios marcadores (`maxTrack`) para la cartilla completa.
- Modo sin conexión (Service Worker) para lugares con baja cobertura.
- Medición anónima y opcional de uso, solo si se justifica y con consentimiento.
