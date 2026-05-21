from __future__ import annotations

import io
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps

from .mesh import MeshInput, render_mesh_panel
from .profile import ProfileInput, render_profile_panel
from src.config import get_layout_config, get_paths_config, get_project_root, load_config


BASE_DIR = Path(__file__).resolve().parent.parent
_LAYOUT = get_layout_config()
SCALE = int(_LAYOUT.get("scale", 1))
_BASE_W, _BASE_H = _LAYOUT.get("output_size", [1920, 1080])
OUTPUT_SIZE = (int(_BASE_W * SCALE), int(_BASE_H * SCALE))
HEADER_H = int(_LAYOUT.get("header_height", 168) * SCALE)


def _s(value: int | float) -> int:
    return int(round(value * SCALE))


def _hex_to_rgba(hex_color: str, alpha: int = 255) -> tuple[int, int, int, int]:
    color = hex_color.lstrip("#")
    return int(color[0:2], 16), int(color[2:4], 16), int(color[4:6], 16), alpha


def _mix_hex(a: str, b: str, t: float) -> str:
    t = max(0.0, min(1.0, t))
    ar, ag, ab = int(a[1:3], 16), int(a[3:5], 16), int(a[5:7], 16)
    br, bg, bb = int(b[1:3], 16), int(b[3:5], 16), int(b[5:7], 16)
    rr = int(ar + (br - ar) * t)
    gg = int(ag + (bg - ag) * t)
    bb = int(ab + (bb - ab) * t)
    return f"#{rr:02X}{gg:02X}{bb:02X}"


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
    logo_path = get_project_root() / get_paths_config().get("logo_path", "")
    if logo_path.exists():
        return logo_path.read_bytes()
    legacy_logo_path = BASE_DIR / "VISUAL" / "Enaex Brasil - White.png"
    if legacy_logo_path.exists():
        return legacy_logo_path.read_bytes()
    logo_svg_path = BASE_DIR / "VISUAL" / "enaex-logo-official.svg"
    if logo_svg_path.exists():
        return _build_default_logo_bytes()
    return None


def _build_default_logo_bytes() -> bytes:
    logo = Image.new("RGBA", (1200, 320), "#FFFFFF")
    draw = ImageDraw.Draw(logo)

    red = "#E20613"
    gray = "#3E434D"

    scale = 5.5
    ox, oy = 28, 34
    mark_1 = [(20.91 * scale + ox, 0 * scale + oy), (31.31 * scale + ox, 5.86 * scale + oy), (41.68 * scale + ox, 0 * scale + oy), (41.71 * scale + ox, 11.69 * scale + oy), (52.21 * scale + ox, 17.57 * scale + oy), (41.78 * scale + ox, 23.5 * scale + oy), (41.74 * scale + ox, 35.22 * scale + oy), (31.31 * scale + ox, 29.39 * scale + oy), (20.91 * scale + ox, 35.19 * scale + oy), (20.93 * scale + ox, 23.54 * scale + oy), (31.21 * scale + ox, 17.57 * scale + oy), (20.97 * scale + ox, 11.78 * scale + oy)]
    mark_2 = [(0 * scale + ox, 17.6 * scale + oy), (10.48 * scale + ox, 11.72 * scale + oy), (20.89 * scale + ox, 17.56 * scale + oy), (10.48 * scale + ox, 23.52 * scale + oy)]
    draw.polygon(mark_1, fill=red)
    draw.polygon(mark_2, fill=red)

    text_font = _font(112, bold=True)
    draw.text((330, 86), "ENAEX", font=text_font, fill=gray)

    bbox = logo.getbbox() or (0, 0, logo.size[0], logo.size[1])
    cropped = logo.crop(bbox)
    buffer = io.BytesIO()
    cropped.save(buffer, format="PNG")
    return buffer.getvalue()


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


