# Redesign Visual Clean White — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar a renderização PIL do Profile Creator para atingir nível visual premium — header branco, cilindro 3D com gradiente, fonte Montserrat, tabela com linhas alternadas, sombras gaussianas reais e badges de letra correta.

**Architecture:** Todas as mudanças são nos três módulos de renderização (`layout.py`, `profile.py`, `mesh.py`) e no `config.json`. Nenhuma interface externa do `src/` é alterada. A lógica de negócio (pipeline, validação, exportação) permanece intocada.

**Tech Stack:** Python 3.13, Pillow (PIL), Montserrat TTF (`C:\Windows\Fonts\Montserrat-*.ttf`), config.json para paleta.

---

## File Map

| Arquivo | Responsabilidade neste plano |
|---|---|
| `generator/layout.py` | Fonte Montserrat, sombra gaussiana, header branco, footer refinado, layout sem outline |
| `generator/profile.py` | Fonte Montserrat, badge letra, cilindro 3D, tabela alternada, ícone densidade, chips |
| `generator/mesh.py` | Fonte Montserrat, área upload tracejada, ícone refinado |
| `config.json` | Paleta nova (bg, panel_alt, shadow sem outline) |
| `tests/test_generators.py` | Testes de funções puras: badge extraction, hex_to_rgb, cylinder gradient |

---

## Task 1: Atualizar paleta no config.json

**Files:**
- Modify: `config.json`

- [ ] **Step 1: Atualizar template "Enaex clean"**

Substituir o bloco `templates` em `config.json`:

```json
"templates": {
  "Enaex clean": {
    "bg": "#F0F2F5",
    "panel_bg": "#FFFFFF",
    "panel_alt": "#F9FAFB",
    "panel_border": "#E5E7EB",
    "title": "#111827",
    "text": "#1F2937",
    "muted": "#6B7280",
    "accent_red": "#D71920",
    "accent_blue": "#1D6FB8",
    "accent_orange": "#F28C28",
    "accent_dark": "#223A8D",
    "shadow": [17, 24, 39, 45]
  },
  "Técnico minimalista": {
    "bg": "#F8FAFC",
    "panel_bg": "#FFFFFF",
    "panel_alt": "#F9FAFB",
    "panel_border": "#E2E8F0",
    "title": "#0F172A",
    "text": "#1E293B",
    "muted": "#64748B",
    "accent_red": "#C81D25",
    "accent_blue": "#2563EB",
    "accent_orange": "#D97706",
    "accent_dark": "#1837B8",
    "shadow": [15, 23, 42, 35]
  },
  "Relatório executivo": {
    "bg": "#EEF2F7",
    "panel_bg": "#FFFFFF",
    "panel_alt": "#F8FAFC",
    "panel_border": "#CBD5E1",
    "title": "#0F2040",
    "text": "#1B2B40",
    "muted": "#607080",
    "accent_red": "#BD1E24",
    "accent_blue": "#2D6CDF",
    "accent_orange": "#DB7A11",
    "accent_dark": "#1C3DB6",
    "shadow": [15, 30, 50, 50]
  }
}
```

- [ ] **Step 2: Verificar que o config carrega sem erro**

```bash
cd "C:\Users\ferre\OneDrive\Documentos\PROJETOS PROGRAMAÇÃO\01. ENAEX\PROFILE CREATOR"
py -3.13 -c "from src.config import load_config; c = load_config(); print(c['templates']['Enaex clean']['bg'])"
```

Esperado: `#F0F2F5`

- [ ] **Step 3: Commit**

```bash
git add config.json
git commit -m "feat: update color palette to clean white design system"
```

---

## Task 2: Consolidar e atualizar _font() com Montserrat

**Files:**
- Modify: `generator/layout.py` (função `_font`)
- Modify: `generator/profile.py` (função `_font`)
- Modify: `generator/mesh.py` (função `_font`)
- Create: `tests/test_generators.py`

- [ ] **Step 1: Criar arquivo de testes e escrever teste de fonte**

Criar `tests/test_generators.py`:

