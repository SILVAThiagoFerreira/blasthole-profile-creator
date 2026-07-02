from __future__ import annotations

import unittest
from unittest.mock import patch

from src.config import load_config
from src.pipeline import RenderingPipeline


class PipelineTests(unittest.TestCase):
    def test_build_image_forwards_optional_assets(self) -> None:
        cfg = load_config()
        pipeline = RenderingPipeline(cfg)
        base_profile = cfg["defaults"]["profiles"][0]
        request = {
            "polygon_name": cfg["defaults"]["polygon_name"],
            "profile_type": cfg["defaults"]["profile_type"],
            "template_name": cfg["defaults"]["template_name"],
            "observation": cfg["defaults"]["observation"],
            "labels": cfg["defaults"]["labels"],
            "profile_count": 1,
            "profiles": [base_profile],
            "logo_bytes": b"logo-bytes",
            "mesh_bytes": b"mesh-bytes",
        }

        with patch("src.pipeline.build_final_image", return_value=object()) as mocked:
            pipeline.build_image(request)

        self.assertTrue(mocked.called)
        _, kwargs = mocked.call_args
        self.assertEqual(kwargs["logo_bytes"], b"logo-bytes")
        self.assertEqual(kwargs["mesh_input"].uploaded_mesh, b"mesh-bytes")


if __name__ == "__main__":
    unittest.main()
