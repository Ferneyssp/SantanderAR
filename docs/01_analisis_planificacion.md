# 1. Análisis y planificación

## 1.1 Descripción del proyecto

**Santander AR** es un producto mínimo viable (MVP) turístico y educativo de realidad aumentada web. Un brochure (impreso o PDF) presenta tres lugares del departamento de Santander, Colombia. Cada página del brochure tiene un **código QR**, que abre la página del lugar en el navegador del celular, y una **ilustración**, que funciona como marcador: al apuntar la cámara, aparece encima una maqueta 3D interactiva con datos verificados y su fuente.

| Lugar | Experiencia 3D | Interacción propia |
|---|---|---|
| Barichara | Templo y plaza de piedra (representación simplificada) | «Ver las 10 columnas»: vuelve translúcidos los muros |
| Parque Nacional del Chicamocha | Maqueta del cañón con estratos, río y teleférico | Cabina animada; pausar / reanudar |
| San Gil · Parque El Gallineral | Isla con árboles y «barba de viejo»; río Fonce | Filamentos que se mueven con el viento; calmar / activar |

## 1.2 Problema e hipótesis

**Problema planteado (hipótesis inicial, no demostrada):** la información turística e histórica sobre los atractivos de Santander puede presentarse de forma fragmentada o predominantemente textual, lo que limita las oportunidades de explorarla mediante recursos visuales e interactivos.

**Hipótesis a validar:** un brochure con códigos QR y modelos 3D en realidad aumentada, accesible desde el navegador sin instalar aplicaciones, hace que estudiantes, turistas y habitantes **exploren más contenido y lo recuerden mejor** que con un folleto solo textual.

**Estado:** el MVP permite *probar* la hipótesis, pero **no se ha realizado ninguna prueba con usuarios**. Ninguna afirmación de este proyecto sostiene que la solución mejore la experiencia turística. El procedimiento de validación propuesto es la prueba PP-08 ([07](07_matriz_pruebas.md)).

## 1.3 Justificación

- **Académica:** responde a la actividad de RA del seminario (MVP, QR, cartilla/PDF, modelos 3D, sin instalar app).
- **Técnica:** demuestra que una experiencia de RA con seguimiento de imagen se puede publicar como sitio estático gratuito, sin servidores ni licencias.
- **Social y cultural:** acerca datos verificables del patrimonio regional a públicos que prefieren formatos visuales, con fuentes explícitas y separación entre dato y relato.

## 1.4 Usuarios objetivo

| Perfil | Necesidad | Contexto de uso |
|---|---|---|
| Turista | Entender rápidamente qué ver y por qué es relevante. | Celular propio, brochure impreso en hotel u oficina de turismo. |
| Estudiante / docente | Material visual para una clase sobre patrimonio regional. | Brochure proyectado o impreso en aula; celulares del grupo. |
| Habitante | Conocer la historia de lugares cercanos. | Celular y PDF en el computador. |
| Evaluador académico | Verificar que la RA es real y que el proyecto está sustentado. | Enlace o QR, marcadores en pantalla, documentación. |

## 1.5 Objetivos

**Objetivo general.** Desarrollar un MVP de realidad aumentada que facilite la exploración educativa y turística de lugares representativos de Santander mediante experiencias visuales e interactivas accesibles desde dispositivos móviles.

**Objetivos específicos.**
1. Identificar y documentar información verificable, con fuente y fecha de consulta, sobre tres lugares seleccionados.
2. Implementar experiencias de realidad aumentada asociadas a marcadores de imagen, con acceso por códigos QR, que permitan explorar contenido histórico, cultural y turístico.
3. Diseñar un brochure digital (PDF) con instrucciones, información y accesos a las experiencias.
4. Verificar el funcionamiento del MVP mediante pruebas técnicas automatizadas y definir el protocolo de pruebas de usabilidad.

*(Ajuste respecto al encargo: el objetivo 2 precisa «marcadores de imagen con acceso por QR» y el 4 distingue pruebas técnicas ejecutadas de pruebas de usabilidad definidas, para no afirmar una validación no realizada.)*

## 1.6 Selección de los tres lugares

| Criterio | Barichara | P. N. del Chicamocha | San Gil · El Gallineral |
|---|---|---|---|
| Tipo de atractivo | Patrimonio arquitectónico | Paisaje / geografía | Naturaleza y ciudad histórica |
| Información verificable disponible | Alta (Wikipedia con fuentes institucionales, Radio Nacional) | Media-alta (Colombia Travel, portal oficial) | Alta (Colombia Travel, Wikipedia) |
| Elemento 3D con valor didáctico | Templo de piedra y sus 10 columnas | Corte del cañón + teleférico | Isla entre brazos de agua + «barba de viejo» |
| Interacción diferenciada | Abrir el templo | Animación del cable | Viento |

