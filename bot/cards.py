"""Generate branded achievement share-cards (PNG) with Pillow."""

import io
import math

from PIL import Image, ImageDraw, ImageFont

W, H = 1000, 600

# Brand palette (matches the site's navy + cyan).
NAVY_TOP = (10, 26, 38)
NAVY_BOTTOM = (3, 11, 18)
CYAN = (17, 198, 207)
MINT = (132, 230, 234)
TEXT = (239, 250, 250)
MUTED = (147, 172, 181)

# Try bold/regular fonts with Cyrillic support; fall back to Pillow default.
_BOLD_PATHS = [r"C:\Windows\Fonts\arialbd.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]
_REG_PATHS = [r"C:\Windows\Fonts\arial.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]


def _font(size: int, bold: bool = False):
    for path in (_BOLD_PATHS if bold else _REG_PATHS):
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()


def _star_points(cx: float, cy: float, outer: float, inner: float, points: int = 5):
    pts = []
    for i in range(points * 2):
        ang = -math.pi / 2 + i * math.pi / points
        rad = outer if i % 2 == 0 else inner
        pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
    return pts


def _gradient() -> Image.Image:
    img = Image.new("RGB", (W, H), NAVY_TOP)
    draw = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        col = tuple(int(NAVY_TOP[i] + (NAVY_BOTTOM[i] - NAVY_TOP[i]) * t) for i in range(3))
        draw.line([(0, y), (W, y)], fill=col)
    return img


def _wrap(draw, text: str, font, max_width: int) -> list[str]:
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if draw.textlength(trial, font=font) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def generate_card(name: str, achievement: str) -> bytes:
    img = _gradient()
    d = ImageDraw.Draw(img)

    # Top accent bar + wordmark + eyebrow
    d.rectangle([0, 0, W, 8], fill=CYAN)
    d.text((60, 48), "MENTORIA HUB", font=_font(30, bold=True), fill=MINT)
    eyebrow = "ДОСТИЖЕНИЕ"
    d.text((W - 60 - d.textlength(eyebrow, font=_font(24, bold=True)), 52), eyebrow, font=_font(24, bold=True), fill=MUTED)

    # Star badge — drawn as a polygon so it always renders (no glyph dependency)
    cx, cy, r = W // 2, 210, 64
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=CYAN)
    d.polygon(_star_points(cx, cy, outer=40, inner=17), fill=NAVY_BOTTOM)

    # Achievement text (wrapped, centered)
    ach_font = _font(52, bold=True)
    lines = _wrap(d, achievement, ach_font, W - 160)
    y = 330
    for line in lines[:3]:
        lw = d.textlength(line, font=ach_font)
        d.text((cx - lw / 2, y), line, font=ach_font, fill=TEXT)
        y += 64

    # Name
    name_font = _font(34)
    nw = d.textlength(name, font=name_font)
    d.text((cx - nw / 2, y + 16), name, font=name_font, fill=MINT)

    # Footer
    footer = "mentoria-hub-ruddy.vercel.app"
    foot_font = _font(24)
    fw = d.textlength(footer, font=foot_font)
    d.text((cx - fw / 2, H - 56), footer, font=foot_font, fill=MUTED)

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
