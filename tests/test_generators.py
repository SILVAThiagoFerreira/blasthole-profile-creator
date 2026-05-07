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
