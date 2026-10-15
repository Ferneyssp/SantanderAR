# Santander AR

MVP de **realidad aumentada web** para explorar tres lugares del departamento de Santander (Colombia): **Barichara**, el **Parque Nacional del Chicamocha** y **San Gil · Parque El Gallineral**. Un brochure con códigos QR abre la página de cada lugar; al apuntar el celular a la ilustración del lugar aparece una maqueta 3D interactiva con datos verificados y su fuente. Funciona en el navegador, sin instalar aplicaciones.

Proyecto académico — segunda actividad de evaluación, Universidad de Santander (UDES), 2026.

## Inicio rápido

```bash
node scripts/serve.mjs          # requiere Node.js ≥ 18 · sin instalar dependencias
# abra http://localhost:8080/
```

- Para usar la cámara del celular el sitio debe estar en **HTTPS**: publíquelo en GitHub Pages (flujo incluido) o Netlify, o use `node scripts/serve.mjs --https` en su red local. Ver [docs/05](docs/05_manual_instalacion.md).
- Marcadores para imprimir: `http://localhost:8080/marcadores.html`.
- Brochure: `entregables/Santander_AR_brochure_PRUEBA_LOCAL.pdf` (QR hacia `localhost`, **solo para pruebas**). Para el definitivo: publique y ejecute `node scripts/generar_brochure.mjs https://su-sitio/`.

## Tecnología

MindAR 1.2.5 (seguimiento de imagen) + A-Frame 1.6.0 para la RA; three.js 0.164.1 para la vista 3D sin cámara; modelos 3D procedurales propios; todo servido localmente (sin CDN, sin datos personales). Licencias MIT y OFL.

## Estado verificado

- 21/21 pruebas automatizadas aprobadas (Chromium sin interfaz con **cámara simulada**): reconocimiento real de los 3 marcadores, interacción, errores, enlaces, QR.
- **Pendiente:** pruebas en teléfonos físicos, publicación con URL pública y pruebas con usuarios. Ver [matriz de pruebas](docs/07_matriz_pruebas.md) y [limitaciones](docs/08_informe_resultados_limitaciones.md).

## Documentación

| | |
|---|---|
| [00 Exigencias académicas](docs/00_exigencias_academicas.md) | Instrucciones del profesor vs. decisiones del equipo |
| [01 Análisis y planificación](docs/01_analisis_planificacion.md) | Problema, hipótesis, objetivos, alcance, riesgos, indicadores |
| [02 Requisitos](docs/02_requisitos.md) | RF, RNF, historias, criterios, reglas, trazabilidad |
| [03 Diseño](docs/03_diseno.md) | Arquitectura, diagramas, interfaces, carpetas, inventario multimedia |
| [04 Tecnologías e implementación](docs/04_tecnologias_implementacion.md) | Comparación de herramientas y justificación |
| [05 Instalación y publicación](docs/05_manual_instalacion.md) | Entorno limpio, HTTPS, GitHub Pages, brochure definitivo |
| [06 Manual de usuario](docs/06_manual_usuario.md) | Uso paso a paso |
| [07 Matriz de pruebas](docs/07_matriz_pruebas.md) | Ejecutadas y pendientes, con evidencia |
| [08 Resultados y limitaciones](docs/08_informe_resultados_limitaciones.md) | Qué se verificó, qué falta, mejoras |
| [09 Guion de demostración](docs/09_guion_demostracion.md) | Exposición de 7 minutos |
| [10 Contenido y fuentes](docs/10_contenido_y_fuentes.md) | Textos de los lugares y bibliografía |
| [11 Lista de aceptación](docs/11_lista_aceptacion.md) | Verificación final del encargo |

## Estructura

```
web/          sitio publicable (HTML, CSS, JS, assets, vendor)
scripts/      servidor, generación de marcadores, .mind, GLB, brochure, diagramas, matriz
tools/        páginas auxiliares de compilación y exportación
tests/        pruebas e2e y de QR, resultados y evidencias
docs/         documentación y diagramas
entregables/  brochure PDF
```
