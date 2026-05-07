from __future__ import annotations

import io
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont, ImageOps

from .mesh import MeshInput, render_mesh_panel
from .profile import ProfileInput, render_profile_panel
from src.config import get_layout_config, load_config


BASE_DIR = Path(__file__).resolve().parent.parent
_LAYOUT = get_layout_config()
SCALE = int(_LAYOUT.get("scale", 1))
_BASE_W, _BASE_H = _LAYOUT.get("output_size", [1920, 1080])
OUTPUT_SIZE = (int(_BASE_W * SCALE), int(_BASE_H * SCALE))
HEADER_H = int(_LAYOUT.get("header_height", 168) * SCALE)


def _s(value: int | float) -> int:
    return int(round(value * SCALE))


@dataclass(frozen=True)
class TemplateTheme:
    name: str
    bg: str
    panel_bg: str
    panel_alt: str
    panel_border: str
    title: str
    text: str
    muted: str
    accent_red: str
    accent_blue: str
    accent_orange: str
    accent_dark: str
    shadow: tuple[int, int, int, int]


TEMPLATE_PRESETS: dict[str, TemplateTheme] = {
    name: TemplateTheme(
        name=name,
        bg=data["bg"],
        panel_bg=data["panel_bg"],
        panel_alt=data["panel_alt"],
        panel_border=data["panel_border"],
        title=data["title"],
        text=data["text"],
        muted=data["muted"],
        accent_red=data["accent_red"],
        accent_blue=data["accent_blue"],
        accent_orange=data["accent_orange"],
        accent_dark=data["accent_dark"],
        shadow=tuple(data["shadow"]),
    )
    for name, data in load_config()["templates"].items()
}


def load_default_logo_bytes() -> bytes | None:
    logo_path = BASE_DIR / "VISUAL" / "Enaex Brasil - White.png"
    if logo_path.exists():
        return logo_path.read_bytes()
    return None


def _font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\seguiemj.ttf",
        r"C:\Windows\Fonts\calibri.ttf",
        r"C:\Windows\Fonts\calibrib.ttf" if bold else r"C:\Windows\Fonts\calibri.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            try:
                return ImageFont.truetype(str(path), size=size)
            except OSError:
                continue
    try:
        from matplotlib import font_manager

        path = font_manager.findfont("DejaVu Sans Bold" if bold else "DejaVu Sans")
        return ImageFont.truetype(path, size=size)
    except Exception:
        return ImageFont.load_default()


def _shadow_box(base: Image.Image, box: tuple[int, int, int, int], radius: int, shadow: tuple[int, int, int, int]) -> None:
    if shadow[-1] == 0:
        return
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    x1, y1, x2, y2 = box
    for offset in range(1, 7 * SCALE + 1):
        alpha = max(0, shadow[3] - offset * 3)
        if alpha <= 0:
            continue
        draw.rounded_rectangle(
            (x1 + offset, y1 + offset, x2 + offset, y2 + offset),
            radius=radius,
            fill=(shadow[0], shadow[1], shadow[2], alpha),
        )
    base.alpha_composite(overlay)


def _draw_wrapped_text(draw: ImageDraw.ImageDraw, text: str, box: tuple[int, int, int, int], font: ImageFont.FreeTypeFont, fill: str, line_spacing: int = 6) -> None:
    x1, y1, x2, y2 = box
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if draw.textlength(candidate, font=font) <= (x2 - x1):
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    y = y1
    for line in lines:
        draw.text((x1, y), line, font=font, fill=fill)
        bbox = draw.textbbox((x1, y), line, font=font)
        y = bbox[3] + line_spacing


def _panel_base(size: tuple[int, int], theme: TemplateTheme) -> Image.Image:
    return Image.new("RGBA", size, theme.panel_bg)


def _fit_font(draw: ImageDraw.ImageDraw, text: str, max_width: int, start_size: int, *, bold: bool = False, min_size: int = 12) -> ImageFont.FreeTypeFont:
    for size in range(start_size, min_size - 1, -1):
        font = _font(size, bold=bold)
        if draw.textlength(text, font=font) <= max_width:
            return font
    return _font(min_size, bold=bold)


def _paste_logo(canvas: Image.Image, logo_bytes: bytes, box: tuple[int, int, int, int]) -> None:
    with Image.open(io.BytesIO(logo_bytes)) as logo:
        logo = logo.convert("RGBA")
        logo = ImageOps.contain(logo, (box[2] - box[0], box[3] - box[1]))
        x = box[0] + ((box[2] - box[0]) - logo.size[0]) // 2
        y = box[1] + ((box[3] - box[1]) - logo.size[1]) // 2
        canvas.alpha_composite(logo, (x, y))