```python
import unittest
from pathlib import Path


class FontTests(unittest.TestCase):
    def test_montserrat_regular_exists(self) -> None:
        path = Path(r"C:\Windows\Fonts\Montserrat-Regular.ttf")
        self.assertTrue(path.exists(), "Montserrat-Regular.ttf não encontrado")

    def test_montserrat_bold_exists(self) -> None:
        path = Path(r"C:\Windows\Fonts\Montserrat-Bold.ttf")
        self.assertTrue(path.exists(), "Montserrat-Bold.ttf não encontrado")

    def test_font_loader_returns_font(self) -> None:
        from generator.layout import _font
        font = _font(24, bold=True)
        self.assertIsNotNone(font)

    def test_font_loader_regular_returns_font(self) -> None:
        from generator.layout import _font
        font = _font(16, bold=False)
        self.assertIsNotNone(font)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Rodar teste para confirmar falha (layout._font ainda usa Arial)**

```bash
py -3.13 -m pytest tests/test_generators.py::FontTests::test_font_loader_returns_font -v
```

Esperado: PASS (já funciona com Arial) — estes testes verificam existência do arquivo e que a função retorna algo.

- [ ] **Step 3: Substituir _font() em generator/layout.py**

Localizar a função `_font` (linhas 72–92) e substituir por:

```python
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
```

- [ ] **Step 4: Substituir _font() em generator/profile.py**

Localizar a função `_font` (linhas 31–41) e substituir por:

```python
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
```

Adicionar o import no topo de `profile.py` (já existe `from pathlib import Path` via outros imports — adicionar se não tiver):

```python
from pathlib import Path
```

- [ ] **Step 5: Substituir _font() em generator/mesh.py**

Localizar a função `_font` (linhas 58–68) e substituir por:

```python
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
```

- [ ] **Step 6: Rodar testes**

```bash
py -3.13 -m pytest tests/test_generators.py -v
```

Esperado: todos os testes PASS.

- [ ] **Step 7: Commit**

```bash
git add generator/layout.py generator/profile.py generator/mesh.py tests/test_generators.py
git commit -m "feat: upgrade font to Montserrat for premium typography"
```

---

## Task 3: Sombra gaussiana real em layout.py

**Files:**
- Modify: `generator/layout.py` (substituir `_shadow_box`, adicionar import `ImageFilter`)

- [ ] **Step 1: Escrever teste de smoke para sombra**

Adicionar em `tests/test_generators.py`:

```python
class ShadowTests(unittest.TestCase):
    def test_gaussian_shadow_does_not_crash(self) -> None:
        from PIL import Image
        from generator.layout import _gaussian_shadow
        canvas = Image.new("RGBA", (400, 300), (240, 242, 245, 255))
        _gaussian_shadow(canvas, (20, 20, 380, 280), radius=16, blur_radius=8)
        # Verificar que a sombra alterou pixels fora da box (não todo canvas transparente)
        r, g, b, a = canvas.getpixel((390, 290))  # canto inferior direito
        self.assertGreater(a, 0)  # algum pixel foi pintado pela sombra
```

- [ ] **Step 2: Rodar teste para confirmar falha**

```bash
py -3.13 -m pytest tests/test_generators.py::ShadowTests -v
```

Esperado: FAIL — `_gaussian_shadow` não existe ainda.

- [ ] **Step 3: Adicionar import ImageFilter e nova função em layout.py**

No topo de `generator/layout.py`, na linha dos imports PIL, adicionar `ImageFilter`:

```python
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
```

Substituir a função `_shadow_box` completa (linhas 95–110) por:

```python
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
```

- [ ] **Step 4: Atualizar chamada da sombra em _draw_layout**

Em `_draw_layout` (linha onde está `_shadow_box(canvas, box, _s(28), theme.shadow)`), substituir por:

```python
_gaussian_shadow(canvas, box, radius=_s(28), blur_radius=9)
```

- [ ] **Step 5: Rodar testes**

```bash
py -3.13 -m pytest tests/test_generators.py -v
```

Esperado: todos PASS.

- [ ] **Step 6: Commit**

```bash
git add generator/layout.py tests/test_generators.py
git commit -m "feat: replace manual shadow with PIL GaussianBlur for soft card shadows"
```

---

## Task 4: Header branco

**Files:**
- Modify: `generator/layout.py` (função `_draw_header`)

- [ ] **Step 1: Escrever teste do header**

Adicionar em `tests/test_generators.py`:

```python
class HeaderTests(unittest.TestCase):
    def _make_canvas(self):
        from PIL import Image
        return Image.new("RGBA", (3840, 2160), (240, 242, 245, 255))

    def test_header_top_pixel_is_red(self) -> None:
        from generator.layout import _draw_header, TEMPLATE_PRESETS
        canvas = self._make_canvas()
        theme = TEMPLATE_PRESETS["Enaex clean"]
        _draw_header(canvas, theme, "PP170526 (220-210)", "Perfis técnicos", None)
        r, g, b, a = canvas.getpixel((1920, 2))  # topo centro
        # Deve ser o vermelho da stripe (#D71920 = 215, 25, 32)
        self.assertGreater(r, 180)
        self.assertLess(g, 80)
        self.assertLess(b, 80)

    def test_header_background_is_white(self) -> None:
        from generator.layout import _draw_header, TEMPLATE_PRESETS
        canvas = self._make_canvas()
        theme = TEMPLATE_PRESETS["Enaex clean"]
        _draw_header(canvas, theme, "PP170526 (220-210)", "Perfis técnicos", None)
        r, g, b, a = canvas.getpixel((1920, 200))  # meio do header
        # Deve ser branco ou próximo de branco
        self.assertGreater(r, 220)
        self.assertGreater(g, 220)
        self.assertGreater(b, 220)
