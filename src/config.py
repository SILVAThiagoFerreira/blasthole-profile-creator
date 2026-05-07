from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = PROJECT_ROOT / "config.json"


@lru_cache(maxsize=1)
def load_config() -> dict[str, Any]:
    with CONFIG_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def get_project_root() -> Path:
    return PROJECT_ROOT


def get_layout_config() -> dict[str, Any]:
    return load_config()["layout"]


def get_default_config() -> dict[str, Any]:
    return load_config()["defaults"]


def get_validation_config() -> dict[str, Any]:
    return load_config()["validation"]


def get_export_config() -> dict[str, Any]:
    return load_config()["export"]


def get_paths_config() -> dict[str, Any]:
    return load_config()["paths"]
