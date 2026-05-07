from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from src.config import get_layout_config


SCALE = int(get_layout_config().get("scale", 1))


def _s(value: int | float) -> int:
    return int(round(value * SCALE))


@dataclass
class ProfileInput:
    name: str
    kind: str
    diametro_furo: float
    altura_banco: float
    subperfuracao: float
    stemming: float
    air_deck: float
    blastbag: float
    inclinacao: float
    azimute: float
    densidade: float


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


def _fmt(v: float, digits: int = 2) -> str:
    return f"{v:.{digits}f}".replace(".", ",")


def _short(text: str, limit: int = 12) -> str:
    text = text.strip()
    if len(text) <= limit:
        return text
    return text[: max(0, limit - 3)].rstrip() + "..."


def _kind_name(kind: str) -> str:
    normalized = kind.lower().strip()
    if "amort" in normalized or "buffer" in normalized:
        return "Amortecimento"
    if "contorno" in normalized:
        return "Contorno"
    if "prod" in normalized:
        return "Produção"
    return kind.strip() or "Perfil"


def _kind_palette(kind: str, theme) -> tuple[str, str]:
    normalized = kind.lower().strip()
    if "amort" in normalized or "buffer" in normalized:
        return theme.accent_orange, "#fff1e2"
    if "contorno" in normalized:
        return theme.accent_red, "#ffe3e5"
    return theme.accent_blue, "#e9f2fb"


def _extract_badge_letter(name: str) -> str:
    match = re.search(r'\b([A-Z])\b', name)
    if match:
        return match.group(1)
    stripped = name.strip()
    return stripped[0].upper() if stripped else "?"


def _hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    h = hex_color.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def _draw_arrow(draw: ImageDraw.ImageDraw, x: int, y1: int, y2: int, color: str, label: str, font, align: str = "left") -> None:
    draw.line((x, y1, x, y2), fill=color, width=_s(2))
    draw.polygon([(x, y1), (x - _s(5), y1 + _s(10)), (x + _s(5), y1 + _s(10))], fill=color)
    draw.polygon([(x, y2), (x - _s(5), y2 - _s(10)), (x + _s(5), y2 - _s(10))], fill=color)
    text_x = x + _s(10) if align == "left" else x - draw.textlength(label, font=font) - _s(10)
    draw.text((text_x, (y1 + y2) / 2 - _s(10)), label, font=font, fill=color)


def _draw_metric_row(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], label: str, value: str, color: str, theme, kind: str) -> None:
    x1, y1, x2, y2 = box
    icon_x = x1 + _s(10)
    icon_y = y1 + _s(8)
    if kind == "diameter":
        draw.ellipse((icon_x, icon_y, icon_x + _s(26), icon_y + _s(26)), outline=color, width=_s(2))
        draw.line((icon_x + _s(6), icon_y + _s(13), icon_x + _s(20), icon_y + _s(13)), fill=color, width=_s(2))
        draw.line((icon_x + _s(13), icon_y + _s(6), icon_x + _s(13), icon_y + _s(20)), fill=color, width=_s(2))
    elif kind == "height":
        draw.line((icon_x + _s(13), icon_y, icon_x + _s(13), icon_y + _s(26)), fill=color, width=_s(2))
        draw.polygon([(icon_x + _s(13), icon_y), (icon_x + _s(8), icon_y + _s(8)), (icon_x + _s(18), icon_y + _s(8))], fill=color)
        draw.polygon([(icon_x + _s(13), icon_y + _s(26)), (icon_x + _s(8), icon_y + _s(18)), (icon_x + _s(18), icon_y + _s(18))], fill=color)
    elif kind == "subdrill":
        draw.line((icon_x + _s(13), icon_y, icon_x + _s(13), icon_y + _s(26)), fill=color, width=_s(2))
        draw.polygon([(icon_x + _s(13), icon_y + _s(26)), (icon_x + _s(8), icon_y + _s(18)), (icon_x + _s(18), icon_y + _s(18))], fill=color)
    elif kind == "stemming":
        draw.rectangle((icon_x + _s(4), icon_y + _s(6), icon_x + _s(22), icon_y + _s(20)), outline=color, width=_s(2))
    elif kind == "blastbag":
        draw.rounded_rectangle((icon_x + _s(4), icon_y + _s(8), icon_x + _s(22), icon_y + _s(18)), radius=_s(5), fill="#2f343b", outline=color, width=_s(1))
    elif kind == "airdeck":
        draw.rectangle((icon_x + _s(4), icon_y + _s(8), icon_x + _s(22), icon_y + _s(18)), outline=color, width=_s(2))
        for yy in range(icon_y + _s(10), icon_y + _s(18), _s(4)):
            draw.line((icon_x + _s(6), yy, icon_x + _s(20), yy), fill=color, width=_s(1))
    elif kind == "inclination":
        draw.line((icon_x + _s(4), icon_y + _s(22), icon_x + _s(22), icon_y + _s(22)), fill=color, width=_s(2))
        draw.line((icon_x + _s(4), icon_y + _s(22), icon_x + _s(20), icon_y + _s(6)), fill=color, width=_s(2))
    elif kind == "azimuth":
        draw.ellipse((icon_x + _s(2), icon_y + _s(2), icon_x + _s(24), icon_y + _s(24)), outline=color, width=_s(2))
        draw.line((icon_x + _s(13), icon_y + _s(13), icon_x + _s(20), icon_y + _s(8)), fill=color, width=_s(2))
        draw.line((icon_x + _s(13), icon_y + _s(13), icon_x + _s(9), icon_y + _s(20)), fill=color, width=_s(2))
    else:
        draw.rectangle((icon_x + _s(4), icon_y + _s(6), icon_x + _s(22), icon_y + _s(20)), outline=color, width=_s(2))

    draw.text((x1 + _s(46), y1 + _s(8)), label.upper(), font=_font(_s(11), bold=True), fill=theme.muted)
    draw.text((x2 - _s(18) - draw.textlength(value, font=_font(_s(12), bold=True)), y1 + _s(8)), value, font=_font(_s(12), bold=True), fill=theme.title)
    draw.line((x1 + _s(8), y2 - 1, x2 - _s(8), y2 - 1), fill=theme.panel_border, width=_s(1))


