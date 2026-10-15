# 0. Exigencias académicas confirmadas

Fuente única: transcripción de la clase `p2_seminario_indicaciones.txt` (≈ 9 min). No se recibió rúbrica, fecha de entrega ni formato institucional; **este proyecto no supone ninguno de ellos**. La transcripción es automática y contiene errores de reconocimiento de voz (por ejemplo «web art», «huevas»); se interpretan con cautela.

## 0.1 Instrucciones expresas del profesor

| # | Instrucción (paráfrasis) | Marca de tiempo | Cómo se atiende |
|---|---|---|---|
| E1 | La actividad consiste en crear un **proyecto** que aplique la tecnología a un escenario conocido y genere una solución a un problema cotidiano. | 0:13 – 0:39 | Problema e hipótesis en [01](01_analisis_planificacion.md). |
| E2 | El proyecto es de **realidad aumentada**. Primero visualizar qué se quiere mostrar. | 1:54 | Experiencia RA con seguimiento de imagen (MindAR). |
| E3 | Se construye un **MVP** de algún producto; puede ser un tema educativo. | 2:14 | MVP turístico-educativo de tres lugares. |
| E4 | Crear una **cartilla** con un número de elementos. | 2:14 | Brochure A4 de 6 páginas con 3 lugares. |
| E5 | Este proyecto se relaciona con lo que se hará al final del curso. | 2:35 | Arquitectura extensible documentada en [08](08_informe_resultados_limitaciones.md). |
| E6 | Hay muchas herramientas; se muestra una en clase y **se pueden consultar otras** («de tarea que consulten otras»). | 2:54, 6:57 | Comparación de herramientas en [04](04_tecnologias_implementacion.md). |
| E7 | La forma que el profesor considera más óptima de construir RA es mediante **códigos QR**. | 3:12 – 3:31 | Cada lugar tiene un QR de acceso. |
| E8 | Se pueden usar imágenes, **videos, modelos 3D, GIF animados** y animaciones (ej. un personaje descargado en FBX). | 3:54 – 6:46 | Modelos 3D animados (teleférico, viento); exportados además a GLB. |
| E9 | Ventaja destacada: **no se necesita instalar una aplicación**; se reproduce desde el navegador tras escanear el QR. | 7:15 – 8:00 | WebAR en el navegador móvil, sin app. |
| E10 | El producto debe servir para **compartir, vender o conocer algo**. | 8:25 | Conocer el patrimonio de Santander. |
| E11 | Se puede crear un **PDF con varios códigos QR contando una historia**, un **brochure**; la creatividad la ponen los estudiantes. | 8:44 | `entregables/Santander_AR_brochure*.pdf`. |

## 0.2 Lo que la transcripción **no** dice

- No menciona nombre exacto de la herramienta mostrada (la transcripción dice «web art»), rúbrica, puntaje, fecha, número de integrantes, formato de entrega ni documentación obligatoria.
- No exige que los QR activen directamente la RA ni prohíbe usar marcadores de imagen.

## 0.3 Decisiones del equipo (no exigidas por el profesor)

| Decisión | Motivo |
|---|---|
| Temática Santander AR con Barichara, Parque Nacional del Chicamocha y San Gil. | Definida por el encargo del proyecto. |
| Separar el QR (navegación) del marcador de imagen (activación de RA). | El QR es pequeño y de alto contraste repetitivo: es un mal marcador para anclar un modelo. Una ilustración rica en detalles es más estable. |
| MindAR + A-Frame en lugar de una plataforma comercial. | Gratuito, código abierto (MIT), sin cuenta ni límite de vistas; ver [04](04_tecnologias_implementacion.md). |
| Modelos 3D procedurales propios. | Evita licencias de terceros y permite animarlos con código. |
| Documentación completa de ingeniería de software (fases 1–7). | Solicitada en el encargo del proyecto como soporte del MVP. |
