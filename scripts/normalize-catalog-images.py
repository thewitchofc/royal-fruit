#!/usr/bin/env python3
"""Trim white borders and fit catalog product shots into a uniform square canvas."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CATALOG_DIR = ROOT / "public" / "images" / "catalog"
OUTPUT_SIZE = 1024
PADDING_RATIO = 0.06
WHITE_THRESHOLD = 240


def content_bbox(im: Image.Image, threshold: int = WHITE_THRESHOLD) -> tuple[int, int, int, int] | None:
    rgb = im.convert("RGB")
    w, h = rgb.size
    pixels = rgb.load()
    minx, miny, maxx, maxy = w, h, -1, -1
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            if r < threshold or g < threshold or b < threshold:
                minx = min(minx, x)
                miny = min(miny, y)
                maxx = max(maxx, x)
                maxy = max(maxy, y)
    if maxx < 0:
        return None
    return minx, miny, maxx + 1, maxy + 1


def flatten_alpha(im: Image.Image) -> Image.Image:
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        rgba = im.convert("RGBA")
        bg = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
        return Image.alpha_composite(bg, rgba).convert("RGB")
    return im.convert("RGB")


def normalize_image(path: Path) -> bool:
    im = flatten_alpha(Image.open(path))
    bbox = content_bbox(im)
    if not bbox:
        print(f"skip (empty): {path.name}")
        return False

    cropped = im.crop(bbox)
    pad = int(OUTPUT_SIZE * PADDING_RATIO)
    inner = OUTPUT_SIZE - 2 * pad
    cw, ch = cropped.size
    scale = min(inner / cw, inner / ch)
    nw = max(1, int(cw * scale))
    nh = max(1, int(ch * scale))
    resized = cropped.resize((nw, nh), Image.Resampling.LANCZOS)

    canvas = Image.new("RGB", (OUTPUT_SIZE, OUTPUT_SIZE), (255, 255, 255))
    x = (OUTPUT_SIZE - nw) // 2
    y = (OUTPUT_SIZE - nh) // 2
    canvas.paste(resized, (x, y))
    canvas.save(path, "PNG", optimize=True)
    return True


def main() -> int:
    targets = sorted(CATALOG_DIR.glob("*.png"))
    if not targets:
        print("No PNG files found.")
        return 1

    ok = 0
    for path in targets:
        if normalize_image(path):
            ok += 1
            print(f"normalized: {path.name}")

    print(f"Done: {ok}/{len(targets)} images")
    return 0


if __name__ == "__main__":
    sys.exit(main())