def render_profile_panel(profile: ProfileInput, theme, labels: dict[str, str], size: tuple[int, int] = (540, 760)) -> Image.Image:
    size = (_s(size[0]), _s(size[1]))
    img = Image.new("RGBA", size, theme.panel_alt)
    draw = ImageDraw.Draw(img)
    w, h = size
    accent, accent_soft = _kind_palette(profile.kind, theme)
    kind_label = _kind_name(profile.kind)

    draw.rounded_rectangle((_s(18), _s(18), w - _s(18), h - _s(18)), radius=_s(20), fill=theme.panel_alt, outline=theme.panel_border, width=_s(2))
    draw.rectangle((_s(18), _s(18), w - _s(18), _s(92)), fill="#ffffff", outline=theme.panel_border, width=0)
    draw.ellipse((_s(34), _s(30), _s(74), _s(70)), fill=accent)
    draw.text((_s(47), _s(38)), str((1 if kind_label == "Produção" else 2 if kind_label == "Amortecimento" else 3)), font=_font(_s(18), bold=True), fill="#ffffff")
    draw.text((_s(94), _s(32)), _short(profile.name, 22).upper(), font=_font(_s(19), bold=True), fill=accent)
    draw.text((_s(94), _s(58)), f"{kind_label.upper()}  •  {int(profile.diametro_furo)} MM", font=_font(_s(12), bold=True), fill=theme.muted)
    draw.line((_s(34), _s(92), w - _s(34), _s(92)), fill=accent, width=_s(2))

    drawing_box = (_s(36), _s(112), _s(176), h - _s(108))
    info_box = (_s(188), _s(112), w - _s(36), h - _s(108))
    draw.rounded_rectangle(drawing_box, radius=_s(18), fill="#ffffff", outline=theme.panel_border, width=_s(1))
    draw.rounded_rectangle(info_box, radius=_s(18), fill="#ffffff", outline=theme.panel_border, width=_s(1))

    left, top, right, bottom = drawing_box
    cx = left + (right - left) // 2
    top += _s(18)
    bottom -= _s(18)
    cyl_w = _s(54)
    cyl_x1 = cx - cyl_w // 2
    cyl_x2 = cx + cyl_w // 2
    hole_top = top + _s(24)
    hole_bottom = bottom - _s(22)
    hole_h = hole_bottom - hole_top
    hole_left = left + _s(26)
    hole_right = right - _s(26)
    cyl_x1 = hole_left + ((hole_right - hole_left) - cyl_w) // 2
    cyl_x2 = cyl_x1 + cyl_w

    total = max(profile.altura_banco + profile.subperfuracao, 0.01)
    stem = max(min(profile.stemming, profile.altura_banco), 0.0)
    sub = max(profile.subperfuracao, 0.0)
    blastbag = max(profile.blastbag, 0.0)
    air_deck = max(profile.air_deck, 0.0)
    charge = max(profile.altura_banco - stem - blastbag - air_deck, 0.0)
    parts = [(stem, "stemming"), (blastbag, "blastbag"), (air_deck, "airdeck"), (charge, "column"), (sub, "subdrill")]
    y = hole_top
    colors = {
        "stemming": "#d0d6de",
        "blastbag": "#343a40",
        "airdeck": "#ffffff",
        "column": accent,
        "subdrill": "#4f5560",
    }
    outline = theme.panel_border
    for idx, (value, key) in enumerate(parts):
        if value <= 0:
            continue
        segment_h = hole_h * (value / total)
        y2 = hole_bottom if key == "subdrill" else y + segment_h
        if key == "airdeck":
            draw.rectangle((cyl_x1, y, cyl_x2, y2), fill="#ffffff", outline=accent, width=2)
            for yy in range(int(y + 4), int(y2), 7):
                draw.line((cyl_x1 + 5, yy, cyl_x2 - 5, yy), fill=accent, width=1)
        elif key == "blastbag":
            draw.rounded_rectangle((cyl_x1 + 2, y, cyl_x2 - 2, y2), radius=4, fill=colors[key], outline="#111827", width=1)
        else:
            draw.rectangle((cyl_x1, y, cyl_x2, y2), fill=colors[key], outline=outline, width=1)
            draw.ellipse((cyl_x1, y - 6, cyl_x2, y + 6), fill=colors[key], outline=outline)
            if key == "subdrill":
                draw.ellipse((cyl_x1, y2 - 6, cyl_x2, y2 + 6), fill=colors[key], outline=outline)
        y = y2

    draw.rounded_rectangle((cyl_x1, hole_top, cyl_x2, hole_bottom), radius=_s(26), outline=theme.title, width=_s(2))
    draw.line((cyl_x1, hole_top + _s(6), cyl_x1, hole_bottom - _s(6)), fill=theme.title, width=_s(1))
    draw.line((cyl_x2, hole_top + _s(6), cyl_x2, hole_bottom - _s(6)), fill=theme.title, width=_s(1))
    draw.ellipse((cyl_x1, hole_top - _s(6), cyl_x2, hole_top + _s(8)), outline=theme.title, fill="#e9eef4")
    draw.ellipse((cyl_x1, hole_bottom - _s(8), cyl_x2, hole_bottom + _s(6)), outline=theme.title, fill="#5a5f66")

    draw.text((_s(34), bottom - _s(18)), f"ALTURA DO BANCO {_fmt(profile.altura_banco)} M", font=_font(_s(11), bold=True), fill=theme.muted)

    ix1, iy1, ix2, iy2 = info_box
    draw.text((ix1 + _s(18), iy1 + _s(18)), "PARÂMETROS TÉCNICOS", font=_font(_s(18), bold=True), fill=theme.title)
    summary_box = (ix1 + _s(12), iy1 + _s(52), ix2 - _s(12), iy1 + _s(126))
    draw.rounded_rectangle(summary_box, radius=_s(14), fill="#f8fafc", outline=theme.panel_border, width=_s(1))

    def _chip(x: int, y: int, label: str, value: str, fill: str) -> int:
        text = f"{label}: {value}"
        pill_w = max(_s(92), int(draw.textlength(text, font=_font(_s(12), bold=True)) + _s(24)))
        pill_h = _s(26)
        draw.rounded_rectangle((x, y, x + pill_w, y + pill_h), radius=_s(12), fill=fill)
        draw.text((x + _s(10), y + _s(5)), text, font=_font(_s(12), bold=True), fill=theme.title)
        return x + pill_w + _s(8)

    chip_y = iy1 + _s(66)
    chip_x = ix1 + _s(22)
    chip_x = _chip(chip_x, chip_y, labels.get("stemming", "Tampão"), f"{_fmt(stem)} m", "#eef2f7")
    chip_x = _chip(chip_x, chip_y, labels.get("column", "Carga"), f"{_fmt(charge)} m", accent_soft)
    if sub > 0:
        _chip(chip_x, chip_y, labels.get("subdrill", "Subperf."), f"{_fmt(sub)} m", "#eef2f7")

    rows = [
        ("Diâmetro do furo", f"{int(profile.diametro_furo)} mm"),
        ("Altura do banco", f"{_fmt(profile.altura_banco)} m"),
        (labels.get("subdrill", "Subperfuração"), f"{_fmt(profile.subperfuracao)} m"),
        (labels.get("stemming", "Tampão"), f"{_fmt(profile.stemming)} m"),
        (labels.get("blastbag", "Blastbag"), f"{_fmt(profile.blastbag)} m"),
        (labels.get("airdeck", "Deck de ar"), f"{_fmt(profile.air_deck)} m"),
        ("Inclinação", f"{_fmt(profile.inclinacao, 1)}°"),
        ("Azimute", f"{_fmt(profile.azimute, 1)}°"),
        ("Densidade", f"{_fmt(profile.densidade, 2)} g/cm³"),
    ]
    y = iy1 + _s(138)
    metric_h = _s(42)
    metric_icons = ["diameter", "height", "subdrill", "stemming", "blastbag", "airdeck", "inclination", "azimuth", "density"]
    for (label, value), icon_kind in zip(rows, metric_icons):
        _draw_metric_row(draw, (ix1 + 10, y, ix2 - 10, y + metric_h), label, value, accent, theme, icon_kind)
        y += metric_h + 2

    footer_bar = (ix1 + _s(18), iy2 - _s(58), ix2 - _s(18), iy2 - _s(20))
    draw.rounded_rectangle(footer_bar, radius=_s(16), fill="#f7f9fb", outline=theme.panel_border, width=_s(1))
    draw.rectangle((footer_bar[0] + _s(1), footer_bar[1] + _s(1), footer_bar[2] - _s(1), footer_bar[1] + _s(8)), fill=accent)
    draw.text((footer_bar[0] + _s(14), footer_bar[1] + _s(14)), f"{_short(profile.name, 20)} | {kind_label}", font=_font(_s(12), bold=True), fill=theme.title)
    return img
