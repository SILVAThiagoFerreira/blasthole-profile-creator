from __future__ import annotations

import io
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

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
    try:
        from matplotlib import font_manager
        path = font_manager.findfont("DejaVu Sans Bold" if bold else "DejaVu Sans")
        return ImageFont.truetype(path, size=size)
    except Exception:
        return ImageFont.load_default()


def _gaussian_shadow(base: Image.Image, box: tuple[int, int, int, int], radius: int, blur_radius: int = 9) -> None:
    shadow_layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_layer)
    x1, y1, x2, y2 = box
    shadow_draw.rounded_rectangle(
        (x1 + _s(2), y1 + _s(4), x2 + _s(2), y2 + _s(5)),
        radius=radius,
        fill=(17, 24, 39, 55),
    )
    blurred = shadow_layer.filter(ImageFilter.GaussianBlur(radius=blur_radius * SCALE))
    base.alpha_composite(blurred)


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
    width, _ = canvas.size

    # White background
    draw.rectangle((0, 0, width, HEADER_H), fill="#FFFFFF")
    # Red top stripe
    draw.rectangle((0, 0, width, _s(6)), fill=theme.accent_red)
    # Bottom separator
    draw.line((0, HEADER_H - _s(1), width, HEADER_H - _s(1)), fill="#E5E7EB", width=_s(1))

    # Red badge with logo (left)
    badge_box = (_s(36), _s(18), _s(236), _s(142))
    draw.rounded_rectangle(badge_box, radius=_s(18), fill=theme.accent_red)
    if logo_bytes:
        _paste_logo(canvas, logo_bytes, (_s(48), _s(30), _s(224), _s(130)))
    else:
        draw.text((_s(56), _s(46)), "ENAEX", font=_font(_s(30), bold=True), fill="#FFFFFF")
        draw.text((_s(56), _s(84)), "BRASIL", font=_font(_s(22), bold=True), fill="#FFCDD0")

    # Title block (center)
    title_x = _s(262)
    title_max_w = width - title_x - _s(320)
    draw.text((title_x, _s(26)), "PERFIL DE CARGA",
              font=_fit_font(draw, "PERFIL DE CARGA", title_max_w, _s(34), bold=True),
              fill="#111827")
    draw.text((title_x, _s(72)), polygon_name,
              font=_fit_font(draw, polygon_name, title_max_w, _s(30), bold=True),
              fill=theme.accent_red)
    draw.text((title_x, _s(114)), "Lâmina técnica 16:9",
              font=_fit_font(draw, "Lâmina técnica 16:9", title_max_w, _s(14)),
              fill="#9CA3AF")

    # Right badge (profile type)
    badge_font = _font(_s(19), bold=True)
    badge_text_w = int(draw.textlength(profile_type, font=badge_font))
    badge_w = max(_s(210), badge_text_w + _s(52))
    right_badge = (width - badge_w - _s(36), _s(38), width - _s(36), _s(108))
    draw.rounded_rectangle(right_badge, radius=_s(20), fill=theme.accent_red)
    text_x = right_badge[0] + (right_badge[2] - right_badge[0] - badge_text_w) // 2
    draw.text((text_x, _s(50)), profile_type, font=badge_font, fill="#FFFFFF")
    sub_font = _font(_s(12), bold=True)
    sub_w = int(draw.textlength("16:9", font=sub_font))
    draw.text((right_badge[0] + (right_badge[2] - right_badge[0] - sub_w) // 2, _s(78)),
              "16:9", font=sub_font, fill="#FFCDD0")


def _draw_footer(canvas: Image.Image, theme: TemplateTheme, observation: str, labels: dict[str, str]) -> None:
    draw = ImageDraw.Draw(canvas)
    width, height = canvas.size
    footer_y = height - _s(86)

    draw.line((_s(48), footer_y, width - _s(48), footer_y), fill="#E5E7EB", width=_s(1))

    entries = [
        ("Produção", theme.accent_blue),
        ("Amortecimento", theme.accent_orange),
        ("Contorno", theme.accent_red),
    ]
    legend_font = _font(_s(15), bold=True)
    x = _s(48)
    y_legend = footer_y + _s(16)
    for label, color in entries:
        draw.rounded_rectangle((x, y_legend + _s(2), x + _s(14), y_legend + _s(16)), radius=_s(4), fill=color)
        draw.text((x + _s(20), y_legend), label, font=legend_font, fill=theme.muted)
        x += int(draw.textlength(label, font=legend_font)) + _s(36)

    if observation:
        _draw_wrapped_text(
            draw, observation,
            (_s(48), footer_y + _s(42), width - _s(48), height - _s(10)),
            _font(_s(17)), theme.muted,
        )


def _draw_layout(canvas: Image.Image, theme: TemplateTheme, mesh_panel: Image.Image, profile_panels: list[Image.Image]) -> None:
    width, height = canvas.size
    top = HEADER_H + _s(8)
    bottom = _s(92)
    margin = _s(48)
    gap = _s(24)
    card_h = height - top - bottom
    mesh_w = _s(500)
    profile_area_w = width - (margin * 2) - mesh_w - gap
    profile_count = max(len(profile_panels), 1)
    profile_gap = _s(16) if profile_count > 1 else 0
    profile_w = (profile_area_w - profile_gap * (profile_count - 1)) // profile_count

    cards = [(margin, top, mesh_w, card_h, mesh_panel)]
    x_cursor = margin + mesh_w + gap
    for panel in profile_panels:
        cards.append((x_cursor, top, profile_w, card_h, panel))
        x_cursor += profile_w + profile_gap

    for x, y, w, h, panel in cards:
        box = (x, y, x + w, y + h)
        _gaussian_shadow(canvas, box, radius=_s(28), blur_radius=10)
        draw = ImageDraw.Draw(canvas)
        draw.rounded_rectangle(box, radius=_s(28), fill=theme.panel_bg)
        panel_fit = ImageOps.contain(panel, (w - _s(24), h - _s(24)))
        px = x + (w - panel_fit.size[0]) // 2
        py = y + _s(12)
        canvas.alpha_composite(panel_fit, (px, py))


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
