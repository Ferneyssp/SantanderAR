# 9. Guion de demostración académica (≈ 7 minutos)

## Preparación (antes de la clase)

- [ ] Sitio publicado por HTTPS **o** servidor local: `npm start` en el portátil (la RA funciona en `localhost` con la cámara web).
- [ ] Brochure regenerado con la URL pública e impreso en A4 a color (si no hay URL pública: abrir los marcadores en el portátil y usar el celular conectado al sitio publicado).
- [ ] Probar los tres marcadores con el celular de la demostración, con la luz del salón.
- [ ] Brillo del proyector/pantalla al máximo si se muestran marcadores en pantalla.
- [ ] Plan B abierto en una pestaña: `vista3d.html?l=chicamocha` y las capturas de `tests/evidence/`.

## Desarrollo

| Tiempo | Qué decir | Qué mostrar |
|---|---|---|
| 0:00–0:45 | **Problema e hipótesis.** «La información turística de Santander suele ser textual y dispersa. Nuestra hipótesis —todavía sin validar con usuarios— es que una cartilla con RA ayuda a explorarla.» | Portada del brochure. |
| 0:45–1:30 | **Qué pidió la actividad y cómo respondimos:** MVP, RA, QR, cartilla en PDF, modelos 3D, sin instalar app. | Página 2 del brochure. |
| 1:30–2:15 | **Concepto clave:** el QR **navega**; la ilustración **activa** la RA. Por qué: el QR es mal ancla; la ilustración tiene detalles que la cámara sigue con estabilidad. | Una página de lugar con QR + ilustración. |
| 2:15–4:30 | **Demostración en vivo.** Escanear QR de Barichara → «Iniciar RA» → explicar el permiso → apuntar → girar → tocar pin 2 → «Ver las 10 columnas». Repetir rápido con Chicamocha (pausar teleférico) y San Gil (viento). | Celular duplicado en pantalla o cámara apuntando al celular. |
| 4:30–5:15 | **Veracidad:** cada dato tiene fuente; el relato está rotulado; los modelos dicen «no a escala». | Página de lugar → fuentes; `creditos.html`. |
| 5:15–6:15 | **Ingeniería:** arquitectura estática, MindAR + A-Frame (MIT), sin CDN ni datos personales; requisitos trazados a pruebas; 21 pruebas automatizadas con cámara simulada. | Diagrama de componentes; matriz de pruebas. |
| 6:15–7:00 | **Limitaciones honestas y siguiente paso:** no probado aún en dispositivos físicos ni con usuarios; plan de validación con 5 usuarios y SUS; relación con el proyecto final. | [08](08_informe_resultados_limitaciones.md). |

## Si algo falla en vivo

- No detecta: acercar/alejar, más luz, quitar reflejos; mostrar el marcador en el portátil a brillo máximo.
- Permiso denegado: mostrar el mensaje como parte de la demostración del manejo de errores y habilitarlo en ajustes.
- Sin conexión: usar el portátil con `npm start` y la cámara web en `http://localhost:8080/ar.html?l=barichara`.
- Último recurso: vista 3D sin cámara y capturas de `tests/evidence/` (aclarar que son pruebas con cámara simulada).

## Preguntas probables

- **¿Por qué no la herramienta mostrada en clase?** El profesor invitó a consultar otras; MindAR es libre, sin cuenta ni límites y el código queda bajo nuestro control.
- **¿Por qué ilustraciones y no fotos?** Las fotos de terceros requieren licencia; las ilustraciones propias además son mejores marcadores (más detalle, contraste).
- **¿Cómo saben que funciona?** Detección real de MindAR en Chromium con cámara simulada (evidencia y tiempos en la matriz). Falta la prueba en teléfonos físicos y con usuarios, y lo decimos explícitamente.
