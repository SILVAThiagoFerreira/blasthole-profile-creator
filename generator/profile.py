from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from src.config import get_layout_config


_LAYOUT = get_layout_config()
SCALE = int(_LAYOUT.get("panel_scale", _LAYOUT.get("scale", 1)))


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
    air_decks: list[dict] | None = None
    blastbags: list[dict] | None = None
    segments: list[dict] | None = None


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


def _segment_label(seg_key: str, labels: dict[str, str], compact: bool = False) -> str:
    if compact:
        return {
            "stemming": "Tamp.",
            "column": "Carga",
            "blastbag": "BB",
            "airdeck": "Deck",
            "subdrill": "Sub.",
        }.get(seg_key, seg_key)
    return {
        "stemming": labels.get("stemming", "Tampão"),
        "column": labels.get("column", "Carga"),
        "blastbag": labels.get("blastbag", "Blastbag"),
        "airdeck": labels.get("airdeck", "Deck de ar"),
        "subdrill": labels.get("subdrill", "Subperfuração"),
    }.get(seg_key, seg_key)


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


def _draw_metric_row(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    label: str,
    value: str,
    color: str,
    theme,
    kind: str,
    alternate: bool = False,
) -> None:
    x1, y1, x2, y2 = box
    if alternate:
        draw.rectangle((x1, y1, x2, y2 - 1), fill="#F9FAFB")

    icon_x = x1 + _s(10)
    icon_y = y1 + _s(7)
    icon_size = _s(24)
    ic = icon_x + icon_size // 2
    iy = icon_y + icon_size // 2

    if kind == "diameter":
        draw.ellipse((icon_x, icon_y, icon_x + icon_size, icon_y + icon_size), outline=color, width=_s(2))
        draw.line((icon_x + _s(5), iy, icon_x + icon_size - _s(5), iy), fill=color, width=_s(2))
        draw.line((ic, icon_y + _s(5), ic, icon_y + icon_size - _s(5)), fill=color, width=_s(2))
    elif kind == "height":
        draw.line((ic, icon_y, ic, icon_y + icon_size), fill=color, width=_s(2))
        draw.polygon([(ic, icon_y), (ic - _s(5), icon_y + _s(8)), (ic + _s(5), icon_y + _s(8))], fill=color)
        draw.polygon([(ic, icon_y + icon_size), (ic - _s(5), icon_y + icon_size - _s(8)), (ic + _s(5), icon_y + icon_size - _s(8))], fill=color)
    elif kind == "subdrill":
        draw.line((ic, icon_y, ic, icon_y + icon_size), fill=color, width=_s(2))
        draw.polygon([(ic, icon_y + icon_size), (ic - _s(5), icon_y + icon_size - _s(8)), (ic + _s(5), icon_y + icon_size - _s(8))], fill=color)
    elif kind == "stemming":
        draw.rectangle((icon_x + _s(3), icon_y + _s(5), icon_x + icon_size - _s(3), icon_y + icon_size - _s(5)), outline=color, width=_s(2))
    elif kind == "blastbag":
        draw.rounded_rectangle((icon_x + _s(3), icon_y + _s(7), icon_x + icon_size - _s(3), icon_y + icon_size - _s(7)), radius=_s(5), fill="#2F343B", outline=color, width=_s(1))
    elif kind == "airdeck":
        draw.rectangle((icon_x + _s(3), icon_y + _s(6), icon_x + icon_size - _s(3), icon_y + icon_size - _s(6)), outline=color, width=_s(2))
        for yy in range(icon_y + _s(9), icon_y + icon_size - _s(6), _s(4)):
            draw.line((icon_x + _s(6), yy, icon_x + icon_size - _s(6), yy), fill=color, width=_s(1))
    elif kind == "inclination":
        draw.line((icon_x + _s(3), icon_y + icon_size - _s(3), icon_x + icon_size - _s(3), icon_y + icon_size - _s(3)), fill=color, width=_s(2))
        draw.line((icon_x + _s(3), icon_y + icon_size - _s(3), icon_x + icon_size - _s(5), icon_y + _s(5)), fill=color, width=_s(2))
    elif kind == "azimuth":
        draw.ellipse((icon_x + _s(2), icon_y + _s(2), icon_x + icon_size - _s(2), icon_y + icon_size - _s(2)), outline=color, width=_s(2))
        draw.line((ic, iy, ic + _s(7), iy - _s(6)), fill=color, width=_s(2))
        draw.line((ic, iy, ic - _s(4), iy + _s(7)), fill=color, width=_s(2))
    elif kind == "density":
        # Drop/teardrop icon for density
        draw.ellipse((ic - _s(6), iy, ic + _s(6), iy + _s(10)), fill=color)
        draw.polygon([(ic, icon_y + _s(2)), (ic - _s(6), iy + _s(4)), (ic + _s(6), iy + _s(4))], fill=color)
    else:
        draw.rectangle((icon_x + _s(3), icon_y + _s(5), icon_x + icon_size - _s(3), icon_y + icon_size - _s(5)), outline=color, width=_s(2))

    draw.text((x1 + _s(44), y1 + _s(7)), label.upper(), font=_font(_s(10), bold=True), fill=theme.muted)
    val_font = _font(_s(12), bold=True)
    val_w = int(draw.textlength(value, font=val_font))
    draw.text((x2 - _s(14) - val_w, y1 + _s(7)), value, font=val_font, fill=theme.title)
    draw.line((x1 + _s(6), y2 - 1, x2 - _s(6), y2 - 1), fill="#E5E7EB", width=_s(1))


