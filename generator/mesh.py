from __future__ import annotations

import csv
import io
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps
from src.config import get_layout_config


_LAYOUT = get_layout_config()
SCALE = max(1, int(_LAYOUT.get("panel_scale", _LAYOUT.get("scale", 1))))


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
    w, h = size

    if mesh_input.uploaded_mesh:
        img = Image.new("RGBA", size, "#FFFFFF")
        draw = ImageDraw.Draw(img)
        draw.rounded_rectangle((_s(12), _s(12), w - _s(12), h - _s(12)),
                                radius=_s(22), fill="#FFFFFF", outline="#E5E7EB", width=_s(1))
        draw.text((_s(28), _s(26)), "MALHA DE PERFURAÇÃO",
                  font=_font(_s(20), bold=True), fill=theme.title)
        draw.rectangle((_s(28), _s(64), _s(80), _s(68)), fill=theme.accent_red)
        draw.rounded_rectangle((_s(28), _s(82), _s(170), _s(110)), radius=_s(10), fill="#F8FAFC", outline="#E5E7EB", width=_s(1))
        draw.text((_s(40), _s(88)), "ARQUIVO ANEXADO", font=_font(_s(10), bold=True), fill=theme.muted)
        try:
            mesh = Image.open(io.BytesIO(mesh_input.uploaded_mesh)).convert("RGBA")
            frame = (_s(32), _s(128), w - _s(32), h - _s(122))
            draw.rounded_rectangle(frame, radius=_s(20), fill="#F9FAFB", outline="#E5E7EB", width=_s(1))
            mesh = ImageOps.contain(mesh, (frame[2] - frame[0] - _s(20), frame[3] - frame[1] - _s(20)))
            x = frame[0] + ((frame[2] - frame[0]) - mesh.size[0]) // 2
            y = frame[1] + ((frame[3] - frame[1]) - mesh.size[1]) // 2
            img.alpha_composite(mesh, (x, y))
        except Exception:
            draw.rounded_rectangle((_s(40), _s(140), w - _s(40), h - _s(150)), radius=_s(18), fill="#F8FAFC", outline="#E5E7EB", width=_s(1))
            draw.text((_s(56), _s(170)), "Pré-visualização indisponível", font=_font(_s(14), bold=True), fill=theme.text)
            draw.text((_s(56), _s(198)), "A imagem será exportada normalmente.", font=_font(_s(12)), fill=theme.muted)
        draw.text((_s(28), h - _s(80)), "Imagem anexada pelo usuário.",
                  font=_font(_s(13), bold=True), fill=theme.muted)
        return img

    img = Image.new("RGBA", size, "#FFFFFF")
    draw = ImageDraw.Draw(img)

    # Card base
    draw.rounded_rectangle((_s(12), _s(12), w - _s(12), h - _s(12)),
                            radius=_s(22), fill="#FFFFFF", outline="#E5E7EB", width=_s(1))
    draw.rectangle((_s(16), _s(16), w - _s(16), _s(22)), fill=theme.accent_red)

    # Title
    draw.text((_s(28), _s(26)), "MALHA DE PERFURAÇÃO",
              font=_font(_s(20), bold=True), fill=theme.title)
    draw.rectangle((_s(28), _s(64), _s(80), _s(67)), fill=theme.accent_red)
    draw.text((_s(28), _s(78)), mesh_input.polygon_name,
              font=_font(_s(14)), fill=theme.muted)

    # Upload area with dashed border
    upload_box = (_s(32), _s(104), w - _s(32), h - _s(130))
    ub_x1, ub_y1, ub_x2, ub_y2 = upload_box
    draw.rounded_rectangle(upload_box, radius=_s(20), fill="#F8FAFC", outline="#E5E7EB", width=_s(1))
    dash_len, gap_len = _s(12), _s(6)
    for side in ["top", "bottom", "left", "right"]:
        if side == "top":
            x, y, dx, dy = ub_x1, ub_y1, 1, 0
            total = ub_x2 - ub_x1
        elif side == "bottom":
            x, y, dx, dy = ub_x1, ub_y2, 1, 0
            total = ub_x2 - ub_x1
        elif side == "left":
            x, y, dx, dy = ub_x1, ub_y1, 0, 1
            total = ub_y2 - ub_y1
        else:
            x, y, dx, dy = ub_x2, ub_y1, 0, 1
            total = ub_y2 - ub_y1
        pos = 0
        drawing_dash = True
        while pos < total:
            seg = dash_len if drawing_dash else gap_len
            end = min(pos + seg, total)
            if drawing_dash:
                if dx:
                    draw.line((x + pos, y, x + end, y), fill="#D1D5DB", width=_s(2))
                else:
                    draw.line((x, y + pos, x, y + end), fill="#D1D5DB", width=_s(2))
            pos = end
            drawing_dash = not drawing_dash

    # Technical grid to make the placeholder feel intentional rather than empty.
    grid_step = _s(30)
    for gx in range(ub_x1 + _s(18), ub_x2 - _s(12), grid_step):
        draw.line((gx, ub_y1 + _s(18), gx, ub_y2 - _s(18)), fill="#E9EEF4", width=_s(1))
    for gy in range(ub_y1 + _s(18), ub_y2 - _s(12), grid_step):
        draw.line((ub_x1 + _s(18), gy, ub_x2 - _s(18), gy), fill="#E9EEF4", width=_s(1))

    # Upload icon (circle + up arrow)
    ic_cx = (ub_x1 + ub_x2) // 2
    ic_cy = ub_y1 + _s(110)
    draw.ellipse((ic_cx - _s(36), ic_cy - _s(36), ic_cx + _s(36), ic_cy + _s(36)),
                 outline="#D1D5DB", width=_s(2), fill="#F9FAFB")
    draw.line((ic_cx, ic_cy + _s(16), ic_cx, ic_cy - _s(16)), fill="#9CA3AF", width=_s(2))
    draw.polygon([(ic_cx, ic_cy - _s(16)), (ic_cx - _s(8), ic_cy - _s(4)), (ic_cx + _s(8), ic_cy - _s(4))],
                 fill="#9CA3AF")

    # Instructions
    inst_font = _font(_s(14), bold=True)
    inst = "Anexe a imagem da malha"
    inst_w = int(draw.textlength(inst, font=inst_font))
    draw.text((ic_cx - inst_w // 2, ic_cy + _s(50)), inst, font=inst_font, fill=theme.text)
    sub_font = _font(_s(12))
    sub_text = "Se não houver anexo, o painel fica apenas como referência."
    sub_w = int(draw.textlength(sub_text, font=sub_font))
    draw.text((ic_cx - sub_w // 2, ic_cy + _s(76)), sub_text, font=sub_font, fill=theme.muted)

    # Small footer chip for a more polished placeholder state.
    chip_text = "MODO REFERÊNCIA"
    chip_font = _font(_s(11), bold=True)
    chip_w = int(draw.textlength(chip_text, font=chip_font)) + _s(24)
    draw.rounded_rectangle((ic_cx - chip_w // 2, h - _s(94), ic_cx + chip_w // 2, h - _s(62)), radius=_s(12), fill="#FFFFFF", outline="#E5E7EB", width=_s(1))
    draw.text((ic_cx - chip_w // 2 + _s(12), h - _s(87)), chip_text, font=chip_font, fill=theme.muted)

    # Legend
    legend_y = h - _s(106)
    entries = [("Produção", theme.accent_blue), ("Amortecimento", theme.accent_orange), ("Contorno", theme.accent_red)]
    lx = _s(36)
    lf = _font(_s(13), bold=True)
    for lbl, lcolor in entries:
        draw.rounded_rectangle((lx, legend_y + _s(2), lx + _s(14), legend_y + _s(16)), radius=_s(4), fill=lcolor)
        draw.text((lx + _s(20), legend_y), lbl, font=lf, fill=theme.text)
        lx += int(draw.textlength(lbl, font=lf)) + _s(32)

    draw.text((_s(36), h - _s(56)),
              "Somente imagem anexada, sem geração sintética da malha.",
              font=_font(_s(12)), fill=theme.muted)
    return img
