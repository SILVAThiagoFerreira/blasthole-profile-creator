from __future__ import annotations

import io
from typing import Final

from PIL import Image

try:
    import cairosvg
except Exception:  # pragma: no cover - optional dependency fallback
    cairosvg = None

try:
    import resvg
except Exception:  # pragma: no cover - optional dependency fallback
    resvg = None


_SVG_SIGNATURE: Final[str] = "<svg"


def _looks_like_svg(data: bytes) -> bool:
    sample = bytes(data[:2048]).lstrip().lower()
    return _SVG_SIGNATURE.encode("ascii") in sample


def normalize_uploaded_image_bytes(data: bytes | bytearray | memoryview, asset_label: str) -> bytes:
    if not isinstance(data, (bytes, bytearray, memoryview)):
        raise ValueError(f"{asset_label} deve ser um arquivo de imagem válido.")

    raw = bytes(data)
    if not raw:
        raise ValueError(f"{asset_label} está vazio.")

    if _looks_like_svg(raw):
        if resvg is not None:
            try:
                tree = resvg.usvg.Tree.from_str(raw.decode("utf-8-sig", errors="replace"), resvg.usvg.Options.default())
                return resvg.render(tree, (1, 0, 0, 1, 0, 0))
            except Exception as exc:  # pragma: no cover - defensive path
                raise ValueError(f"Não foi possível converter o SVG de {asset_label.lower()}.") from exc
        if cairosvg is not None:
            try:
                return cairosvg.svg2png(bytestring=raw)
            except Exception as exc:  # pragma: no cover - defensive path
                raise ValueError(f"Não foi possível converter o SVG de {asset_label.lower()}.") from exc
        raise ValueError(f"{asset_label} em SVG requer um renderizador de imagem instalado.")

    return raw


def load_uploaded_image(data: bytes | bytearray | memoryview, asset_label: str) -> Image.Image:
    normalized = normalize_uploaded_image_bytes(data, asset_label)
    try:
        with Image.open(io.BytesIO(normalized)) as image:
            return image.convert("RGBA").copy()
    except Exception as exc:
        raise ValueError(f"Não foi possível ler {asset_label.lower()}.") from exc