def _draw_header(canvas: Image.Image, theme: TemplateTheme, polygon_name: str, profile_type: str, logo_bytes: bytes | None) -> None:
    draw = ImageDraw.Draw(canvas)
    width, height = canvas.size
    header_h = _s(HEADER_H)
    bg = "#2f3136"
    draw.rectangle((0, 0, width, header_h), fill=bg)
    draw.rectangle((0, 0, width, _s(8)), fill=theme.accent_red)
    draw.rectangle((0, header_h - _s(10), width, header_h), fill="#26282d")
    draw.line((_s(48), header_h - 1, width - _s(48), header_h - 1), fill="#5c6068", width=_s(1))

    # left brand block
    brand_box = (_s(42), _s(22), _s(294), _s(124))
    draw.rounded_rectangle(brand_box, radius=_s(18), fill="#24262b", outline="#4a4f56", width=_s(1))
    if logo_bytes:
        _paste_logo(canvas, logo_bytes, (_s(58), _s(42), _s(278), _s(102)))
    else:
        draw.text((_s(70), _s(52)), "ENAEX", font=_font(_s(26), bold=True), fill="#f3f4f6")
        draw.text((_s(70), _s(78)), "BRASIL", font=_font(_s(18), bold=True), fill="#d0d5db")

    # center title block
    title_box = (_s(316), _s(22), width - _s(266), _s(124))
    draw.rounded_rectangle(title_box, radius=_s(18), fill="#24262b", outline="#4a4f56", width=_s(1))
    title_x = title_box[0] + _s(24)
    title_w = title_box[2] - title_x - _s(24)
    draw.text((title_x, _s(32)), "PERFIL DE CARGA", font=_fit_font(draw, "PERFIL DE CARGA", title_w, _s(30), bold=True), fill="#f7f8fa")
    draw.text((title_x, _s(70)), polygon_name, font=_fit_font(draw, polygon_name, title_w, _s(29), bold=True), fill=theme.accent_red)
    draw.text((title_x, _s(102)), "Lâmina técnica 16:9", font=_fit_font(draw, "Lâmina técnica 16:9", title_w, _s(14), bold=True), fill="#c8ced5")

    # right profile badge
    tag_w = max(_s(220), int(draw.textlength(profile_type, font=_font(_s(18), bold=True)) + _s(50)))
    badge_box = (width - tag_w - _s(42), _s(40), width - _s(42), _s(94))
    draw.rounded_rectangle(badge_box, radius=_s(18), fill=theme.accent_red)
    draw.text((badge_box[0] + _s(20), _s(52)), profile_type, font=_fit_font(draw, profile_type, tag_w - _s(40), _s(19), bold=True), fill="#ffffff")
    draw.text((badge_box[0] + _s(20), _s(76)), "16:9", font=_font(_s(12), bold=True), fill="#ffd7d9")


def _draw_footer(canvas: Image.Image, theme: TemplateTheme, observation: str, labels: dict[str, str]) -> None:
    draw = ImageDraw.Draw(canvas)
    width, height = canvas.size
    footer_y = height - _s(82)
    draw.line((_s(48), footer_y, width - _s(48), footer_y), fill=theme.panel_border, width=_s(2))
    draw.text((_s(48), footer_y + _s(18)), "Legenda: Produção azul | Amortecimento laranja | Contorno vermelho", font=_font(_s(18), bold=True), fill=theme.muted)
    if observation:
        _draw_wrapped_text(draw, observation, (_s(48), footer_y + _s(42), width - _s(48), height - _s(14)), _font(_s(16)), theme.text)


def _draw_layout(canvas: Image.Image, theme: TemplateTheme, mesh_panel: Image.Image, profile_panels: list[Image.Image]) -> None:
    width, height = canvas.size
    top = _s(176)
    bottom = _s(92)
    margin = _s(48)
    gap = _s(28)
    card_h = height - top - bottom
    mesh_w = _s(500)
    profile_area_w = width - (margin * 2) - mesh_w - gap
    profile_count = max(len(profile_panels), 1)
    profile_gap = _s(18) if profile_count > 1 else 0
    profile_w = (profile_area_w - profile_gap * (profile_count - 1)) // profile_count

    cards = [(margin, top, mesh_w, card_h, mesh_panel)]
    x_cursor = margin + mesh_w + gap
    for panel in profile_panels:
        cards.append((x_cursor, top, profile_w, card_h, panel))
        x_cursor += profile_w + profile_gap

    for x, y, w, h, panel in cards:
        box = (x, y, x + w, y + h)
        _shadow_box(canvas, box, _s(28), theme.shadow)
        draw = ImageDraw.Draw(canvas)
        draw.rounded_rectangle(box, radius=_s(26), fill=theme.panel_bg, outline=theme.panel_border, width=_s(2))
        draw.rectangle((x + _s(18), y + _s(18), x + w - _s(18), y + _s(30)), fill=theme.panel_bg)
        panel = ImageOps.contain(panel, (w - _s(28), h - _s(28)))
        px = x + (w - panel.size[0]) // 2
        py = y + _s(14)
        canvas.alpha_composite(panel, (px, py))


def build_final_image(
    polygon_name: str,
    profile_type: str,
    template_name: str,
    observation: str,
    labels: dict[str, str],
    mesh_input: MeshInput,
    profiles: list[ProfileInput],
    logo_bytes: bytes | None = None,
) -> Image.Image:
    theme = TEMPLATE_PRESETS.get(template_name, next(iter(TEMPLATE_PRESETS.values())))
    canvas = Image.new("RGBA", OUTPUT_SIZE, theme.bg)
    if logo_bytes is None:
        logo_bytes = load_default_logo_bytes()

    _draw_header(canvas, theme, polygon_name, profile_type, logo_bytes)
    mesh_panel = render_mesh_panel(mesh_input, theme, size=(540, 760))
    profile_panels = [render_profile_panel(profile, theme, labels=labels, size=(540, 760)) for profile in profiles]
    _draw_layout(canvas, theme, mesh_panel, profile_panels)
    _draw_footer(canvas, theme, observation, labels)
    return canvas.convert("RGB")
