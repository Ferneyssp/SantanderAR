# 5. Manual de instalación, ejecución y publicación

Hay dos niveles de uso:

- **Solo ejecutar o publicar el sitio:** basta la carpeta `web/`. No requiere compilar ni instalar dependencias: todas las bibliotecas ya están en `web/vendor/`.
- **Regenerar recursos y ejecutar pruebas:** requiere Node.js y Python (opcional).

## 5.1 Ejecutar en local (entorno limpio)

Requisitos: **Node.js 18 o superior** (solo para el servidor incluido). Alternativa sin Node: cualquier servidor estático, por ejemplo `python3 -m http.server 8080 --directory web`.

```bash
unzip Santander_AR.zip && cd santander-ar
node scripts/serve.mjs              # o: npm start
# → http://localhost:8080/
```

En el **computador**, `localhost` es un contexto seguro: la RA funciona con la cámara web apuntando a un marcador impreso o mostrado en el celular.

> No abra los HTML con doble clic (`file://`): los navegadores bloquean la cámara y algunos recursos.

## 5.2 Probar desde un celular en la misma red (HTTPS local)

El celular no puede usar `http://<ip>` porque la cámara exige HTTPS. Opción incluida:

```bash
node scripts/serve.mjs --https      # o: npm run start:https  (requiere openssl)
# Muestra https://<ip-local>:8443/
```

Abra esa dirección en el celular (misma red Wi-Fi). Aparecerá una advertencia de certificado (autofirmado); acéptela solo en su red local. Es suficiente para probar, **no** para el brochure definitivo.

## 5.3 Publicar en Internet (HTTPS gratuito)

### Opción A · GitHub Pages (recomendada)
1. Cree un repositorio en GitHub y suba el contenido de `santander-ar/` (incluye `.github/workflows/pages.yml`).
2. En el repositorio: *Settings → Pages → Build and deployment → Source: GitHub Actions*.
3. Haga un *push* a `main`. El flujo publica la carpeta `web/`.
4. La URL será similar a `https://<usuario>.github.io/<repositorio>/`. Ábrala y compruebe `ar.html?l=barichara`.

> Las versiones de las acciones del flujo (`actions/checkout@v4`, `configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v4`) eran las vigentes según la documentación de GitHub conocida por el equipo; si GitHub advierte que alguna está obsoleta, actualícela.

### Opción B · Netlify Drop (sin Git)
1. Entre a https://app.netlify.com/drop.
2. Arrastre la carpeta **`web/`**. Netlify asigna una URL `https://<nombre>.netlify.app/`.

## 5.4 Generar el brochure definitivo con los QR públicos

Hágalo **después** de publicar, con la URL real terminada en `/`:

```bash
npm install                                   # una vez (instala Playwright, etc.)
npx playwright install chromium               # una vez (descarga Chromium)
node scripts/generar_brochure.mjs https://<usuario>.github.io/<repositorio>/
# → entregables/Santander_AR_brochure.pdf  y  …_qr.json
python3 tests/test_qr.py entregables/Santander_AR_brochure.pdf   # verifica QR y destinos
```

Alternativa sin Node: abra `https://<su-sitio>/brochure.html` en Chrome de escritorio y use *Imprimir → Guardar como PDF* (tamaño A4, márgenes «Ninguno», gráficos de fondo activados). Los QR se generan automáticamente con la dirección del sitio publicado.

El archivo `entregables/Santander_AR_brochure_PRUEBA_LOCAL.pdf` incluido apunta a `http://localhost:8080/` y está marcado como **QR de prueba local**: no lo imprima para distribución.

## 5.5 Entorno de desarrollo completo

```bash
npm install                    # .npmrc usa ignore-scripts: evita compilar la dependencia nativa opcional "canvas" de mind-ar
npx playwright install chromium
pip install pillow numpy opencv-python pymupdf     # para marcadores, videos de prueba y prueba de QR
```

Si el entorno no puede descargar Chromium de Playwright, indique un Chromium existente:

```bash
export CHROMIUM_PATH=/ruta/a/chromium
```

| Comando | Qué hace |
|---|---|
| `npm start` / `npm run start:https` | Servidor local HTTP (8080) / HTTPS autofirmado (8443) |
| `npm run build:marcadores` | Regenera las ilustraciones y compila los `.mind` |
| `npm run build:modelos` | Exporta los tres modelos a `web/assets/models/*.glb` |
| `npm run build:brochure -- <URL>` | Genera el brochure PDF con QR hacia `<URL>` |
| `npm run build:diagramas` | Renderiza `docs/diagramas/*.mmd` a SVG y PNG |
| `npm run test:fixtures` | Crea los videos Y4M de cámara simulada (≈ 54 MB) |
| `npm test` | Pruebas de extremo a extremo (PT-01 … PT-18) |
| `npm run test:qr` | Decodifica y verifica los QR del brochure (PT-19, PT-20; requiere el servidor en marcha si la base es local) |
| `npm run matriz` / `npm run docs:contenido` | Regenera la matriz de pruebas / el documento de contenido |

## 5.6 Modificar el contenido

- Textos, datos y fuentes: `web/js/data.js` (cada dato con su clave de fuente).
- Modelos 3D: `web/js/models.js`.
- Cambiar una ilustración-marcador obliga a recompilar su `.mind` (`npm run build:marcadores`) y a regenerar el brochure.

## 5.7 Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| «Dispositivo o conexión no compatible» y mención a HTTPS | El sitio se abrió por `http://` desde otro equipo | Use HTTPS (GitHub Pages, Netlify o `--https`). |
| «Permiso de cámara denegado» | Se rechazó el permiso | Candado/ajustes del sitio → Cámara → Permitir; recargar. |
| La cámara abre, pero no aparece el modelo | Poca luz, reflejos, ilustración incompleta o de otro lugar | Encuadre toda la ilustración correcta, a 25–40 cm, sin reflejos. |
| El modelo tiembla | Ilustración pequeña o movimiento | Imprima en A4 completo; mantenga el celular estable. |
| Pantalla en blanco | Navegador antiguo sin WebGL | Use la vista 3D o un navegador actualizado. |
