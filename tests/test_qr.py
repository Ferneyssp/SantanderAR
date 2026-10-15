"""
PT-19 / PT-20 — Verificación de los códigos QR del brochure PDF.
1. Rasteriza cada página del PDF y decodifica los QR con OpenCV (como lo haría una cámara).
2. Compara el contenido con los destinos esperados (index + 3 lugares).
3. Solicita cada destino por HTTP y comprueba que responde 200 y abre el lugar correcto.

Uso: python3 tests/test_qr.py entregables/<brochure>.pdf
     (para el PDF de prueba local, antes ejecutar: node scripts/serve.mjs --port 8080)
"""
import json
import sys
import urllib.request
from pathlib import Path

import cv2
import numpy as np
import pymupdf

ROOT = Path(__file__).resolve().parent.parent
pdf = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "entregables" / "Santander_AR_brochure_PRUEBA_LOCAL.pdf"
meta = json.loads(pdf.with_name(pdf.stem + "_qr.json").read_text())
base = meta["base"]
esperados = [base + "index.html"] + [f"{base}lugar.html?l={l}" for l in ("barichara", "chicamocha", "sangil")]

det = cv2.QRCodeDetector()
encontrados = []
doc = pymupdf.open(pdf)
for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=150)
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR if pix.n == 3 else cv2.COLOR_RGBA2BGR)
    ok, textos, _, _ = det.detectAndDecodeMulti(img)
    for t in (textos if ok else []):
        if t:
            encontrados.append((i + 1, t))

res = []
decod = [t for _, t in encontrados]
ok19 = sorted(decod) == sorted(esperados)
res.append({
    "id": "PT-19", "funcion": "QR del brochure: contenido",
    "procedimiento": f"Rasterizar {pdf.name} a 150 ppp y decodificar con OpenCV QRCodeDetector.",
    "esperado": "4 QR legibles (portada + 3 lugares) con los destinos correctos.",
    "obtenido": "; ".join(f"p.{p}: {t}" for p, t in encontrados) or "ningún QR decodificado",
    "estado": "Aprobada" if ok19 else "Fallida", "evidencia": f"entregables/{pdf.name}",
})

detalles, ok20 = [], True
for t in decod:
    try:
        with urllib.request.urlopen(t, timeout=10) as r:
            html = r.read().decode("utf-8", "replace")
            detalles.append(f"{t} → HTTP {r.status}")
            ok20 &= r.status == 200 and "<title>" in html
    except Exception as e:  # noqa: BLE001
        detalles.append(f"{t} → {e}")
        ok20 = False
res.append({
    "id": "PT-20", "funcion": "QR del brochure: destinos accesibles",
    "procedimiento": "Solicitar por HTTP cada URL decodificada (servidor de la base indicada en ejecución).",
    "esperado": "Cada destino responde HTTP 200 con una página de Santander AR.",
    "obtenido": "; ".join(detalles) + (" (base LOCAL: probado solo en este equipo)" if meta.get("local") else ""),
    "estado": "Aprobada" if ok20 and decod else "Fallida", "evidencia": "",
})

for r in res:
    print(("✔" if r["estado"] == "Aprobada" else "✘"), r["id"], r["obtenido"])
out = ROOT / "tests" / "resultados_qr.json"
out.write_text(json.dumps(res, ensure_ascii=False, indent=2))
sys.exit(0 if all(r["estado"] == "Aprobada" for r in res) else 1)
