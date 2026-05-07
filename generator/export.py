from __future__ import annotations

from datetime import datetime
from io import BytesIO
from pathlib import Path

from PIL import Image
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from src.config import get_export_config


def _safe_name(text: str) -> str:
    cleaned = []
    for ch in text:
        if ch.isalnum() or ch in ("-", "_"):
            cleaned.append(ch)
        elif ch.isspace() or ch in ("(", ")"):
            cleaned.append("_")
    return "".join(cleaned).strip("_") or "profile"


def export_artifact(
    image: Image.Image,
    polygon_name: str,
    output_dir: Path,
    export_png: bool = True,
    export_jpg: bool = True,
    export_pdf: bool = True,
) -> dict[str, str]:
    export_cfg = get_export_config()
    output_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base = f"{_safe_name(polygon_name)}_{stamp}"
    files: dict[str, str] = {}

    if export_png:
        path = output_dir / f"{base}.png"
        image.save(path, format="PNG")
        files["png"] = str(path)

    if export_jpg:
        path = output_dir / f"{base}.jpg"
        image.convert("RGB").save(
            path,
            format="JPEG",
            quality=int(export_cfg.get("jpg_quality", 95)),
            subsampling=int(export_cfg.get("jpg_subsampling", 0)),
        )
        files["jpg"] = str(path)

    if export_pdf:
        path = output_dir / f"{base}.pdf"
        buff = BytesIO()
        image.convert("RGB").save(buff, format="PNG")
        buff.seek(0)
        c = canvas.Canvas(str(path), pagesize=(image.width, image.height))
        c.drawImage(ImageReader(buff), 0, 0, width=image.width, height=image.height)
        c.showPage()
        c.save()
        files["pdf"] = str(path)

    return files
