"""Measure image headers from a built site; builds never access the network.
Run with Python + Pillow: python tools/refresh-image-dimensions.py _site
"""
import concurrent.futures
import html.parser
import json
from pathlib import Path
import sys
import urllib.request
from PIL import Image, ImageFile

ROOT = Path(__file__).resolve().parents[1]
class Images(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(); self.sources = set()
    def handle_starttag(self, tag, attrs):
        if tag == "img":
            src = dict(attrs).get("src", "")
            if src.startswith(("https://", "http://", "/")): self.sources.add(src)

def measure(src):
    try:
        if src.startswith("/"):
            with Image.open(ROOT / src.lstrip("/")) as image: size = image.size
        else:
            parser = ImageFile.Parser()
            request = urllib.request.Request(src, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(request, timeout=12) as response:
                for _ in range(128):
                    chunk = response.read(16384)
                    if not chunk: break
                    parser.feed(chunk)
                    if parser.image: break
            if not parser.image: raise ValueError("Image header unavailable within 2 MB")
            size = parser.image.size
        return src, {"width": size[0], "height": size[1]}, None
    except Exception as error:
        return src, None, str(error)

if __name__ == "__main__":
    site = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "_site")
    parser = Images()
    for file in site.rglob("*.html"): parser.feed(file.read_text(encoding="utf-8"))
    target = ROOT / "_data/image_dimensions.json"
    dimensions = json.loads(target.read_text(encoding="utf-8")) if target.exists() else {}
    failures = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for src, size, error in pool.map(measure, sorted(parser.sources)):
            if size: dimensions[src] = size
            else: failures.append({"src": src, "error": error})
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(dimensions, ensure_ascii=False, sort_keys=True, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"measured": len(dimensions), "failures": failures}, ensure_ascii=False, indent=2))