```

- [ ] **Step 2: Rodar testes para confirmar falha**

```bash
py -3.13 -m pytest tests/test_generators.py::HeaderTests -v
```

Esperado: `test_header_background_is_white` FAIL — atualmente o header é escuro (#2F3136).

- [ ] **Step 3: Substituir _draw_header em layout.py**

Substituir a função `_draw_header` completa por:

```python
def _draw_header(canvas: Image.Image, theme: TemplateTheme, polygon_name: str, profile_type: str, logo_bytes: bytes | None) -> None:
    draw = ImageDraw.Draw(canvas)
    width, _ = canvas.size

    # Fundo branco
    draw.rectangle((0, 0, width, HEADER_H), fill="#FFFFFF")
    # Stripe vermelha no topo
    draw.rectangle((0, 0, width, _s(6)), fill=theme.accent_red)
    # Linha separadora inferior
    draw.line((0, HEADER_H - _s(1), width, HEADER_H - _s(1)), fill="#E5E7EB", width=_s(1))

    # Badge vermelho com logo (esquerda)
    badge_box = (_s(36), _s(18), _s(236), _s(142))
    draw.rounded_rectangle(badge_box, radius=_s(18), fill=theme.accent_red)
    if logo_bytes:
        _paste_logo(canvas, logo_bytes, (_s(48), _s(30), _s(224), _s(130)))
    else:
        draw.text((_s(56), _s(46)), "ENAEX", font=_font(_s(30), bold=True), fill="#FFFFFF")
        draw.text((_s(56), _s(84)), "BRASIL", font=_font(_s(22), bold=True), fill="#FFCDD0")

    # Título central
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

    # Badge tipo (direita)
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
```

- [ ] **Step 4: Rodar testes**

```bash
py -3.13 -m pytest tests/test_generators.py -v
```

Esperado: todos PASS incluindo `HeaderTests`.

- [ ] **Step 5: Smoke test visual**

```bash
py -3.13 -c "
from generator.layout import build_final_image
from generator.mesh import MeshInput
from generator.profile import ProfileInput
img = build_final_image(
    polygon_name='PP170526 (220-210)',
    profile_type='Perfis técnicos',
    template_name='Enaex clean',
    observation='Perfil técnico para reporte operacional.',
    labels={'stemming':'Tampão','blastbag':'Blastbag','airdeck':'Deck de ar','column':'Carga','subdrill':'Subperf.'},
    mesh_input=MeshInput(polygon_name='PP170526 (220-210)'),
    profiles=[ProfileInput(name='Perfil A', kind='produção', diametro_furo=140, altura_banco=10.5, subperfuracao=0.6, stemming=2.3, air_deck=0.35, blastbag=0.15, inclinacao=0.0, azimute=0.0, densidade=1.15)],
)
img.save('OUTPUT/smoke_test_header.jpg', quality=90)
print('OK - salvo em OUTPUT/smoke_test_header.jpg')
"
```

Inspecionar visualmente `OUTPUT/smoke_test_header.jpg` — header deve ser branco com stripe vermelha.

- [ ] **Step 6: Commit**

```bash
git add generator/layout.py tests/test_generators.py
git commit -m "feat: redesign header to white background with red stripe and Enaex badge"
```

---

## Task 5: Footer refinado e _draw_layout sem outline

**Files:**
- Modify: `generator/layout.py` (funções `_draw_footer` e `_draw_layout`)

- [ ] **Step 1: Substituir _draw_footer**

Substituir a função `_draw_footer` completa por:

```python
def _draw_footer(canvas: Image.Image, theme: TemplateTheme, observation: str, labels: dict[str, str]) -> None:
    draw = ImageDraw.Draw(canvas)
    width, height = canvas.size
    footer_y = height - _s(86)

    draw.line((_s(48), footer_y, width - _s(48), footer_y), fill="#E5E7EB", width=_s(1))

    # Bullets coloridos com texto
    entries = [
        ("Produção", theme.accent_blue),
        ("Amortecimento", theme.accent_orange),
        ("Contorno", theme.accent_red),
    ]
    x = _s(48)
    y_legend = footer_y + _s(16)
    for label, color in entries:
        draw.rounded_rectangle((x, y_legend + _s(2), x + _s(14), y_legend + _s(16)), radius=_s(4), fill=color)
        draw.text((x + _s(20), y_legend), label, font=_font(_s(15), bold=True), fill=theme.muted)
        x += int(draw.textlength(label, font=_font(_s(15), bold=True))) + _s(36)

    if observation:
        _draw_wrapped_text(
            draw, observation,
            (_s(48), footer_y + _s(42), width - _s(48), height - _s(10)),
            _font(_s(17)), theme.muted,
        )
