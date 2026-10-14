"""Regenerate the app icon, Android adaptive-icon layers, splash mark and web favicon from the CareFlow logo.

    python scripts/brand-assets.py          # from care-mobile/ (requires Pillow)

Geometry and colours are the website/mobile Logo component's: a 24-unit mark (roofline + smile) on brand teal.
"""
from pathlib import Path

from PIL import Image, ImageDraw

ASSETS = Path(__file__).resolve().parent.parent / "assets"
TEAL = (15, 118, 110, 255)  # #0F766E
MINT = (221, 245, 236, 255)  # #DDF5EC
WHITE = (255, 255, 255, 255)
SS = 4  # supersampling


def _lerp(a, b, n):
    return [(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n) for i in range(n + 1)]


def _cubic(p0, p1, p2, p3, n=400):
    out = []
    for i in range(n + 1):
        t = i / n
        out.append(tuple((1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d
                         for a, b, c, d in zip(p0, p1, p2, p3)))
    return out


def draw_mark(d, size, box_fraction, roof, smile):
    """Stroke the 24-unit logo mark centred in a box `box_fraction` of the canvas."""
    box = size * box_fraction
    off = (size - box) / 2
    u = box / 24
    w = 2.2 * u
    P = lambda x, y: (off + x * u, off + y * u)
    for pts, colour in (
        (_lerp(P(4, 12.5), P(12, 5), 400) + _lerp(P(12, 5), P(20, 12.5), 400), roof),
        ([P(*p) for p in _cubic((7.5, 15.5), (8.7, 17.4), (10.2, 18.4), (12, 18.4))
          + _cubic((12, 18.4), (13.8, 18.4), (15.3, 17.4), (16.5, 15.5))], smile),
    ):
        for x, y in pts:
            d.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill=colour)


def render(size, *, background=None, rounded=False, box_fraction, roof=MINT, smile=WHITE):
    S = size * SS
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if background and rounded:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 11 / 36), fill=background)
    elif background:
        d.rectangle([0, 0, S, S], fill=background)
    if box_fraction:
        draw_mark(d, S, box_fraction, roof, smile)
    return im.resize((size, size), Image.LANCZOS)


# iOS / store icon: full-bleed (the OS applies its own corner mask)
render(1024, background=TEAL, box_fraction=0.62).convert("RGB").save(ASSETS / "icon.png")
# Android adaptive icon: mark inside the 66% safe zone on a teal layer
render(512, box_fraction=0.42).save(ASSETS / "android-icon-foreground.png")
render(512, background=TEAL, box_fraction=0).save(ASSETS / "android-icon-background.png")
render(512, box_fraction=0.42, roof=WHITE, smile=WHITE).save(ASSETS / "android-icon-monochrome.png")
# Splash: the rounded brand tile on the ivory splash background (app.json imageWidth 200)
render(512, background=TEAL, rounded=True, box_fraction=24 / 36).save(ASSETS / "splash-icon.png")
render(48, background=TEAL, rounded=True, box_fraction=24 / 36).save(ASSETS / "favicon.png")
print("brand assets written to", ASSETS)
