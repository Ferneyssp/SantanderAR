# 2. Requisitos

Prioridad: **M** = obligatorio para el MVP · **D** = deseable. Cada requisito tiene un criterio verificable y su prueba asociada en la matriz de trazabilidad (§2.6).

## 2.1 Requisitos funcionales (RF)

| ID | Requisito | Prioridad | Criterio de verificación |
|---|---|---|---|
| RF-01 | La página principal presenta el proyecto, explica el uso de QR y marcador y lista los tres lugares. | M | `index.html` muestra 3 lugares con enlace a su página. |
| RF-02 | Cada lugar tiene una página con nombre, imagen (ilustración-marcador), descripción, datos verificados con referencias numeradas, relato rotulado y lista de fuentes. | M | Las 3 páginas `lugar.html?l=<id>` muestran estos bloques. |
| RF-03 | Desde la página del lugar se accede a la experiencia RA y a la vista 3D sin cámara; existe un enlace al siguiente lugar y de regreso al inicio. | M | Botones presentes y enlaces válidos. |
| RF-04 | Antes de pedir la cámara se explica para qué se usa y qué necesita el usuario. | M | Panel de inicio visible en `ar.html` antes de llamar a `getUserMedia`. |
| RF-05 | La experiencia RA reconoce la ilustración del lugar con la cámara trasera y ancla un modelo 3D sobre ella. | M | Evento `targetFound` y modelo visible sobre el marcador. |
| RF-06 | Mientras no se reconoce el marcador, se muestra una guía visual de encuadre; si se pierde, la guía reaparece. | M | Guía visible en fase «escaneando»; oculta en «rastreando». |
| RF-07 | El modelo muestra pines numerados; al tocarlos (o sus chips equivalentes) se abre una hoja con el dato y su fuente. | M | Toque en pin abre la hoja con el título correcto. |
| RF-08 | El usuario puede girar (arrastre y botones), escalar (pellizco y botones) y restablecer el modelo. | M | Rotación/escala cambian; restablecer vuelve a valores iniciales. |
| RF-09 | Cada lugar tiene una acción propia: abrir el templo (Barichara), pausar el teleférico (Chicamocha), calmar el viento (San Gil). | M | El botón alterna `aria-pressed` y el estado del modelo. |
| RF-10 | Se detectan y explican: falta de HTTPS, ausencia de API de cámara, ausencia de WebGL, permiso denegado, cámara inexistente u ocupada, fallo de MindAR. | M | Mensaje específico con alternativa en cada caso. |
| RF-11 | Existe una vista 3D sin cámara para dispositivos no compatibles, rotulada como alternativa que **no** es RA. | M | `vista3d.html` funciona y muestra el aviso. |
| RF-12 | Una página imprimible ofrece los tres marcadores. | M | `marcadores.html` con 3 ilustraciones e instrucciones. |
| RF-13 | El brochure (web y PDF A4) incluye portada, introducción, tres lugares, instrucciones de escaneo, QR, requisitos de cámara, créditos y fuentes. | M | PDF de 6 páginas con los bloques indicados. |
| RF-14 | Los QR del brochure se generan a partir de la URL donde está publicado el sitio y advierten si la URL es local. | M | QR decodificados = URL esperadas; aviso visible con base local. |
| RF-15 | Al salir de la experiencia se libera la cámara. | D | `pagehide` detiene MindAR. |
| RF-16 | Un enlace o QR a un lugar inexistente muestra un mensaje y una salida. | D | Mensaje «Lugar no encontrado» y página 404. |

## 2.2 Requisitos no funcionales (RNF)