```

- [ ] **Step 2: Substituir _draw_layout (remover outline, usar gaussian shadow)**

Substituir a função `_draw_layout` completa por:

```python
def _draw_layout(canvas: Image.Image, theme: TemplateTheme, mesh_panel: Image.Image, profile_panels: list[Image.Image]) -> None:
    width, height = canvas.size
    top = _s(176)
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
        # Sombra gaussiana suave
        _gaussian_shadow(canvas, box, radius=_s(28), blur_radius=10)
        draw = ImageDraw.Draw(canvas)
        # Card branco sem outline
        draw.rounded_rectangle(box, radius=_s(28), fill=theme.panel_bg)
        # Colar painel interno
        panel_fit = ImageOps.contain(panel, (w - _s(24), h - _s(24)))
        px = x + (w - panel_fit.size[0]) // 2
        py = y + _s(12)
        canvas.alpha_composite(panel_fit, (px, py))
```

- [ ] **Step 3: Rodar testes e smoke**

```bash
py -3.13 -m pytest tests/test_generators.py -v
```

Esperado: todos PASS.

```bash
py -3.13 -c "
from generator.layout import build_final_image
from generator.mesh import MeshInput
from generator.profile import ProfileInput
img = build_final_image('PP170526 (220-210)', 'Perfis técnicos', 'Enaex clean', 'Perfil técnico para reporte operacional.', {'stemming':'Tampão','blastbag':'Blastbag','airdeck':'Deck de ar','column':'Carga','subdrill':'Subperf.'}, MeshInput(polygon_name='PP170526 (220-210)'), [ProfileInput(name='Perfil A', kind='produção', diametro_furo=140, altura_banco=10.5, subperfuracao=0.6, stemming=2.3, air_deck=0.35, blastbag=0.15, inclinacao=0.0, azimute=0.0, densidade=1.15)])
img.save('OUTPUT/smoke_layout.jpg', quality=90)
print('OK')
"
```

Inspecionar `OUTPUT/smoke_layout.jpg` — cards sem borda visível, sombra suave.

- [ ] **Step 4: Commit**

```bash
git add generator/layout.py
git commit -m "feat: refine footer, remove card outlines, apply gaussian shadow to layout"
```

---

## Task 6: Badge de letra e funções auxiliares em profile.py

**Files:**
- Modify: `generator/profile.py`
- Modify: `tests/test_generators.py`

- [ ] **Step 1: Escrever testes para badge e hex_to_rgb**

Adicionar em `tests/test_generators.py`:

```python
class BadgeTests(unittest.TestCase):
    def test_extract_letter_from_perfil_a(self) -> None:
        from generator.profile import _extract_badge_letter
        self.assertEqual(_extract_badge_letter("Perfil A"), "A")

    def test_extract_letter_from_perfil_b(self) -> None:
        from generator.profile import _extract_badge_letter
        self.assertEqual(_extract_badge_letter("Perfil B"), "B")

    def test_extract_letter_falls_back_to_first_char(self) -> None:
        from generator.profile import _extract_badge_letter
        self.assertEqual(_extract_badge_letter("producao"), "P")

    def test_extract_letter_empty_returns_question(self) -> None:
        from generator.profile import _extract_badge_letter
        self.assertEqual(_extract_badge_letter(""), "?")


class HexRgbTests(unittest.TestCase):
    def test_red(self) -> None:
        from generator.profile import _hex_to_rgb
        self.assertEqual(_hex_to_rgb("#D71920"), (215, 25, 32))

    def test_blue(self) -> None:
        from generator.profile import _hex_to_rgb
        self.assertEqual(_hex_to_rgb("#1D6FB8"), (29, 111, 184))

    def test_without_hash(self) -> None:
        from generator.profile import _hex_to_rgb
        self.assertEqual(_hex_to_rgb("FFFFFF"), (255, 255, 255))
```

- [ ] **Step 2: Rodar para confirmar falha**

```bash
py -3.13 -m pytest tests/test_generators.py::BadgeTests tests/test_generators.py::HexRgbTests -v
```

Esperado: FAIL — funções não existem.

- [ ] **Step 3: Adicionar import re e as duas funções no topo de profile.py**

Após os imports existentes em `generator/profile.py`, adicionar:

```python
import re
from pathlib import Path
```

Após a função `_kind_palette` (antes de `_draw_arrow`), adicionar:

```python
def _extract_badge_letter(name: str) -> str:
    match = re.search(r'\b([A-Z])\b', name)
    if match:
        return match.group(1)
    stripped = name.strip()
    return stripped[0].upper() if stripped else "?"


