"""
Genera las ilustraciones originales que sirven como marcadores de RA (image targets)
para Santander AR. Son ilustraciones propias, procedurales y estilizadas: NO son
fotografías ni representaciones arquitectónicas exactas.

Requisitos para un buen marcador MindAR: mucho detalle, alto contraste,
patrones no repetitivos y esquinas bien definidas.

Uso:  python3 scripts/generar_marcadores.py
Salida: web/assets/markers/<lugar>.png  (1200 x 900 px)
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = Path(__file__).resolve().parent.parent / "web" / "assets" / "markers"
OUT.mkdir(parents=True, exist_ok=True)
W, H = 1200, 900
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
FONT_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

INK = (31, 26, 20)
PAPER = (244, 237, 225)


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def jitter(c, r, amt):
    return tuple(max(0, min(255, v + r.randint(-amt, amt))) for v in c)


def frame(d, r, title, subtitle, code, accent):
    """Marco con patrón geométrico irregular + cartela de título (aporta rasgos únicos)."""
    d.rectangle([0, 0, W, H], outline=INK, width=18)
    # Banda inferior con título
    d.rectangle([18, H - 150, W - 18, H - 18], fill=INK)
    d.text((48, H - 140), title, font=font(FONT_B, 64), fill=PAPER)
    d.text((52, H - 62), subtitle, font=font(FONT_R, 26), fill=accent)
    # Código de lugar en un sello
    d.rectangle([W - 250, H - 132, W - 40, H - 36], outline=accent, width=4)
    d.text((W - 232, H - 118), "SANTANDER AR", font=font(FONT_R, 22), fill=PAPER)
    d.text((W - 232, H - 86), code, font=font(FONT_B, 34), fill=accent)
    # Dientes irregulares en la banda superior (rasgos asimétricos)
    x = 18
    while x < W - 18:
        w = r.randint(14, 46)
        h = r.randint(8, 30)
        if r.random() < 0.55:
            d.rectangle([x, 18, min(x + w, W - 18), 18 + h], fill=INK)
        x += w + r.randint(4, 18)


def barichara():
    r = random.Random(1978)
    img = Image.new("RGB", (W, H), (236, 214, 170))
    d = ImageDraw.Draw(img)
    # Cielo con nubes irregulares
    d.rectangle([0, 0, W, 330], fill=(178, 210, 214))
    for _ in range(9):
        cx, cy = r.randint(40, W - 40), r.randint(60, 220)
        for _ in range(6):
            rr = r.randint(18, 46)
            ox, oy = cx + r.randint(-60, 60), cy + r.randint(-14, 14)
            d.ellipse([ox - rr, oy - rr, ox + rr, oy + rr], fill=(246, 244, 236))
    # Sol
    d.ellipse([960, 70, 1080, 190], fill=(238, 176, 64), outline=INK, width=5)
    for a in range(0, 360, 24):
        t = math.radians(a)
        d.line([1020 + 70 * math.cos(t), 130 + 70 * math.sin(t),
                1020 + 98 * math.cos(t), 130 + 98 * math.sin(t)], fill=INK, width=4)
    # Cerros de fondo
    pts = [(0, 330)]
    for x in range(0, W + 40, 40):
        pts.append((x, 300 - 60 * math.sin(x / 170) - r.randint(0, 30)))
    pts.append((W, 420)); pts.append((0, 420))
    d.polygon(pts, fill=(118, 140, 82), outline=INK)
    # Templo estilizado (fachada de piedra amarilla con dos torres)
    cx = 600
    stone = (214, 168, 84)
    for (x0, x1, top) in [(cx - 230, cx - 130, 170), (cx + 130, cx + 230, 170)]:
        d.rectangle([x0, top, x1, 640], fill=stone, outline=INK, width=5)
        d.polygon([(x0 - 8, top), ((x0 + x1) / 2, top - 70), (x1 + 8, top)], fill=(176, 84, 44), outline=INK)
        d.rectangle([(x0 + x1) / 2 - 18, top + 40, (x0 + x1) / 2 + 18, top + 110], fill=INK)
        d.arc([(x0 + x1) / 2 - 18, top + 22, (x0 + x1) / 2 + 18, top + 58], 180, 360, fill=INK, width=6)
    d.rectangle([cx - 130, 260, cx + 130, 640], fill=stone, outline=INK, width=5)
    d.polygon([(cx - 140, 260), (cx, 175), (cx + 140, 260)], fill=stone, outline=INK)
    d.ellipse([cx - 34, 200, cx + 34, 250], fill=(240, 226, 196), outline=INK, width=4)
    # Sillares (bloques de piedra con variación de tono)
    for y in range(270, 640, 22):
        off = r.randint(0, 30)
        x = cx - 128 + off
        while x < cx + 128:
            w = r.randint(26, 52)
            d.rectangle([x, y, min(x + w, cx + 128), y + 20], fill=jitter(stone, r, 22), outline=(120, 90, 40))
            x += w + 2
    # Portada
    d.rectangle([cx - 60, 470, cx + 60, 640], fill=(70, 46, 26), outline=INK, width=5)
    d.pieslice([cx - 60, 410, cx + 60, 530], 180, 360, fill=(70, 46, 26), outline=INK, width=5)
    for i in range(-2, 3):
        d.line([cx + i * 22, 470, cx + i * 22, 640], fill=(140, 96, 52), width=3)
    # Casas laterales con tejas
    for (x0, x1, roof) in [(40, 330, 470), (870, 1160, 450)]:
        d.rectangle([x0, roof, x1, 690], fill=(248, 242, 228), outline=INK, width=5)
        d.polygon([(x0 - 20, roof), ((x0 + x1) / 2, roof - 80), (x1 + 20, roof)], fill=(178, 82, 42), outline=INK)
        for tx in range(x0 - 10, x1 + 10, 18):
            d.line([tx, roof - 2, (x0 + x1) / 2 + (tx - (x0 + x1) / 2) * 0.05, roof - 76], fill=(120, 50, 24), width=2)
        for k in range(2):
            wx = x0 + 40 + k * (x1 - x0 - 120)
            d.rectangle([wx, roof + 60, wx + 70, roof + 150], fill=(46, 92, 82), outline=INK, width=4)
            for b in range(1, 4):
                d.line([wx + b * 17, roof + 60, wx + b * 17, roof + 150], fill=INK, width=3)
        d.rectangle([(x0 + x1) / 2 - 32, roof + 90, (x0 + x1) / 2 + 32, 690], fill=(120, 64, 32), outline=INK, width=4)
    # Calle empedrada (adoquines poligonales irregulares)
    d.rectangle([18, 690, W - 18, H - 150], fill=(196, 160, 102))
    for _ in range(420):
        x, y = r.randint(20, W - 20), r.randint(694, H - 156)
        s = r.randint(8, 22)
        poly = [(x + s * math.cos(t) * r.uniform(0.6, 1.1), y + s * 0.6 * math.sin(t) * r.uniform(0.6, 1.1))
                for t in [i * math.pi / 3 + r.random() * 0.4 for i in range(6)]]
        d.polygon(poly, fill=jitter((214, 176, 112), r, 30), outline=(110, 80, 40))
    frame(d, r, "BARICHARA", "Centro histórico · ilustración original (no a escala)", "BAR-01", (238, 176, 64))
    return img


def chicamocha():
    r = random.Random(632)
    img = Image.new("RGB", (W, H), (250, 214, 160))
    d = ImageDraw.Draw(img)
    # Cielo degradado por bandas
    for i, c in enumerate([(250, 214, 160), (246, 198, 140), (240, 180, 120), (232, 164, 108)]):
        d.rectangle([0, i * 60, W, i * 60 + 60], fill=c)
    # Cordilleras en capas, cada una con perfil irregular
    layers = [((120, 96, 120), 250, 50), ((150, 102, 86), 320, 70), ((176, 118, 70), 400, 90)]
    for col, base, amp in layers:
        pts = [(0, H)]
        x = 0
        while x <= W:
            pts.append((x, base - amp * abs(math.sin(x / r.uniform(70, 140))) - r.randint(0, 40)))
            x += r.randint(18, 50)
        pts.append((W, H))
        d.polygon(pts, fill=col, outline=INK)
    # Cañón: dos laderas con estratos
    left = [(0, 430)]
    right = [(W, 410)]
    for i in range(1, 12):
        left.append((i * 46 + r.randint(-10, 10), 430 + i * 18 + r.randint(-8, 8)))
        right.append((W - i * 46 + r.randint(-10, 10), 410 + i * 19 + r.randint(-8, 8)))
    for side in (left, right):
        poly = side + [(side[-1][0], H - 150), (side[0][0], H - 150)]
        d.polygon(poly, fill=(196, 132, 72), outline=INK)
        for k in range(1, len(side)):
            x0, y0 = side[k]
            x1 = side[0][0]
            d.line([x0, y0, x1, y0 + r.randint(-6, 6)], fill=jitter((132, 80, 46), r, 20), width=r.randint(3, 7))
    # Fondo del cañón y río serpenteante
    d.polygon([left[-1], right[-1], (right[-1][0], H - 150), (left[-1][0], H - 150)], fill=(150, 150, 84))
    pts = []
    for y in range(int(min(left[-1][1], right[-1][1])) - 10, H - 150, 8):
        pts.append((600 + 70 * math.sin(y / 26), y))
    d.line(pts, fill=(66, 132, 156), width=26, joint="curve")
    d.line(pts, fill=(196, 228, 236), width=6, joint="curve")
    # Vegetación seca (arbustos puntuales)
    for _ in range(140):
        x, y = r.randint(30, W - 30), r.randint(440, H - 160)
        rr = r.randint(4, 11)
        d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=jitter((92, 112, 52), r, 25), outline=INK)
    # Cable del teleférico y cabinas
    d.line([60, 360, 1140, 330], fill=INK, width=5)
    d.line([60, 372, 1140, 342], fill=INK, width=2)
    for tx in (60, 1140):
        d.rectangle([tx - 14, 320, tx + 14, 470], fill=(80, 80, 88), outline=INK, width=3)
    for cx in (300, 610, 880):
        cy = 360 - (cx - 60) * 30 / 1080
        d.line([cx, cy, cx, cy + 40], fill=INK, width=4)
        d.rounded_rectangle([cx - 32, cy + 40, cx + 32, cy + 96], radius=10, fill=(198, 40, 46), outline=INK, width=4)
        d.rectangle([cx - 22, cy + 52, cx + 22, cy + 74], fill=(210, 236, 244), outline=INK, width=2)
    # Aves
    for _ in range(7):
        x, y = r.randint(120, 1080), r.randint(90, 230)
        s = r.randint(10, 20)
        d.arc([x - s, y, x, y + s], 200, 340, fill=INK, width=3)
        d.arc([x, y, x + s, y + s], 200, 340, fill=INK, width=3)
    frame(d, r, "CHICAMOCHA", "Cañón y teleférico · ilustración original (no a escala)", "CHI-02", (240, 180, 120))
    return img


def sangil():
    r = random.Random(1689)
    img = Image.new("RGB", (W, H), (208, 226, 196))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 260], fill=(196, 222, 226))
    # Montañas lejanas
    pts = [(0, 300)]
    for x in range(0, W + 30, 30):
        pts.append((x, 240 - 50 * math.sin(x / 120 + 1) - r.randint(0, 25)))
    pts += [(W, 330), (0, 330)]
    d.polygon(pts, fill=(104, 140, 108), outline=INK)
    # Río (dos brazos que se unen)
    d.polygon([(0, 600), (W, 560), (W, 700), (0, 740)], fill=(70, 138, 150), outline=INK)
    d.polygon([(380, 330), (470, 330), (300, 620), (190, 630)], fill=(78, 146, 156), outline=INK)
    for _ in range(80):
        x, y = r.randint(0, W), r.randint(580, 720)
        d.line([x, y, x + r.randint(14, 40), y - r.randint(0, 4)], fill=(206, 234, 238), width=3)
    # Piedras en el río
    for _ in range(26):
        x, y = r.randint(20, W - 20), r.randint(600, 720)
        rr = r.randint(10, 26)
        d.ellipse([x - rr, y - rr * 0.6, x + rr, y + rr * 0.6], fill=jitter((150, 140, 120), r, 20), outline=INK, width=3)
    # Suelo de la isla
    d.rectangle([18, 330, W - 18, 560], fill=(124, 156, 86))
    # Árboles con "barbas de viejo" colgantes
    for i in range(7):
        x = 110 + i * 165 + r.randint(-30, 30)
        base = 560 + r.randint(-10, 10)
        top = r.randint(150, 230)
        d.line([x, base, x + r.randint(-20, 20), top + 80], fill=(84, 60, 38), width=r.randint(16, 24))
        for _ in range(5):
            bx = x + r.randint(-10, 10)
            by = r.randint(top + 90, base - 120)
            d.line([bx, by, bx + r.choice([-1, 1]) * r.randint(60, 110), by - r.randint(30, 70)], fill=(84, 60, 38), width=8)
        for _ in range(9):
            ox, oy = x + r.randint(-110, 110), top + r.randint(-20, 90)
            rr = r.randint(40, 70)
            d.ellipse([ox - rr, oy - rr * 0.7, ox + rr, oy + rr * 0.7], fill=jitter((58, 112, 62), r, 22), outline=INK, width=3)
        for _ in range(26):
            sx = x + r.randint(-130, 130)
            sy = top + r.randint(30, 110)
            ln = r.randint(60, 200)
            col = jitter((176, 188, 160), r, 18)
            pts = [(sx + 6 * math.sin(k / 3 + sx), sy + k * ln / 10) for k in range(11)]
            d.line(pts, fill=col, width=r.randint(3, 6))
    # Puente colgante
    d.line([0, 760, W, 730], fill=INK, width=6)
    for x in range(0, W, 26):
        y = 760 - x * 30 / W
        d.line([x, y, x, y + 24], fill=(120, 80, 40), width=4)
    frame(d, r, "SAN GIL", "Parque El Gallineral · ilustración original (no a escala)", "SGL-03", (176, 220, 150))
    return img


if __name__ == "__main__":
    for name, fn in [("barichara", barichara), ("chicamocha", chicamocha), ("sangil", sangil)]:
        im = fn().filter(ImageFilter.SMOOTH_MORE)
        im.save(OUT / f"{name}.png", optimize=True)
        im.resize((600, 450), Image.LANCZOS).save(OUT / f"{name}-thumb.jpg", quality=86)
        print("ok", OUT / f"{name}.png")
