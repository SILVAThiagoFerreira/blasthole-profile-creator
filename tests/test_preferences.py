from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from src.config import load_config
from src.preferences import load_ui_preferences, save_ui_preferences


class PreferencePersistenceTests(unittest.TestCase):
    def test_save_and_load_round_trip(self) -> None:
        cfg = load_config()
        defaults = cfg["defaults"]
        profiles = [
            defaults["profiles"][0],
            defaults["profiles"][1],
            {**defaults["profiles"][0], "name": "Perfil C"},
            {**defaults["profiles"][1], "name": "Perfil D"},
        ]
        request = {
            "polygon_name": "PP999999 (111-222)",
            "profile_type": defaults["profile_type"],
            "template_name": defaults["template_name"],
            "observation": "Memória persistida para a próxima sessão.",
            "profile_count": 4,
            "labels": defaults["labels"],
            "profiles": profiles,
            "mesh_bytes": b"binary-data",
        }

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "user_preferences.json"
            with patch("src.preferences.get_preferences_path", return_value=path):
                saved_path = save_ui_preferences(cfg, request)
                self.assertEqual(saved_path, path)
                self.assertTrue(path.exists())
                self.assertNotIn("mesh_bytes", path.read_text(encoding="utf-8"))
                loaded = load_ui_preferences(cfg)

        self.assertEqual(loaded["polygon_name"], request["polygon_name"])
        self.assertEqual(loaded["profile_count"], 4)
        self.assertEqual(len(loaded["profiles"]), 4)
        self.assertEqual(loaded["profiles"][2]["name"], "Perfil C")

    def test_invalid_preferences_fall_back_to_defaults(self) -> None:
        cfg = load_config()
        defaults = cfg["defaults"]

        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "user_preferences.json"
            path.write_text("{invalid json", encoding="utf-8")
            with patch("src.preferences.get_preferences_path", return_value=path):
                loaded = load_ui_preferences(cfg)

        self.assertEqual(loaded["template_name"], defaults["template_name"])
        self.assertEqual(loaded["profile_count"], defaults["profile_count"])
        self.assertEqual(len(loaded["profiles"]), defaults["profile_count"])


if __name__ == "__main__":
    unittest.main()