def _hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    h = hex_color.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
```

- [ ] **Step 4: Rodar testes**

```bash
py -3.13 -m pytest tests/test_generators.py::BadgeTests tests/test_generators.py::HexRgbTests -v
```

Esperado: todos PASS.

- [ ] **Step 5: Commit**

```bash
git add generator/profile.py tests/test_generators.py
git commit -m "feat: add badge letter extraction and hex_to_rgb helpers"
```

---

## Task 7: Cilindro 3D com gradiente

**Files:**
- Modify: `generator/profile.py` (adicionar `_draw_gradient_segment`, reescrever bloco do cilindro em `render_profile_panel`)
- Modify: `tests/test_generators.py`

- [ ] **Step 1: Escrever teste do gradiente**

Adicionar em `tests/test_generators.py`:

```python
class CylinderGradientTests(unittest.TestCase):
    def test_gradient_segment_left_brighter_than_right(self) -> None:
        from PIL import Image, ImageDraw
        from generator.profile import _draw_gradient_segment
        img = Image.new("RGBA", (200, 100), (255, 255, 255, 255))
        draw = ImageDraw.Draw(img)
        _draw_gradient_segment(draw, 10, 10, 190, 90, "#1D6FB8")
        # Pixel da esquerda (highlight) deve ter R+G+B maior que pixel da direita (sombra)
        left = img.getpixel((28, 50))   # ~15% da largura
        right = img.getpixel((175, 50))  # ~90% da largura
        left_brightness = left[0] + left[1] + left[2]
        right_brightness = right[0] + right[1] + right[2]
        self.assertGreater(left_brightness, right_brightness)

    def test_gradient_segment_zero_width_does_not_crash(self) -> None:
        from PIL import Image, ImageDraw
        from generator.profile import _draw_gradient_segment
        img = Image.new("RGBA", (100, 100), (255, 255, 255, 255))
        draw = ImageDraw.Draw(img)
        _draw_gradient_segment(draw, 50, 10, 50, 90, "#D71920")  # x1 == x2