| ID | Categoría | Requisito | Criterio de verificación |
|---|---|---|---|
| RNF-01 | Compatibilidad | Funciona en navegadores móviles actuales con WebGL y `getUserMedia` (objetivo: Chrome Android, Safari iOS) sin instalar aplicaciones. | Pruebas en Chromium (ejecutadas) y en dispositivos físicos (pendientes). |
| RNF-02 | Seguridad | Se sirve por HTTPS (requisito de los navegadores para la cámara); en desarrollo, `localhost`. | Comprobación `isSecureContext` (PT-09). |
| RNF-03 | Privacidad | El video se procesa en el dispositivo; no se envían imágenes ni datos personales; sin cookies ni analítica. | 0 solicitudes externas (PT-05); revisión de código. |
| RNF-04 | Independencia | Todas las bibliotecas, fuentes y recursos se sirven desde el mismo sitio (sin CDN). | PT-05. |
| RNF-05 | Usabilidad | Interfaz en español; controles táctiles ≥ 44 px; instrucciones en cada paso. | Revisión de CSS (`.icon-btn` 48 px, `.chip` 44 px). |
| RNF-06 | Accesibilidad | `lang="es"`, texto alternativo en imágenes, nombre accesible en controles, foco visible, `prefers-reduced-motion` respetado; los pines 3D tienen equivalentes en chips de texto. | PT-07. |
| RNF-07 | Diseño adaptable | Sin desplazamiento horizontal desde 360 px de ancho. | PT-06. |
| RNF-08 | Rendimiento | Carga total de la experiencia RA ≤ 5 MB; modelos de bajo poligonaje; detección en < 5 s con buena luz. | Tamaño medido (§ inventario); detección 3–4 s en simulación; pendiente en dispositivo. |
| RNF-09 | Veracidad | Todo dato factual muestra su fuente; el relato se rotula como interpretación; los modelos se rotulan como simplificados y no a escala. | Revisión de `data.js` y avisos. |
| RNF-10 | Licencias | Solo se usan componentes con licencias que permiten su uso y redistribución (MIT, OFL) y recursos visuales propios. | Tabla de créditos. |
| RNF-11 | Mantenibilidad | Contenido separado del código (`data.js`); un único constructor de modelos para RA, vista 3D y exportación GLB; scripts reproducibles. | Estructura del repositorio. |
| RNF-12 | Despliegue | Sitio estático publicable en GitHub Pages o Netlify sin compilación. | Flujo `.github/workflows/pages.yml`. |

## 2.3 Historias de usuario y criterios de aceptación

**HU-01 · Turista que escanea.** *Como turista con el brochure en la mano, quiero escanear un QR y llegar a la información del lugar, para no tener que buscarla.*
- Dado un QR del brochure, cuando lo escaneo con la cámara del celular, entonces se abre la página de ese lugar por HTTPS.
- La página muestra el nombre del lugar, datos con fuente y un botón «Iniciar realidad aumentada».

**HU-02 · Ver el lugar en 3D sobre el papel.** *Como visitante, quiero apuntar a la ilustración y ver una maqueta 3D encima, para entender el lugar de forma espacial.*
- Dado que concedí la cámara, cuando encuadro la ilustración correcta, entonces aparece el modelo anclado sobre ella.
- Cuando retiro la ilustración, el modelo desaparece y vuelve la guía de encuadre.
- Si encuadro la ilustración de otro lugar, no aparece el modelo.

**HU-03 · Consultar datos.** *Como estudiante, quiero tocar partes del modelo y leer datos con fuente, para usarlos en clase.*
- Cuando toco un pin numerado o su chip, se abre una hoja con título, texto y fuente.
- La hoja se cierra con «×» o con Escape.

**HU-04 · Manipular el modelo.** *Como usuario, quiero girar, acercar y activar la animación del modelo, para explorarlo desde distintos ángulos.*
- Arrastrar gira el modelo; pellizcar o +/− lo escalan entre 0,45× y 2,2×; «restablecer» lo devuelve al estado inicial.
- El botón de acción alterna el estado y su texto cambia.

**HU-05 · Entender el permiso de cámara.** *Como usuario preocupado por mi privacidad, quiero saber para qué se usa la cámara antes de concederla.*
- Antes del diálogo del sistema, la aplicación explica el uso de la cámara y que nada se graba ni se envía.
- Si rechazo el permiso, veo cómo habilitarlo, puedo reintentar o usar la vista 3D.

**HU-06 · Dispositivo no compatible.** *Como usuario con un dispositivo sin cámara o sin WebGL, quiero una alternativa, para no quedarme sin contenido.*
- La aplicación explica el motivo y ofrece la vista 3D sin cámara, rotulada como «no es realidad aumentada».

**HU-07 · Docente que imprime.** *Como docente, quiero imprimir los marcadores y el brochure, para usarlos en el aula.*
- `marcadores.html` imprime una ilustración por hoja; el brochure se descarga en PDF A4.

