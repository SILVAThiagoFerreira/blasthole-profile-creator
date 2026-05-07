from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

from PIL import Image

from generator.export import export_artifact
from generator.layout import build_final_image
from generator.mesh import MeshInput
from generator.profile import ProfileInput

from .config import get_export_config, get_paths_config, get_validation_config, get_project_root
from .validation import ValidationError, validate_run_request


@dataclass(frozen=True)
class RunManifest:
    run_id: str
    timestamp: str
    request_hash: str
    request: dict[str, Any]
    outputs: dict[str, str]


class RenderingPipeline:
    def __init__(self, config: dict[str, Any]):
        self.config = config
        self.root = get_project_root()
        paths = get_paths_config()
        self.output_dir = self.root / paths["output_dir"]
        self.log_dir = self.root / paths["log_dir"]
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.log_dir.mkdir(parents=True, exist_ok=True)

    def build_image(self, request: dict[str, Any]) -> Image.Image:
        validate_run_request(request, get_validation_config())
        profiles = [ProfileInput(**profile) for profile in request["profiles"]]
        mesh_input = MeshInput(
            polygon_name=request["polygon_name"],
            uploaded_mesh=request.get("mesh_bytes"),
        )
        return build_final_image(
            polygon_name=request["polygon_name"],
            profile_type=request["profile_type"],
            template_name=request["template_name"],
            observation=request["observation"],
            labels=request["labels"],
            mesh_input=mesh_input,
            profiles=profiles,
        )

    def export(self, image: Image.Image, polygon_name: str) -> dict[str, str]:
        export_cfg = get_export_config()
        return export_artifact(
            image,
            polygon_name=polygon_name,
            output_dir=self.output_dir,
            export_png=bool(export_cfg.get("write_png", True)),
            export_jpg=bool(export_cfg.get("write_jpg", True)),
            export_pdf=bool(export_cfg.get("write_pdf", True)),
        )

    def write_manifest(self, request: dict[str, Any], outputs: dict[str, str]) -> Path:
        timestamp = datetime.now().isoformat(timespec="seconds")
        def _sanitize(value: Any) -> Any:
            if isinstance(value, bytes):
                return {"type": "bytes", "length": len(value)}
            if isinstance(value, dict):
                return {key: _sanitize(item) for key, item in value.items()}
            if isinstance(value, list):
                return [_sanitize(item) for item in value]
            return value

        sanitized_request = _sanitize(request)
        payload = json.dumps(sanitized_request, sort_keys=True, ensure_ascii=False).encode("utf-8")
        manifest = RunManifest(
            run_id=datetime.now().strftime("%Y%m%d_%H%M%S"),
            timestamp=timestamp,
            request_hash=hashlib.sha256(payload).hexdigest()[:16],
            request=sanitized_request,
            outputs=outputs,
        )
        path = self.log_dir / f"{manifest.run_id}_{manifest.request_hash}.json"
        path.write_text(json.dumps(asdict(manifest), indent=2, ensure_ascii=False), encoding="utf-8")
        return path