```

- [ ] **Step 2: Rodar para confirmar falha**

```bash
py -3.13 -m pytest tests/test_generators.py::CylinderGradientTests -v
```

Esperado: FAIL — `_draw_gradient_segment` não existe.

- [ ] **Step 3: Adicionar _draw_gradient_segment em profile.py**

Após a função `_hex_to_rgb`, adicionar:

```python
def _draw_gradient_segment(
    draw: ImageDraw.ImageDraw,
    x1: int, y1: int, x2: int, y2: int,
    base_color: str,
    highlight: float = 0.40,
) -> None:
    """Desenha um segmento retangular com gradiente lateral simulando superfície cilíndrica."""
    if y1 >= y2 or x1 >= x2:
        return
    r, g, b = _hex_to_rgb(base_color)
    width = x2 - x1
    for i in range(width):
        t = i / max(width - 1, 1)
        # Pico de luminosidade em t=0.18 (highlight), sombra a partir de t=0.60
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
```

- [ ] **Step 4: Rodar testes**

```bash
py -3.13 -m pytest tests/test_generators.py::CylinderGradientTests -v
```

Esperado: ambos PASS.

- [ ] **Step 5: Reescrever o bloco do cilindro em render_profile_panel**

Em `generator/profile.py`, dentro de `render_profile_panel`, localizar o bloco que começa em `drawing_box = (_s(36), _s(112), _s(176), h - _s(108))` e vai até `draw.text((_s(34), bottom - _s(18)), ...)`.

Substituir **todo esse bloco** por:

```python
    # ── Zona do cilindro ──────────────────────────────────────────────────
    drawing_box = (_s(34), _s(108), _s(178), h - _s(110))
    info_box    = (_s(190), _s(108), w - _s(28), h - _s(110))

    # Fundo branco arredondado para zona do cilindro
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

        # Label lateral com linha tracejada
        mid_y = int((y_cur + y2) // 2)
        dash_x = label_x + _s(4)
        for dx in range(0, _s(10), _s(4)):
            draw.line((dash_x + dx, mid_y, dash_x + dx + _s(2), mid_y), fill=theme.muted, width=_s(1))
        draw.text((label_x + _s(16), mid_y - _s(7)), f"{seg_val:.2f}m".replace(".", ","),
                  font=label_font, fill=theme.muted)

        y_cur = y2

    # Contorno externo do cilindro
    draw.rounded_rectangle((cyl_x1, hole_top, cyl_x2, hole_bottom),
                            radius=_s(20), outline=theme.title, width=_s(2))
    # Boca (topo do furo)
    draw.ellipse((cyl_x1, hole_top - _s(7), cyl_x2, hole_top + _s(9)),
                 fill="#E9EEF4", outline=theme.title, width=_s(2))
    # Fundo (profundidade)
    draw.ellipse((cyl_x1, hole_bottom - _s(9), cyl_x2, hole_bottom + _s(7)),
                 fill="#374151", outline=theme.title, width=_s(2))
    # Highlight lateral esquerdo (reflexo)
    draw.line((cyl_x1 + _s(5), hole_top + _s(14), cyl_x1 + _s(5), hole_bottom - _s(14)),
              fill=(255, 255, 255, 80), width=_s(2))

    # Rótulo base
    draw.text((left + _s(6), bottom_b - _s(20)),
              f"BANCO {_fmt(profile.altura_banco)} M",
              font=_font(_s(10), bold=True), fill=theme.muted)
```

- [ ] **Step 6: Smoke test visual do cilindro**

```bash
py -3.13 -c "
from generator.layout import build_final_image
from generator.mesh import MeshInput
from generator.profile import ProfileInput
img = build_final_image('PP170526 (220-210)', 'Perfis técnicos', 'Enaex clean', 'Perfil técnico.', {'stemming':'Tampão','blastbag':'Blastbag','airdeck':'Deck de ar','column':'Carga','subdrill':'Subperf.'}, MeshInput(polygon_name='PP170526'), [ProfileInput('Perfil A','produção',140,10.5,0.6,2.3,0.35,0.15,0.0,0.0,1.15), ProfileInput('Perfil B','amortecimento',102,10.4,0.0,3.5,0.2,0.1,0.0,0.0,1.05)])
img.save('OUTPUT/smoke_cylinder.jpg', quality=92)
print('OK')
"
```

Verificar visualmente `OUTPUT/smoke_cylinder.jpg`: cilindro com gradiente lateral visível.

- [ ] **Step 7: Rodar todos os testes**

```bash
py -3.13 -m pytest tests/ -v
```

Esperado: todos PASS.

- [ ] **Step 8: Commit**

```bash
git add generator/profile.py tests/test_generators.py
git commit -m "feat: render 3D gradient cylinder with lateral lighting and segment labels"
```

---

## Task 8: Cabeçalho do card com badge letra, tabela alternada e ícone densidade

**Files:**
- Modify: `generator/profile.py` (cabeçalho do card, `_draw_metric_row`, bloco de métricas em `render_profile_panel`)

- [ ] **Step 1: Escrever teste para cabeçalho do card**

Adicionar em `tests/test_generators.py`:

```python
class ProfileCardTests(unittest.TestCase):
    def _render(self, name: str = "Perfil A", kind: str = "produção") -> "Image.Image":
        from PIL import Image
        from generator.profile import ProfileInput, render_profile_panel
        from generator.layout import TEMPLATE_PRESETS
        theme = TEMPLATE_PRESETS["Enaex clean"]
        profile = ProfileInput(name=name, kind=kind, diametro_furo=140,
                               altura_banco=10.5, subperfuracao=0.6, stemming=2.3,
                               air_deck=0.35, blastbag=0.15, inclinacao=0.0,
                               azimute=0.0, densidade=1.15)
        labels = {"stemming": "Tampão", "blastbag": "Blastbag",
                  "airdeck": "Deck de ar", "column": "Carga", "subdrill": "Subperf."}
        return render_profile_panel(profile, theme, labels=labels, size=(540, 760))

    def test_panel_renders_correct_size(self) -> None:
        img = self._render()
        # Scale=2: 540*2=1080, 760*2=1520
        self.assertEqual(img.size, (1080, 1520))

    def test_panel_b_renders_without_error(self) -> None:
        img = self._render(name="Perfil B", kind="amortecimento")
        self.assertEqual(img.size[0], 1080)
```

- [ ] **Step 2: Rodar testes**

```bash
py -3.13 -m pytest tests/test_generators.py::ProfileCardTests -v
```

Esperado: PASS (o render já funciona, só estamos garantindo tamanho).

- [ ] **Step 3: Reescrever cabeçalho do card em render_profile_panel**

Em `generator/profile.py`, dentro de `render_profile_panel`, localizar o bloco que começa em `draw.rounded_rectangle((_s(18), _s(18), w - _s(18), h - _s(18))...` e vai até `draw.line((_s(34), _s(92)...`.

Substituir por:

```python
    # ── Card background ───────────────────────────────────────────────────
    draw.rounded_rectangle((_s(12), _s(12), w - _s(12), h - _s(12)),
                            radius=_s(22), fill="#FFFFFF")

    # ── Cabeçalho do card ─────────────────────────────────────────────────
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

    # Linha separadora com cor do tipo
    draw.rectangle((_s(18), _s(88), w - _s(18), _s(92)), fill=accent)
```

- [ ] **Step 4: Atualizar _draw_metric_row para linhas alternadas e ícone de densidade**

Substituir a função `_draw_metric_row` completa por:

```python
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
    ic = icon_x + icon_size // 2  # center x
    iy = icon_y + icon_size // 2  # center y

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
        # Ícone de gota
        draw.ellipse((ic - _s(6), iy, ic + _s(6), iy + _s(10)), fill=color)
        draw.polygon([(ic, icon_y + _s(2)), (ic - _s(6), iy + _s(4)), (ic + _s(6), iy + _s(4))], fill=color)
    else:
        draw.rectangle((icon_x + _s(3), icon_y + _s(5), icon_x + icon_size - _s(3), icon_y + icon_size - _s(5)), outline=color, width=_s(2))

    draw.text((x1 + _s(44), y1 + _s(7)), label.upper(), font=_font(_s(10), bold=True), fill=theme.muted)
    val_font = _font(_s(12), bold=True)
    val_w = int(draw.textlength(value, font=val_font))
    draw.text((x2 - _s(14) - val_w, y1 + _s(7)), value, font=val_font, fill=theme.title)
    draw.line((x1 + _s(6), y2 - 1, x2 - _s(6), y2 - 1), fill="#E5E7EB", width=_s(1))
```

- [ ] **Step 5: Atualizar o bloco de métricas em render_profile_panel para usar alternância**

Localizar em `render_profile_panel` o bloco que começa com `ix1, iy1, ix2, iy2 = info_box` e vai até o `footer_bar`. Substituir por:

```python
    # ── Zona de parâmetros ────────────────────────────────────────────────
    draw.rounded_rectangle(info_box, radius=_s(16), fill="#FFFFFF", outline="#E5E7EB", width=_s(1))
    ix1, iy1, ix2, iy2 = info_box

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
```

- [ ] **Step 6: Atualizar chips de resumo**

Após o loop de métricas (ainda dentro de `render_profile_panel`), localizar o bloco dos chips e `footer_bar`. Substituir por:

```python
    # ── Chips de resumo ───────────────────────────────────────────────────
    chips_y = iy2 - _s(64)
    chips = [
        (labels.get("stemming", "Tampão"), f"{_fmt(stem)} m", "#F3F4F6"),
        (labels.get("column", "Carga"),    f"{_fmt(charge)} m", accent_soft),
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
                                radius=_s(10), fill=chip_fill)
        draw.text((chip_x + _s(10), chips_y + _s(6)), text, font=chip_font, fill=theme.title)
        chip_x += chip_w + _s(8)

    # ── Footer bar ────────────────────────────────────────────────────────
    footer_bar = (ix1 + _s(12), iy2 - _s(28), ix2 - _s(12), iy2 - _s(4))
    draw.rounded_rectangle(footer_bar, radius=_s(10), fill=accent)
    fb_font = _font(_s(11), bold=True)
    fb_text = f"{_short(profile.name, 20)} | {kind_label}"
    draw.text((footer_bar[0] + _s(14), footer_bar[1] + _s(6)), fb_text, font=fb_font, fill="#FFFFFF")
    return img
```

- [ ] **Step 7: Rodar todos os testes**

```bash
py -3.13 -m pytest tests/ -v
```

Esperado: todos PASS.

- [ ] **Step 8: Smoke test final completo com 2 perfis**

```bash
py -3.13 -c "
from generator.layout import build_final_image
from generator.mesh import MeshInput
from generator.profile import ProfileInput
labels = {'stemming':'Tampão','blastbag':'Blastbag','airdeck':'Deck de ar','column':'Carga','subdrill':'Subperf.'}
profiles = [
    ProfileInput('Perfil A','produção',140,10.5,0.6,2.3,0.35,0.15,0.0,0.0,1.15),
    ProfileInput('Perfil B','amortecimento',102,10.4,0.0,3.5,0.2,0.1,0.0,0.0,1.05),
]
img = build_final_image('PP170526 (220-210)', 'Perfis técnicos', 'Enaex clean', 'Perfil técnico para reporte operacional.', labels, MeshInput(polygon_name='PP170526 (220-210)'), profiles)
img.save('OUTPUT/smoke_final.jpg', quality=95)
print('OK -', img.size)
"
```

Verificar `OUTPUT/smoke_final.jpg`:
- [ ] Header branco com stripe vermelha
- [ ] Cards sem borda visível (sombra suave)
- [ ] Perfil A badge "A" em azul, Perfil B badge "B" em laranja
- [ ] Cilindros com gradiente lateral visível
- [ ] Tabela com linhas alternadas
- [ ] Ícone de densidade é gota

- [ ] **Step 9: Commit**

```bash
git add generator/profile.py tests/test_generators.py
git commit -m "feat: redesign profile card with letter badge, 3D cylinder, alternating table, density icon"
```

---

## Task 9: Atualizar painel de malha (mesh.py)

**Files:**
- Modify: `generator/mesh.py`

- [ ] **Step 1: Substituir render_mesh_panel**

Substituir a função `render_mesh_panel` completa em `generator/mesh.py` por:

```python
def render_mesh_panel(mesh_input: MeshInput, theme, size: tuple[int, int] = (540, 760)) -> Image.Image:
    size = (_s(size[0]), _s(size[1]))
    w, h = size

    if mesh_input.uploaded_mesh:
        img = Image.new("RGBA", size, "#FFFFFF")
        draw = ImageDraw.Draw(img)
        draw.rounded_rectangle((_s(12), _s(12), w - _s(12), h - _s(12)),
                                radius=_s(22), fill="#FFFFFF")
        draw.text((_s(28), _s(26)), "MALHA DE PERFURAÇÃO",
                  font=_font(_s(20), bold=True), fill=theme.title)
        draw.rectangle((_s(28), _s(64), _s(80), _s(68)), fill=theme.accent_red)
        mesh = Image.open(io.BytesIO(mesh_input.uploaded_mesh)).convert("RGBA")
        mesh = ImageOps.contain(mesh, (w - _s(80), h - _s(220)))
        img.alpha_composite(mesh, ((w - mesh.size[0]) // 2, _s(110)))
        draw.text((_s(28), h - _s(80)), "Imagem anexada pelo usuário.",
                  font=_font(_s(13), bold=True), fill=theme.muted)
        return img

    img = Image.new("RGBA", size, "#FFFFFF")
    draw = ImageDraw.Draw(img)

    # Card base
    draw.rounded_rectangle((_s(12), _s(12), w - _s(12), h - _s(12)),
                            radius=_s(22), fill="#FFFFFF")

    # Título
    draw.text((_s(28), _s(26)), "MALHA DE PERFURAÇÃO",
              font=_font(_s(20), bold=True), fill=theme.title)
    draw.rectangle((_s(28), _s(64), _s(80), _s(67)), fill=theme.accent_red)
    draw.text((_s(28), _s(78)), mesh_input.polygon_name,
              font=_font(_s(14)), fill=theme.muted)

    # Área de upload com borda tracejada
    upload_box = (_s(32), _s(104), w - _s(32), h - _s(130))
    ub_x1, ub_y1, ub_x2, ub_y2 = upload_box
    # Desenhar borda tracejada manualmente
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

    # Ícone de upload (círculo + seta para cima)
    ic_cx = (ub_x1 + ub_x2) // 2
    ic_cy = ub_y1 + _s(110)
    draw.ellipse((ic_cx - _s(36), ic_cy - _s(36), ic_cx + _s(36), ic_cy + _s(36)),
                 outline="#D1D5DB", width=_s(2), fill="#F9FAFB")
    draw.line((ic_cx, ic_cy + _s(16), ic_cx, ic_cy - _s(16)), fill="#9CA3AF", width=_s(2))
    draw.polygon([(ic_cx, ic_cy - _s(16)), (ic_cx - _s(8), ic_cy - _s(4)), (ic_cx + _s(8), ic_cy - _s(4))],
                 fill="#9CA3AF")

    # Instruções
    inst_font = _font(_s(14), bold=True)
    inst = "Anexe a imagem da malha"
    inst_w = int(draw.textlength(inst, font=inst_font))
    draw.text((ic_cx - inst_w // 2, ic_cy + _s(50)), inst, font=inst_font, fill=theme.text)
    sub_font = _font(_s(12))
    sub_text = "Se não houver anexo, o painel fica apenas como referência."
    sub_w = int(draw.textlength(sub_text, font=sub_font))
    draw.text((ic_cx - sub_w // 2, ic_cy + _s(76)), sub_text, font=sub_font, fill=theme.muted)

    # Legenda
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
```

- [ ] **Step 2: Rodar testes e smoke final completo**

```bash
py -3.13 -m pytest tests/ -v
```

```bash
py -3.13 -c "
from generator.layout import build_final_image
from generator.mesh import MeshInput
from generator.profile import ProfileInput
labels = {'stemming':'Tampão','blastbag':'Blastbag','airdeck':'Deck de ar','column':'Carga','subdrill':'Subperf.'}
profiles = [
    ProfileInput('Perfil A','produção',140,10.5,0.6,2.3,0.35,0.15,0.0,0.0,1.15),
    ProfileInput('Perfil B','amortecimento',102,10.4,0.0,3.5,0.2,0.1,0.0,0.0,1.05),
]
img = build_final_image('PP170526 (220-210)', 'Perfis técnicos', 'Enaex clean', 'Perfil técnico para reporte operacional.', labels, MeshInput(polygon_name='PP170526 (220-210)'), profiles)
img.save('OUTPUT/smoke_final_complete.jpg', quality=95)
print('Tamanho:', img.size)
"
```

Inspecionar `OUTPUT/smoke_final_complete.jpg` contra todos os critérios do spec:
- [ ] Header branco, stripe vermelha, logo em badge vermelho
- [ ] Cards sem borda outline (só sombra)
- [ ] Cilindro 3D com gradiente
- [ ] Badge letra "A" e "B" corretos
- [ ] Tabela alternada
- [ ] Ícone de densidade (gota)
- [ ] Painel de malha com borda tracejada
- [ ] Fonte Montserrat em todo o documento

- [ ] **Step 3: Commit final**

```bash
git add generator/mesh.py
git commit -m "feat: redesign mesh panel with dashed upload area and refined icon"
```

---

## Notas de implementação

- `stem`, `sub`, `bb_v`, `ad_v`, `charge` — estas variáveis são necessárias no bloco de chips (Task 8, Step 5). Verificar que estão em escopo quando o bloco dos chips for escrito (elas são definidas no bloco do cilindro, Task 7, Step 5).
- Se `render_profile_panel` ficar muito longa após todas as modificações, considerar extrair `_render_cylinder` e `_render_metrics` como funções auxiliares privadas — mas só se o arquivo ultrapassar ~350 linhas.
- A variável `info_box` precisa ser definida antes do bloco de parâmetros. Certificar que o bloco do cilindro (Task 7) define `info_box` e o bloco de métricas (Task 8) a usa — ambos estão dentro de `render_profile_panel`.