La variedad (patrimonio construido, paisaje y naturaleza) hace que cada experiencia muestre un uso distinto de la RA. Los tres lugares están en la misma región del sur de Santander, lo que permite un recorrido coherente.

## 1.7 Alcance

**Incluido:** sitio web estático; 3 páginas de lugar; 3 experiencias RA con seguimiento de imagen; 3 modelos 3D animados e interactivos; pines de información con fuente; vista 3D sin cámara; manejo de permisos y errores; brochure PDF con QR; marcadores imprimibles; pruebas automatizadas; documentación.

**Excluido (y por qué):** GPS o mapas en tiempo real, cuentas de usuario, pagos, reservas, base de datos, panel de administración, analítica de uso, traducción a otros idiomas. Ninguna necesidad del MVP las justifica; añadirían datos personales o servidores sin aportar a la validación de la hipótesis.

## 1.8 Beneficios esperados (por validar)

- Acceso inmediato sin instalar aplicación (un QR y el navegador).
- Comprensión espacial de lugares difíciles de describir con texto (profundidad del cañón, isla entre brazos de agua, estructura del templo).
- Confianza en el contenido: cada dato visible muestra su fuente.
- Costo de operación cercano a cero: hosting estático gratuito, sin licencias.

## 1.9 Riesgos

| ID | Riesgo | Tipo | Prob. | Impacto | Mitigación |
|---|---|---|---|---|---|
| R1 | La detección falla con poca luz, reflejos o impresión pequeña. | Técnico | Media | Alto | Marcadores con alto detalle; instrucciones de luz y distancia; vista 3D alternativa. |
| R2 | Navegador o dispositivo sin cámara/WebGL/HTTPS. | Técnico | Media | Medio | Comprobación previa y mensajes específicos; vista 3D. |
| R3 | El sitio se publica sin HTTPS y la cámara queda bloqueada. | Técnico | Media | Alto | Guía de publicación en GitHub Pages / Netlify (HTTPS por defecto); aviso en la interfaz. |
| R4 | QR impresos apuntan a una URL que cambia o deja de existir. | Operativo | Media | Alto | Generar el brochure definitivo solo después de publicar; regenerarlo con un comando. |
| R5 | Rendimiento bajo en teléfonos de gama baja. | Técnico | Media | Medio | Modelos de pocos polígonos; bibliotecas locales; pendiente medir (PP-06). |
| R6 | Datos históricos imprecisos. | Académico | Baja | Alto | Solo datos con fuente; dato y relato separados; fecha de consulta. |
| R7 | Afirmar resultados no probados. | Académico | Media | Alto | Matriz de pruebas que separa ejecutadas de pendientes. |
| R8 | Dependencia de una librería sin mantenimiento activo. | Técnico | Media | Bajo | Versiones fijadas y servidas localmente; sin CDN. |

## 1.10 Indicadores de éxito del MVP

| Indicador | Meta | Estado |
|---|---|---|
| Experiencias RA que reconocen su marcador (cámara simulada) | 3 de 3 | Cumplido (PT-11 a PT-13) |
| Falsos positivos con marcador equivocado o escena vacía | 0 | Cumplido (PT-17, PT-18) |
| Enlaces internos rotos | 0 | Cumplido (PT-04) |
| Datos mostrados con fuente identificable | 100 % | Cumplido (revisión de `data.js`) |
| Detección en teléfono físico en < 5 s con buena luz | ≥ 2 dispositivos | Pendiente (PP-01, PP-02) |
| Usuarios que completan las tareas sin ayuda | ≥ 4 de 5 | Pendiente (PP-08) |
| Puntaje SUS de usabilidad | ≥ 68 | Pendiente (PP-08) |

## 1.11 Plan de trabajo ejecutado

1. Lectura de la transcripción y extracción de exigencias ([00](00_exigencias_academicas.md)).
2. Investigación de los lugares y sus fuentes.
3. Selección de tecnología y prueba de concepto de detección.
4. Requisitos y diseño ([02](02_requisitos.md), [03](03_diseno.md)).
5. Implementación, brochure y QR.
6. Pruebas automatizadas y matriz ([07](07_matriz_pruebas.md)).
7. Documentación y empaquetado.
