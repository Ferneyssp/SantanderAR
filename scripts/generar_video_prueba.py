"""Genera 'tomas de cámara' sintéticas (Y4M) para probar el reconocimiento de marcadores
con la cámara simulada de Chromium. Coloca el marcador sobre una mesa con perspectiva,
ruido y un poco de desenfoque, simulando una foto del brochure impreso.
Uso: python3 scripts/generar_video_prueba.py   -> tests/fixtures/<lugar>.y4m y tests/fixtures/vacio.y4m
"""
import subprocess, random
from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "tests" / "fixtures"; OUT.mkdir(parents=True, exist_ok=True)
W, H = 640, 480

def mesa(seed):
    r = random.Random(seed)
    im = Image.new("RGB", (W, H), (120, 92, 66)); d = ImageDraw.Draw(im)
    for y in range(0, H, 3):
        d.line([0, y, W, y + r.randint(-2, 2)], fill=(110 + r.randint(0, 25), 84 + r.randint(0, 18), 58 + r.randint(0, 14)))
    return im

def coeffs(src, dst):
    import numpy as np
    A = []; B = []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]; B += [u, v]
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()

def toma(nombre):
    m = Image.open(ROOT / "web/assets/markers" / f"{nombre}.png").convert("RGB")
    bg = mesa(len(nombre))
    dst = [(110, 70), (540, 90), (560, 410), (90, 400)]  # ligera perspectiva
    src = [(0, 0), (m.width, 0), (m.width, m.height), (0, m.height)]
    warped = m.transform((W, H), Image.PERSPECTIVE, coeffs(src, dst), Image.BICUBIC)
    mask = Image.new("L", (W, H), 0); ImageDraw.Draw(mask).polygon(dst, fill=255)
    bg.paste(warped, (0, 0), mask)
    return bg.filter(ImageFilter.GaussianBlur(0.6))

def y4m(img, path, secs=2):
    png = path.with_suffix(".png"); img.save(png)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", str(png), "-t", str(secs),
                    "-r", "15", "-pix_fmt", "yuv420p", str(path)], check=True)

for n in ["barichara", "chicamocha", "sangil"]:
    y4m(toma(n), OUT / f"{n}.y4m"); print("ok", n)
y4m(mesa(7), OUT / "vacio.y4m"); print("ok vacio")
