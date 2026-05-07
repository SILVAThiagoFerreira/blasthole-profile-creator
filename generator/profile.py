from __future__ import annotations

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
    parts = name.split()
    if parts and len(parts[-1]) == 1 and parts[-1].isupper():
        return parts[-1]
    stripped = name.strip()
    return stripped[0].upper() if stripped else "?"


def _hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    h = hex_color.lstrip("#")
    if len(h) != 6:
        raise ValueError(f"Expected 6-character hex color, got {hex_color!r}")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def _draw_gradient_segment(
    draw: ImageDraw.ImageDraw,
    x1: int, y1: int, x2: int, y2: int,
    base_color: str,
    highlight: float = 0.40,
) -> None:
    if y1 >= y2 or x1 >= x2:
        return
    r, g, b = _hex_to_rgb(base_color)
    width = x2 - x1
    for i in range(width):
        t = i / max(width - 1, 1)
        # Luminosity peak at t=0.18 (highlight), shadow from t=0.60 onward
        if t <= 0.18:
            factor = t / 0.18
        elif t <= 0.55:
            factor = 1.0 - (t - 0.18) / 0.37
        else:
            factor = -((t - 0.55) / 0.45) * 0.30

        if factor >= 0:
            rr = min(255, int(r + (255 - r) * factor * highlight))
            gg = min(255, int(g + (255 - g) * factor * highlight))
            bb = min(255, int(b + (255 - b) * factor * highlight))
        else:
            rr = max(0, int(r + r * factor))
            gg = max(0, int(g + g * factor))
            bb = max(0, int(b + b * factor))

        draw.line((x1 + i, y1, x1 + i, y2), fill=(rr, gg, bb, 255), width=1)


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

    # ── Cylinder zone ─────────────────────────────────────────────────────
    drawing_box = (_s(34), _s(108), _s(178), h - _s(110))
    info_box    = (_s(190), _s(108), w - _s(28), h - _s(110))

    # White background for cylinder zone
    draw.rounded_rectangle(drawing_box, radius=_s(16), fill="#FFFFFF", outline="#E5E7EB", width=_s(1))

    left, top_b, right, bottom_b = drawing_box
    cx = left + (right - left) // 2
    cyl_w = _s(52)
    cyl_x1 = cx - cyl_w // 2
    cyl_x2 = cx + cyl_w // 2
    hole_top    = top_b + _s(28)
    hole_bottom = bottom_b - _s(28)
    hole_h = hole_bottom - hole_top

    total = max(profile.altura_banco + profile.subperfuracao, 0.01)
    stem  = max(min(profile.stemming, profile.altura_banco), 0.0)
    sub   = max(profile.subperfuracao, 0.0)
    bb_v  = max(profile.blastbag, 0.0)
    ad_v  = max(profile.air_deck, 0.0)
    charge = max(profile.altura_banco - stem - bb_v - ad_v, 0.0)

    parts = [
        (stem,   "stemming", "#C8CDD5"),
        (bb_v,   "blastbag", "#1F2937"),
        (ad_v,   "airdeck",  "#FFFFFF"),
        (charge, "column",   accent),
        (sub,    "subdrill", "#4B5563"),
    ]

    y_cur = hole_top
    label_x = cyl_x2 + _s(8)
    label_font = _font(_s(10), bold=True)

    for seg_val, seg_key, seg_color in parts:
        if seg_val <= 0:
            continue
        seg_h = int(hole_h * (seg_val / total))
        y2 = hole_bottom if seg_key == "subdrill" else y_cur + seg_h

        if seg_key == "airdeck":
            draw.rectangle((cyl_x1, y_cur, cyl_x2, y2), fill="#FFFFFF")
            for yy in range(int(y_cur) + _s(3), int(y2), _s(6)):
                draw.line((cyl_x1 + _s(3), yy, cyl_x2 - _s(3), yy), fill=accent, width=_s(1))
        elif seg_key == "blastbag":
            _draw_gradient_segment(draw, cyl_x1 + _s(2), y_cur, cyl_x2 - _s(2), y2, seg_color, highlight=0.20)
        else:
            _draw_gradient_segment(draw, cyl_x1, y_cur, cyl_x2, y2, seg_color, highlight=0.40)

        # Lateral label with dashed line
        mid_y = int((y_cur + y2) // 2)
        dash_x = label_x + _s(4)
        for dx in range(0, _s(10), _s(4)):
            draw.line((dash_x + dx, mid_y, dash_x + dx + _s(2), mid_y), fill=theme.muted, width=_s(1))
        draw.text((label_x + _s(16), mid_y - _s(7)), f"{seg_val:.2f}m".replace(".", ","),
                  font=label_font, fill=theme.muted)

        y_cur = y2

    # Cylinder outer contour
    draw.rounded_rectangle((cyl_x1, hole_top, cyl_x2, hole_bottom),
                            radius=_s(20), outline=theme.title, width=_s(2))
    # Top ellipse (bore mouth)
    draw.ellipse((cyl_x1, hole_top - _s(7), cyl_x2, hole_top + _s(9)),
                 fill="#E9EEF4", outline=theme.title, width=_s(2))
    # Bottom ellipse (depth)
    draw.ellipse((cyl_x1, hole_bottom - _s(9), cyl_x2, hole_bottom + _s(7)),
                 fill="#374151", outline=theme.title, width=_s(2))
    # Left highlight (reflection)
    draw.line((cyl_x1 + _s(5), hole_top + _s(14), cyl_x1 + _s(5), hole_bottom - _s(14)),
              fill=(255, 255, 255, 80), width=_s(2))

    # Bank label
    draw.text((left + _s(6), bottom_b - _s(20)),
              f"BANCO {_fmt(profile.altura_banco)} M",
              font=_font(_s(10), bold=True), fill=theme.muted)

    draw.rounded_rectangle(info_box, radius=_s(18), fill="#ffffff", outline=theme.panel_border, width=_s(1))

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