**HU-08 · Evaluador.** *Como evaluador, quiero comprobar que la RA es real y que la información tiene fuentes, para calificar el proyecto.*
- Hay una página de créditos con fuentes y licencias; la documentación y la matriz de pruebas distinguen lo ejecutado de lo pendiente.

## 2.4 Restricciones

- La cámara solo está disponible en contextos seguros (HTTPS o `localhost`).
- Sin servidor de aplicación ni base de datos: hosting estático.
- Sin presupuesto: herramientas gratuitas y de código abierto.
- Sin acceso a dispositivos físicos durante el desarrollo (afecta las pruebas, ver PP-01…PP-07).
- No se usan fotografías ni modelos de terceros sin licencia verificada (se optó por recursos propios).

## 2.5 Reglas de funcionamiento

- RN-01: El QR **navega**; la ilustración **activa** la RA. Nunca se presentan como el mismo elemento.
- RN-02: Cada experiencia RA reconoce solo la ilustración de su lugar (un archivo `.mind` por lugar).
- RN-03: La cámara se solicita solo después de una acción explícita del usuario («Activar cámara»).
- RN-04: Ningún dato se muestra sin fuente; los textos interpretativos se rotulan como «Relato».
- RN-05: La vista 3D sin cámara siempre se rotula como alternativa que no es RA.
- RN-06: El brochure con base local se marca como «QR de prueba local» y no debe imprimirse para distribución.

## 2.6 Matriz de trazabilidad

| Requisito | Componente / archivo | Historia | Prueba |
|---|---|---|---|
| RF-01 | `web/index.html` | HU-01 | PT-01 |
| RF-02 | `web/lugar.html`, `js/data.js`, `js/app.js` | HU-01, HU-03, HU-08 | PT-02, PT-04 |
| RF-03 | `web/lugar.html` | HU-01 | PT-02, PT-04 |
| RF-04 | `web/ar.html` (panel de inicio) | HU-05 | PT-06 (captura), PT-10 |
| RF-05 | `web/ar.html`, `vendor/mindar…`, `assets/targets/*.mind`, `js/models.js` | HU-02 | PT-11, PT-12, PT-13 · PP-01, PP-02 |
| RF-06 | `web/ar.html` (`targetFound/targetLost`) | HU-02 | PT-11–PT-13, PT-17 · PP-05 |
| RF-07 | `web/ar.html` (raycasting), `js/models.js` (pines) | HU-03 | PT-14, PT-08 |
| RF-08 | `web/ar.html` (gestos y botones) | HU-04 | PT-15, PT-16 |
| RF-09 | `js/models.js` (`setAction`) | HU-04 | PT-15, PT-08 |
| RF-10 | `js/app.js` (`compatibilidad`, `mensajeErrorCamara`), `web/ar.html` | HU-05, HU-06 | PT-09, PT-10, PT-10b · PP-03 |
| RF-11 | `web/vista3d.html` | HU-06 | PT-08 |
| RF-12 | `web/marcadores.html` | HU-07 | PT-04 |
| RF-13 | `web/brochure.html`, `scripts/generar_brochure.mjs` | HU-07 | PT-19 |
| RF-14 | `web/brochure.html` | HU-01 | PT-19, PT-20 · PP-04 |
| RF-15 | `web/ar.html` (`pagehide`) | HU-05 | Revisión de código |
| RF-16 | `web/lugar.html`, `web/ar.html`, `web/404.html` | HU-01 | PT-03 |
| RNF-01 | Todo el sitio | — | PT-11–PT-18 · PP-01, PP-02 |
| RNF-02 | `js/app.js` | — | PT-09 |
| RNF-03, RNF-04 | `web/vendor/`, ausencia de analítica | — | PT-05 |
| RNF-05, RNF-06 | `css/styles.css`, HTML | — | PT-07 |
| RNF-07 | `css/styles.css` | — | PT-06 |
| RNF-08 | modelos y vendor | — | PT-11–PT-13 · PP-06 |
| RNF-09 | `js/data.js`, avisos de modelo | HU-08 | Revisión editorial |
| RNF-10 | `creditos.html` | HU-08 | Revisión de licencias |
| RNF-11, RNF-12 | estructura, `scripts/`, workflow | — | Ejecución de scripts · PP-04 |