def render_profile_panel(profile: ProfileInput, theme, labels: dict[str, str], size: tuple[int, int] = (540, 760), compact: bool = False) -> Image.Image:
    size = (_s(size[0]), _s(size[1]))
    img = Image.new("RGBA", size, theme.panel_alt)
    draw = ImageDraw.Draw(img)
    w, h = size
    accent, accent_soft = _kind_palette(profile.kind, theme)
    kind_label = _kind_name(profile.kind)

    if compact:
        draw.rounded_rectangle((_s(12), _s(12), w - _s(12), h - _s(12)), radius=_s(22), fill="#FFFFFF")
        draw.rounded_rectangle((_s(12), _s(12), w - _s(12), h - _s(12)), radius=_s(22), outline="#E5E7EB", width=_s(1))
        draw.rectangle((_s(16), _s(16), w - _s(16), _s(22)), fill=accent_soft)

        badge_letter = _extract_badge_letter(profile.name)
        badge_r = _s(20)
        badge_cx, badge_cy = _s(44), _s(46)
        draw.ellipse((badge_cx - badge_r, badge_cy - badge_r, badge_cx + badge_r, badge_cy + badge_r), fill=accent)
        bl_font = _font(_s(18), bold=True)
        bl_w = int(draw.textlength(badge_letter, font=bl_font))
        draw.text((badge_cx - bl_w // 2, badge_cy - _s(12)), badge_letter, font=bl_font, fill="#FFFFFF")

        name_font = _font(_s(17), bold=True)
        draw.text((_s(78), _s(28)), _short(profile.name, 18).upper(), font=name_font, fill=accent)
        draw.text((_s(78), _s(54)), f"{kind_label.upper()}  •  {int(profile.diametro_furo)} MM", font=_font(_s(10), bold=True), fill=theme.muted)
        tag_font = _font(_s(9), bold=True)
        tag_w = int(draw.textlength(kind_label.upper(), font=tag_font))
        draw.rounded_rectangle((_s(320) - tag_w // 2, _s(22), _s(320) + tag_w // 2 + _s(14), _s(44)), radius=_s(10), fill=accent_soft)
        draw.text((_s(320) - tag_w // 2 + _s(7), _s(28)), kind_label.upper(), font=tag_font, fill=accent)

        draw.rectangle((_s(18), _s(80), w - _s(18), _s(84)), fill=accent)

        drawing_box = (_s(34), _s(96), _s(166), h - _s(90))
        info_box = (_s(178), _s(96), w - _s(24), h - _s(90))
        draw.rounded_rectangle(drawing_box, radius=_s(16), fill="#FFFFFF", outline="#E5E7EB", width=_s(1))

        left, top_b, right, bottom_b = drawing_box
        cx = left + (right - left) // 2
        cyl_w = _s(46)
        cyl_x1 = cx - cyl_w // 2
        cyl_x2 = cx + cyl_w // 2
        hole_top = top_b + _s(20)
        hole_bottom = bottom_b - _s(20)
        hole_h = hole_bottom - hole_top

        total = max(profile.altura_banco + profile.subperfuracao, 0.01)
        stem = max(min(profile.stemming, profile.altura_banco), 0.0)
        sub = max(profile.subperfuracao, 0.0)
        bb_v = max(profile.blastbag, 0.0)
        ad_v = max(profile.air_deck, 0.0)
        charge = max(profile.altura_banco - stem - bb_v - ad_v, 0.0)

        parts = [
            (stem, "stemming", "#C8CDD5"),
            (bb_v, "blastbag", "#1F2937"),
            (ad_v, "airdeck", None),
            (charge, "column", accent),
            (sub, "subdrill", "#4B5563"),
        ]

        y_cur = hole_top
        for seg_val, seg_key, seg_color in parts:
            if seg_val <= 0:
                continue
            seg_h = int(hole_h * (seg_val / total))
            y2 = hole_bottom if seg_key == "subdrill" else y_cur + seg_h
            if seg_key == "airdeck":
                draw.rectangle((cyl_x1, y_cur, cyl_x2, y2), fill="#FFFFFF")
                for yy in range(int(y_cur) + _s(2), int(y2), _s(5)):
                    draw.line((cyl_x1 + _s(2), yy, cyl_x2 - _s(2), yy), fill=accent, width=_s(1))
            elif seg_key == "blastbag":
                _draw_gradient_segment(draw, cyl_x1 + _s(1), y_cur, cyl_x2 - _s(1), y2, seg_color, highlight=0.18)
            else:
                _draw_gradient_segment(draw, cyl_x1, y_cur, cyl_x2, y2, seg_color, highlight=0.32)

            mid_y = int((y_cur + y2) // 2)
            if y2 - y_cur >= _s(10):
                draw.line((cyl_x2 + _s(3), mid_y, cyl_x2 + _s(9), mid_y), fill=theme.muted, width=_s(1))
                label = f"{_segment_label(seg_key, labels, compact=True)} {seg_val:.2f}m".replace(".", ",")
                draw.text((cyl_x2 + _s(11), mid_y - _s(5)), label, font=_font(_s(7), bold=True), fill=theme.muted)
            y_cur = y2

        draw.rounded_rectangle((cyl_x1, hole_top, cyl_x2, hole_bottom), radius=_s(16), outline=theme.title, width=_s(2))
        draw.ellipse((cyl_x1, hole_top - _s(6), cyl_x2, hole_top + _s(8)), fill="#E9EEF4", outline=theme.title, width=_s(2))
        draw.ellipse((cyl_x1, hole_bottom - _s(8), cyl_x2, hole_bottom + _s(6)), fill="#374151", outline=theme.title, width=_s(2))

        draw.text((left + _s(6), bottom_b - _s(18)), f"BANCO {_fmt(profile.altura_banco)} M", font=_font(_s(9), bold=True), fill=theme.muted)

        draw.rounded_rectangle(info_box, radius=_s(16), fill="#FFFFFF", outline="#E5E7EB", width=_s(1))
        ix1, iy1, ix2, iy2 = info_box
        draw.rectangle((ix1, iy1, ix2, iy1 + _s(5)), fill=accent)
        draw.text((ix1 + _s(12), iy1 + _s(10)), "PARÂMETROS", font=_font(_s(13), bold=True), fill=theme.title)

        rows = [
            ("Diâmetro", f"{int(profile.diametro_furo)} mm", "diameter"),
            ("Altura", f"{_fmt(profile.altura_banco)} m", "height"),
            (labels.get("stemming", "Tampão"), f"{_fmt(profile.stemming)} m", "stemming"),
            (labels.get("column", "Carga"), f"{_fmt(charge)} m", "column"),
            (labels.get("subdrill", "Subperf."), f"{_fmt(profile.subperfuracao)} m", "subdrill"),
        ]

        y_row = iy1 + _s(34)
        metric_h = _s(28)
        for idx, (label_r, value_r, icon_kind) in enumerate(rows):
            _draw_metric_row(draw, (ix1 + _s(8), y_row, ix2 - _s(8), y_row + metric_h), label_r, value_r, accent, theme, icon_kind, alternate=(idx % 2 == 1))
            y_row += metric_h

        return img

    # ── Card background ───────────────────────────────────────────────────
    draw.rounded_rectangle((_s(12), _s(12), w - _s(12), h - _s(12)),
                            radius=_s(22), fill="#FFFFFF")
    draw.rounded_rectangle((_s(12), _s(12), w - _s(12), h - _s(12)),
                            radius=_s(22), outline="#E5E7EB", width=_s(1))
    draw.rectangle((_s(16), _s(16), w - _s(16), _s(22)), fill=accent_soft)

    # ── Card header ───────────────────────────────────────────────────────
    badge_letter = _extract_badge_letter(profile.name)
    badge_r = _s(22)
    badge_cx, badge_cy = _s(46), _s(50)
    draw.ellipse((badge_cx - badge_r, badge_cy - badge_r,
                  badge_cx + badge_r, badge_cy + badge_r), fill=accent)
    bl_font = _font(_s(20), bold=True)
    bl_w = int(draw.textlength(badge_letter, font=bl_font))
    draw.text((badge_cx - bl_w // 2, badge_cy - _s(13)),
              badge_letter, font=bl_font, fill="#FFFFFF")

    name_font = _font(_s(18), bold=True)
    draw.text((_s(82), _s(30)), _short(profile.name, 22).upper(),
              font=name_font, fill=accent)
    sub_text = f"{kind_label.upper()}  •  {int(profile.diametro_furo)} MM"
    draw.text((_s(82), _s(58)), sub_text,
              font=_font(_s(11), bold=True), fill=theme.muted)
    tag_font = _font(_s(10), bold=True)
    tag_w = int(draw.textlength(kind_label.upper(), font=tag_font))
    draw.rounded_rectangle((_s(380) - tag_w // 2, _s(24), _s(380) + tag_w // 2 + _s(16), _s(48)), radius=_s(10), fill=accent_soft)
    draw.text((_s(380) - tag_w // 2 + _s(8), _s(30)), kind_label.upper(), font=tag_font, fill=accent)

    # Accent separator line
    draw.rectangle((_s(18), _s(88), w - _s(18), _s(92)), fill=accent)

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

    # Soft blueprint-style grid to enrich the empty space around the cylinder.
    grid_draw = ImageDraw.Draw(img, "RGBA")
    for gx in range(left + _s(16), right - _s(12), _s(18)):
        grid_draw.line((gx, top_b + _s(14), gx, bottom_b - _s(14)), fill=(29, 111, 184, 10), width=_s(1))
    for gy in range(top_b + _s(18), bottom_b - _s(14), _s(18)):
        grid_draw.line((left + _s(14), gy, right - _s(14), gy), fill=(29, 111, 184, 8), width=_s(1))

    total = max(profile.altura_banco + profile.subperfuracao, 0.01)
    stem  = max(min(profile.stemming, profile.altura_banco), 0.0)
    sub   = max(profile.subperfuracao, 0.0)
    bb_v  = max(profile.blastbag, 0.0)
    ad_v  = max(profile.air_deck, 0.0)
    charge = max(profile.altura_banco - stem - bb_v - ad_v, 0.0)

    parts = [
        (stem,   "stemming", "#C8CDD5"),
        (bb_v,   "blastbag", "#1F2937"),
        (ad_v,   "airdeck",  None),       # color unused — rendered as hatch pattern
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
        # Snap subdrill (always last) to hole_bottom to absorb accumulated rounding error.
        y2 = hole_bottom if seg_key == "subdrill" else y_cur + seg_h

        if seg_key == "airdeck":
            draw.rectangle((cyl_x1, y_cur, cyl_x2, y2), fill="#FFFFFF")
            for yy in range(int(y_cur) + _s(3), int(y2), _s(6)):
                draw.line((cyl_x1 + _s(3), yy, cyl_x2 - _s(3), yy), fill=accent, width=_s(1))
        elif seg_key == "blastbag":
            _draw_gradient_segment(draw, cyl_x1 + _s(2), y_cur, cyl_x2 - _s(2), y2, seg_color, highlight=0.20)
        else:
            _draw_gradient_segment(draw, cyl_x1, y_cur, cyl_x2, y2, seg_color, highlight=0.40)

        mid_y = int((y_cur + y2) // 2)
        if y2 - y_cur >= _s(14):
            dash_x = label_x + _s(4)
            for dx in range(0, _s(10), _s(4)):
                draw.line((dash_x + dx, mid_y, dash_x + dx + _s(2), mid_y), fill=theme.muted, width=_s(1))
            label = f"{_segment_label(seg_key, labels)} {seg_val:.2f}m".replace(".", ",")
            draw.text((label_x + _s(16), mid_y - _s(7)), label, font=label_font, fill=theme.muted)

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

    # ── Parameters zone ───────────────────────────────────────────────────
    draw.rounded_rectangle(info_box, radius=_s(16), fill="#FFFFFF", outline="#E5E7EB", width=_s(1))
    ix1, iy1, ix2, iy2 = info_box
    draw.rectangle((ix1, iy1, ix2, iy1 + _s(6)), fill=accent)

    draw.text((ix1 + _s(16), iy1 + _s(14)), "PARÂMETROS TÉCNICOS",
              font=_font(_s(15), bold=True), fill=theme.title)

    rows = [
        ("Diâmetro do furo",                     f"{int(profile.diametro_furo)} mm",        "diameter"),
        ("Altura do banco",                       f"{_fmt(profile.altura_banco)} m",          "height"),
        (labels.get("subdrill", "Subperfuração"), f"{_fmt(profile.subperfuracao)} m",         "subdrill"),
        (labels.get("stemming", "Tampão"),        f"{_fmt(profile.stemming)} m",              "stemming"),
        (labels.get("blastbag", "Blastbag"),      f"{_fmt(profile.blastbag)} m",              "blastbag"),
        (labels.get("airdeck", "Deck de ar"),     f"{_fmt(profile.air_deck)} m",              "airdeck"),
        ("Inclinação",                            f"{_fmt(profile.inclinacao, 1)}°",          "inclination"),
        ("Azimute",                               f"{_fmt(profile.azimute, 1)}°",             "azimuth"),
        ("Densidade",                             f"{_fmt(profile.densidade, 2)} g/cm³",      "density"),
    ]

    y_row = iy1 + _s(44)
    metric_h = _s(40)
    for idx, (label_r, value_r, icon_kind) in enumerate(rows):
        _draw_metric_row(
            draw,
            (ix1 + _s(8), y_row, ix2 - _s(8), y_row + metric_h),
            label_r, value_r, accent, theme, icon_kind,
            alternate=(idx % 2 == 1),
        )
        y_row += metric_h

    # ── Summary chips ─────────────────────────────────────────────────────
    chips_y = iy2 - _s(64)
    chips = [
        (labels.get("stemming", "Tampão"), f"{_fmt(stem)} m", "#F3F4F6"),
        (labels.get("column", "Carga"),    f"{_fmt(charge)} m", "#EBF2FB"),
    ]
    if sub > 0:
        chips.append((labels.get("subdrill", "Subperf."), f"{_fmt(sub)} m", "#F3F4F6"))
    if bb_v > 0:
        chips.append((labels.get("blastbag", "Blastbag"), f"{_fmt(bb_v)} m", "#F3F4F6"))

    chip_x = ix1 + _s(12)
    chip_font = _font(_s(11), bold=True)
    for chip_label, chip_val, chip_fill in chips:
        text = f"{chip_label}: {chip_val}"
        tw = int(draw.textlength(text, font=chip_font))
        chip_w = tw + _s(20)
        if chip_x + chip_w > ix2 - _s(12):
            break
        draw.rounded_rectangle((chip_x, chips_y, chip_x + chip_w, chips_y + _s(28)),
                                radius=_s(10), fill=chip_fill, outline="#E5E7EB", width=_s(1))
        draw.text((chip_x + _s(10), chips_y + _s(6)), text, font=chip_font, fill=theme.title)
        chip_x += chip_w + _s(8)

    return img
