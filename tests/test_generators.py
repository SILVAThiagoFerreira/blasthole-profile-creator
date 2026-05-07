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


class ShadowTests(unittest.TestCase):
    def test_gaussian_shadow_does_not_crash(self):
        from PIL import Image
        from generator.layout import _gaussian_shadow
        canvas = Image.new("RGBA", (400, 300), (255, 255, 255, 255))
        _gaussian_shadow(canvas, (20, 20, 380, 280), radius=16, blur_radius=8)
        r, g, b, a = canvas.getpixel((200, 150))
        self.assertLess(r, 255, "shadow must darken the canvas center pixel")


class HeaderTests(unittest.TestCase):
    def _make_canvas(self):
        from PIL import Image
        return Image.new("RGBA", (3840, 2160), (240, 242, 245, 255))

    def test_header_top_pixel_is_red(self) -> None:
        from generator.layout import _draw_header, TEMPLATE_PRESETS
        canvas = self._make_canvas()
        theme = TEMPLATE_PRESETS["Enaex clean"]
        _draw_header(canvas, theme, "PP170526 (220-210)", "Perfis técnicos", None)
        r, g, b, a = canvas.getpixel((1920, 2))
        self.assertGreater(r, 180)
        self.assertLess(g, 80)
        self.assertLess(b, 80)

    def test_header_background_is_white(self) -> None:
        from generator.layout import _draw_header, TEMPLATE_PRESETS
        canvas = self._make_canvas()
        theme = TEMPLATE_PRESETS["Enaex clean"]
        _draw_header(canvas, theme, "PP170526 (220-210)", "Perfis técnicos", None)
        r, g, b, a = canvas.getpixel((1920, 200))
        self.assertGreater(r, 220)
        self.assertGreater(g, 220)
        self.assertGreater(b, 220)


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


if __name__ == "__main__":
    unittest.main()
