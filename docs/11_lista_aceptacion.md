# 11. Lista de aceptación

Verificación de los criterios de aceptación del encargo (14 de octubre de 2026).

| # | Criterio | Estado | Evidencia / qué falta |
|---|---|---|---|
| 1 | El proyecto conserva la temática Santander AR. | ✅ Cumple | Todo el sitio y la documentación. |
| 2 | El problema, el público objetivo y los objetivos están documentados. | ✅ Cumple | [01](01_analisis_planificacion.md) (problema como hipótesis no validada). |
| 3 | Se han seleccionado y documentado tres lugares. | ✅ Cumple | [01 §1.6](01_analisis_planificacion.md), [10](10_contenido_y_fuentes.md). |
| 4 | La información turística tiene fuentes identificables. | ✅ Cumple | Cada dato referencia una fuente con URL y fecha de consulta ([10](10_contenido_y_fuentes.md), `creditos.html`). Fuentes secundarias señaladas como limitación. |
| 5 | Requisitos funcionales y no funcionales definidos. | ✅ Cumple | [02](02_requisitos.md): 16 RF, 12 RNF, 8 HU. |
| 6 | Arquitectura y diagramas documentados. | ✅ Cumple | [03](03_diseno.md), `docs/diagramas/` (Mermaid + PNG/SVG). |
| 7 | Código fuente organizado y ejecutable en el entorno disponible. | ✅ Cumple | `web/`, `scripts/`; ejecutado con `serve.mjs` y Chromium. |
| 8 | Existe una experiencia de RA real, no solo una galería. | ✅ Cumple (en simulación) | Seguimiento de imagen con MindAR; modelos anclados (PT-11…PT-13). **Falta** confirmarlo en teléfono físico (PP-01, PP-02). |
| 9 | Los QR conducen a los destinos correspondientes cuando están disponibles. | ⚠️ Parcial | Los QR del PDF de prueba se decodificaron y sus destinos respondieron 200 en el servidor local (PT-19, PT-20). **Falta** publicar el sitio y regenerar el brochure con la URL pública (PP-04). |
| 10 | El contenido 3D o aumentado está integrado en las experiencias. | ✅ Cumple | 3 modelos animados con pines y acciones; GLB exportados. |
| 11 | El brochure turístico está generado. | ✅ Cumple (versión de prueba) | `entregables/Santander_AR_brochure_PRUEBA_LOCAL.pdf` (6 páginas A4). La versión definitiva depende del punto 9. |
| 12 | Las pruebas ejecutadas tienen resultados registrados. | ✅ Cumple | `tests/resultados*.json`, [07](07_matriz_pruebas.md), `tests/evidence/`. |
| 13 | Documentación de instalación, ejecución y uso. | ✅ Cumple | [05](05_manual_instalacion.md), [06](06_manual_usuario.md), README. |
| 14 | Limitaciones y pruebas pendientes identificadas. | ✅ Cumple | [07 §7.3](07_matriz_pruebas.md), [08 §8.2](08_informe_resultados_limitaciones.md). |
| 15 | Archivos de entrega organizados. | ✅ Cumple | Estructura en README y [03 §3.7](03_diseno.md); ZIP del proyecto. |

**Qué falta para cumplir todo sin reservas:** (1) publicar `web/` por HTTPS, (2) regenerar e imprimir el brochure con la URL pública y verificarlo con `tests/test_qr.py`, (3) ejecutar PP-01…PP-07 en al menos un Android y un iPhone, y (4) realizar la prueba con usuarios PP-08 para validar o refutar la hipótesis.
