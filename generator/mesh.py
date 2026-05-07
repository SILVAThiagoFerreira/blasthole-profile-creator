from __future__ import annotations

import csv
import io
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps
from src.config import get_layout_config


SCALE = int(get_layout_config().get("scale", 1))


def _s(value: int | float) -> int:
    return int(round(value * SCALE))


@dataclass
class MeshPoint:
    x: float
    y: float
    kind: str


@dataclass
class MeshInput:
    polygon_name: str
    uploaded_mesh: bytes | None = None


def parse_mesh_csv(data: bytes) -> list[MeshPoint]:
    text = data.decode("utf-8-sig", errors="ignore")
    reader = csv.DictReader(io.StringIO(text))
    points: list[MeshPoint] = []
    for row in reader:
        try:
            points.append(
                MeshPoint(
                    x=float(row.get("X", row.get("x", 0)) or 0),
                    y=float(row.get("Y", row.get("y", 0)) or 0),
                    kind=str(row.get("tipo", row.get("tipo_furo", row.get("type", "produção")))).strip(),
                )
            )
        except ValueError:
            continue
    return points


def _kind_color(kind: str) -> str:
    normalized = kind.lower().strip()
    if "contorno" in normalized:
        return "#d71920"
    if "amort" in normalized or "buffer" in normalized:
        return "#f28c28"
    return "#1d6fb8"


def _font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        (r"C:\Windows\Fonts\Montserrat-Bold.ttf" if bold else r"C:\Windows\Fonts\Montserrat-Regular.ttf"),
        (r"C:\Windows\Fonts\Montserrat-SemiBold.ttf" if bold else r"C:\Windows\Fonts\Montserrat-Medium.ttf"),
        (r"C:\Windows\Fonts\calibrib.ttf" if bold else r"C:\Windows\Fonts\calibri.ttf"),
        (r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf"),
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            try:
                return ImageFont.truetype(str(path), size=size)
            except OSError:
                continue
    return ImageFont.load_default()


def render_mesh_panel(mesh_input: MeshInput, theme, size: tuple[int, int] = (540, 760)) -> Image.Image:
    size = (_s(size[0]), _s(size[1]))
    if mesh_input.uploaded_mesh:
        img = Image.new("RGBA", size, theme.panel_alt)
        draw = ImageDraw.Draw(img)
        w, h = size
        draw.rounded_rectangle((_s(18), _s(18), w - _s(18), h - _s(18)), radius=_s(26), fill=theme.panel_alt, outline=theme.panel_border, width=_s(2))
        draw.text((_s(34), _s(34)), "MALHA DE PERFURAÇÃO", font=_font(_s(22), bold=True), fill=theme.title)
        draw.line((_s(34), _s(72), _s(90), _s(72)), fill=theme.accent_red, width=_s(4))
        mesh = Image.open(io.BytesIO(mesh_input.uploaded_mesh)).convert("RGBA")
        mesh = ImageOps.contain(mesh, (w - _s(80), h - _s(220)))
        img.alpha_composite(mesh, ((w - mesh.size[0]) // 2, _s(120)))
        draw.text((_s(36), h - _s(86)), "Imagem anexada pelo usuário.", font=_font(_s(13), bold=True), fill=theme.muted)
        return img

    img = Image.new("RGBA", size, theme.panel_alt)
    draw = ImageDraw.Draw(img)
    w, h = size

    draw.rounded_rectangle((_s(18), _s(18), w - _s(18), h - _s(18)), radius=_s(26), fill=theme.panel_alt, outline=theme.panel_border, width=_s(2))
    draw.text((_s(34), _s(34)), "MALHA DE PERFURAÇÃO", font=_font(_s(22), bold=True), fill=theme.title)
    draw.line((_s(34), _s(72), _s(90), _s(72)), fill=theme.accent_red, width=_s(4))
    draw.text((_s(34), _s(88)), mesh_input.polygon_name, font=_font(_s(15)), fill=theme.muted)

    plot = (_s(40), _s(108), w - _s(40), h - _s(130))
    draw.rounded_rectangle(plot, radius=_s(20), fill="#ffffff", outline=theme.panel_border, width=_s(1))
    x1, y1, x2, y2 = plot
    icon_cx = (x1 + x2) // 2
    icon_cy = y1 + _s(120)
    draw.rounded_rectangle((icon_cx - _s(66), icon_cy - _s(56), icon_cx + _s(66), icon_cy + _s(46)), radius=_s(24), outline=theme.panel_border, width=_s(2), fill="#fbfcfd")
    draw.ellipse((icon_cx - _s(12), icon_cy - _s(10), icon_cx + _s(12), icon_cy + _s(14)), fill=theme.accent_red)
    draw.line((icon_cx, icon_cy - _s(18), icon_cx, icon_cy + _s(18)), fill=theme.accent_red, width=_s(3))
    draw.line((icon_cx - _s(18), icon_cy, icon_cx + _s(18), icon_cy), fill=theme.accent_red, width=_s(3))
    draw.text((icon_cx - _s(150), icon_cy + _s(62)), "Anexe a imagem da malha", font=_font(_s(15), bold=True), fill=theme.text)
    draw.text((icon_cx - _s(136), icon_cy + _s(86)), "Se não houver anexo, o painel fica apenas como referência.", font=_font(_s(13)), fill=theme.muted)

    # legend
    legend_y = h - _s(104)
    entries = [("Produção", theme.accent_blue), ("Amortecimento", theme.accent_orange), ("Contorno", theme.accent_red)]
    x = _s(42)
    for label, color in entries:
        draw.rounded_rectangle((x, legend_y, x + _s(18), legend_y + _s(18)), radius=_s(6), fill=color)
        draw.text((x + _s(24), legend_y - _s(2)), label, font=_font(_s(14)), fill=theme.text)
        x += _s(136)
    draw.text((_s(42), h - _s(56)), "Somente imagem anexada, sem geração sintética da malha.", font=_font(_s(13)), fill=theme.muted)
    return img