def _draw_background(canvas: Image.Image, theme: TemplateTheme) -> None:
    draw = ImageDraw.Draw(canvas)
    width, height = canvas.size
    draw.rectangle((0, 0, width, height), fill="#FFFFFF")
    draw.line((_s(48), HEADER_H + _s(8), width - _s(48), HEADER_H + _s(8)), fill="#EEF2F7", width=_s(1))


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
        bg = Image.new("RGBA", logo.size, (255, 255, 255, 255))
        diff = ImageChops.difference(logo, bg)
        bbox = diff.getbbox()
        if bbox:
            logo = logo.crop(bbox)
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
    draw.line((_s(36), _s(154), width - _s(36), _s(154)), fill="#EEF2F7", width=_s(1))

    # Logo badge (left)
    badge_box = (_s(36), _s(18), _s(236), _s(142))
    draw.rounded_rectangle(badge_box, radius=_s(18), fill="#FFFFFF", outline="#E5E7EB", width=_s(1))
    draw.rectangle((badge_box[0], badge_box[1], badge_box[2], badge_box[1] + _s(6)), fill=theme.accent_red)
    if logo_bytes:
        _paste_logo(canvas, logo_bytes, (_s(50), _s(34), _s(220), _s(128)))
    else:
        draw.text((_s(56), _s(50)), "ENAEX", font=_font(_s(30), bold=True), fill=theme.accent_red)
        draw.text((_s(56), _s(88)), "BRASIL", font=_font(_s(22), bold=True), fill=theme.muted)

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
    draw.rounded_rectangle((title_x, _s(146), title_x + _s(182), _s(170)), radius=_s(10), fill="#F8FAFC", outline="#E5E7EB", width=_s(1))
    draw.text((title_x + _s(14), _s(150)), "Entrega técnica", font=_font(_s(12), bold=True), fill=theme.muted)

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


def _draw_layout(canvas: Image.Image, theme: TemplateTheme, mesh_panel: Image.Image, profile_panels: list[Image.Image], compact: bool = False) -> None:
    width, height = canvas.size
    top = HEADER_H + _s(8)
    bottom = _s(92)
    margin = _s(48)
    gap = _s(24)
    card_h = height - top - bottom
    mesh_w = _s(500)
    profile_area_w = width - (margin * 2) - mesh_w - gap
    profile_count = max(len(profile_panels), 1)
    cards = [(margin, top, mesh_w, card_h, mesh_panel)]

    if profile_count <= 2:
        profile_gap = _s(16) if profile_count > 1 else 0
        profile_w = (profile_area_w - profile_gap * (profile_count - 1)) // profile_count
        x_cursor = margin + mesh_w + gap
        for panel in profile_panels:
            cards.append((x_cursor, top, profile_w, card_h, panel))
            x_cursor += profile_w + profile_gap
    else:
        cols = 2
        rows = 2
        cell_w = (profile_area_w - gap) // cols
        cell_h = (card_h - gap) // rows
        start_x = margin + mesh_w + gap
        start_y = top
        for idx, panel in enumerate(profile_panels[:4]):
            row = idx // cols
            col = idx % cols
            x = start_x + col * (cell_w + gap)
            y = start_y + row * (cell_h + gap)
            cards.append((x, y, cell_w, cell_h, panel))

    for x, y, w, h, panel in cards:
        box = (x, y, x + w, y + h)
        _gaussian_shadow(canvas, box, radius=_s(28), blur_radius=10)
        draw = ImageDraw.Draw(canvas)
        draw.rounded_rectangle(box, radius=_s(28), fill=theme.panel_bg, outline=theme.panel_border, width=_s(1))
        draw.rounded_rectangle((x + _s(2), y + _s(2), x + w - _s(2), y + h - _s(2)), radius=_s(26), outline="#FFFFFF", width=_s(1))
        panel_fit = ImageOps.contain(panel, (w - _s(24), h - _s(24)))
        px = x + (w - panel_fit.size[0]) // 2
        if compact:
            py = y + (h - panel_fit.size[1]) // 2
        else:
            py = y + max(_s(12), (h - panel_fit.size[1]) // 2)
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

    _draw_background(canvas, theme)
    _draw_header(canvas, theme, polygon_name, profile_type, logo_bytes)
    mesh_panel = render_mesh_panel(mesh_input, theme, size=(540, 760))
    compact = len(profiles) >= 3
    profile_size = (540, 520) if compact else (540, 760)
    profile_panels = [render_profile_panel(profile, theme, labels=labels, size=profile_size, compact=compact) for profile in profiles]
    _draw_layout(canvas, theme, mesh_panel, profile_panels, compact=compact)
    _draw_footer(canvas, theme, observation, labels)
    return canvas.convert("RGB")
