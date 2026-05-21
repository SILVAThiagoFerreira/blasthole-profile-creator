from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any

from .config import get_paths_config, get_project_root, get_validation_config
from .validation import ValidationError, validate_profile, validate_run_request


PREFERENCES_FILE = "user_preferences.json"
PROFILE_FIELDS = (
    "name",
    "kind",
    "diametro_furo",
    "altura_banco",
    "subperfuracao",
    "stemming",
    "blastbag",
    "blastbags",
    "air_deck",
    "air_decks",
    "segments",
    "inclinacao",
    "azimute",
    "densidade",
)


def _state_dir() -> Path:
    paths = get_paths_config()
    return get_project_root() / str(paths.get("state_dir", "state"))


def get_preferences_path() -> Path:
    return _state_dir() / PREFERENCES_FILE


def _read_raw_preferences() -> dict[str, Any]:
    path = get_preferences_path()
    if not path.exists():
        return {}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    if not isinstance(payload, dict):
        return {}
    request = payload.get("request")
    if isinstance(request, dict):
        return request
    return payload


def _clamp_profile_count(value: Any, minimum: int, maximum: int, fallback: int) -> int:
    try:
        count = int(value)
    except (TypeError, ValueError):
        count = fallback
    return max(minimum, min(maximum, count))


def _merge_labels(default_labels: dict[str, str], saved_labels: Any) -> dict[str, str]:
    labels = default_labels.copy()
    if not isinstance(saved_labels, dict):
        return labels
    for key in labels:
        value = saved_labels.get(key)
        if isinstance(value, str) and value.strip():
            labels[key] = value
    return labels


def _normalize_profile(source: Any, fallback: dict[str, Any], index: int, default_count: int) -> dict[str, Any]:
    profile = fallback.copy()
    if isinstance(source, dict):
        for field in PROFILE_FIELDS:
            if field in source:
                profile[field] = source[field]
    if index >= default_count and (not isinstance(source, dict) or not isinstance(source.get("name"), str) or not source.get("name", "").strip()):
        profile["name"] = f"Perfil {index + 1}"
    try:
        validate_profile(profile)
    except ValidationError:
        profile = fallback.copy()
        if index >= default_count:
            profile["name"] = f"Perfil {index + 1}"
    return profile


def _default_request(config: dict[str, Any]) -> dict[str, Any]:
    defaults = config["defaults"]
    profiles = [profile.copy() for profile in defaults["profiles"]]
    return {
        "polygon_name": defaults["polygon_name"],
        "profile_type": defaults["profile_type"],
        "template_name": defaults["template_name"],
        "observation": defaults["observation"],
        "profile_count": int(defaults["profile_count"]),
        "labels": defaults["labels"].copy(),
        "profiles": profiles,
    }


def load_ui_preferences(config: dict[str, Any]) -> dict[str, Any]:
    defaults = config["defaults"]
    validation = get_validation_config()
    minimum = int(validation.get("min_profiles", 1))
    maximum = int(validation.get("max_profiles", 3))
    fallback = _default_request(config)
    saved = _read_raw_preferences()
    if not saved:
        return fallback

    template_name = saved.get("template_name")
    if template_name not in config["templates"]:
        template_name = fallback["template_name"]

    polygon_name = saved.get("polygon_name") if isinstance(saved.get("polygon_name"), str) and saved["polygon_name"].strip() else fallback["polygon_name"]
    observation = saved.get("observation") if isinstance(saved.get("observation"), str) else fallback["observation"]
    profile_count = _clamp_profile_count(saved.get("profile_count"), minimum, maximum, int(fallback["profile_count"]))
    labels = _merge_labels(defaults["labels"], saved.get("labels"))

    raw_profiles = saved.get("profiles")
    profiles: list[dict[str, Any]] = []
    default_profile_count = len(fallback["profiles"])
    for idx in range(profile_count):
        if isinstance(raw_profiles, list) and idx < len(raw_profiles):
            source = raw_profiles[idx]
        else:
            source = None
        fallback_profile = fallback["profiles"][idx] if idx < len(fallback["profiles"]) else fallback["profiles"][-1].copy()
        profiles.append(_normalize_profile(source, fallback_profile, idx, default_profile_count))

    request = {
        "polygon_name": polygon_name,
        "profile_type": fallback["profile_type"],
        "template_name": template_name,
        "observation": observation,
        "profile_count": profile_count,
        "labels": labels,
        "profiles": profiles,
    }

    try:
        validate_run_request(request, validation)
    except ValidationError:
        return fallback
    return request


def _sanitize(value: Any) -> Any:
    if isinstance(value, bytes):
        return {"type": "bytes", "length": len(value)}
    if isinstance(value, dict):
        return {key: _sanitize(item) for key, item in value.items() if key != "mesh_bytes"}
    if isinstance(value, list):
        return [_sanitize(item) for item in value]
    return value


def save_ui_preferences(config: dict[str, Any], request: dict[str, Any]) -> Path:
    validation = get_validation_config()
    validate_run_request(request, validation)
    if request.get("template_name") not in config["templates"]:
        raise ValidationError("template_name must be one of the configured templates")

    payload = {
        "schema_version": 1,
        "saved_at": datetime.now().isoformat(timespec="seconds"),
        "request": _sanitize(request),
    }

    path = get_preferences_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_name(f"{path.name}.tmp")
    tmp_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False, sort_keys=True), encoding="utf-8")
    tmp_path.replace(path)
    return path
