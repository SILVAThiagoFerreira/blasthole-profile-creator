from __future__ import annotations

import unittest

from src.config import load_config
from src.validation import ValidationError, validate_profile, validate_run_request


class ValidationTests(unittest.TestCase):
    def test_valid_profile_passes(self) -> None:
        profile = load_config()["defaults"]["profiles"][0]
        validate_profile(profile)

    def test_negative_value_fails(self) -> None:
        profile = load_config()["defaults"]["profiles"][0].copy()
        profile["altura_banco"] = -1
        with self.assertRaises(ValidationError):
            validate_profile(profile)

    def test_run_request_profile_bounds(self) -> None:
        cfg = load_config()
        request = {
            "polygon_name": cfg["defaults"]["polygon_name"],
            "template_name": cfg["defaults"]["template_name"],
            "profile_type": cfg["defaults"]["profile_type"],
            "profile_count": 1,
            "profiles": [cfg["defaults"]["profiles"][0]],
        }
        validate_run_request(request, cfg["validation"])


if __name__ == "__main__":
    unittest.main()
