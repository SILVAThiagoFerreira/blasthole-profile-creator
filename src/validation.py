from __future__ import annotations

from dataclasses import dataclass
from typing import Any


DECK_POSITIONS = {"above_stemming", "mid_stemming", "below_stemming", "mid_charge", "lower_charge"}


class ValidationError(ValueError):
    pass


@dataclass(frozen=True)
class ValidationIssue:
    field: str
    message: str


def _require_text(value: Any, field: str) -> None:
    if not isinstance(value, str) or not value.strip():
        raise ValidationError(f"{field} must be a non-empty string")


def _require_non_negative_number(value: Any, field: str) -> None:
    if not isinstance(value, (int, float)):
        raise ValidationError(f"{field} must be numeric")
    if value < 0:
        raise ValidationError(f"{field} must be greater than or equal to zero")


def validate_profile(profile: dict[str, Any]) -> None:
    required_text = ["name", "kind"]
    required_numeric = [
        "diametro_furo",
        "altura_banco",
        "subperfuracao",
        "stemming",
        "air_deck",
        "blastbag",
        "inclinacao",
        "azimute",
        "densidade",
    ]

    for field in required_text:
        _require_text(profile.get(field), field)
    for field in required_numeric:
        _require_non_negative_number(profile.get(field), field)

    for field in ("air_deck_position", "blastbag_position"):
        if field in profile and profile.get(field) not in DECK_POSITIONS:
            raise ValidationError(f"{field} must be one of {sorted(DECK_POSITIONS)}")

    for field in ("air_decks", "blastbags"):
        items = profile.get(field, [])
        if items is None:
            continue
        if not isinstance(items, list):
            raise ValidationError(f"{field} must be a list")
        for item in items:
            if not isinstance(item, dict):
                raise ValidationError(f"{field} items must be objects")
            _require_non_negative_number(item.get("height"), f"{field}.height")
            if item.get("position") not in DECK_POSITIONS:
                raise ValidationError(f"{field}.position must be one of {sorted(DECK_POSITIONS)}")


def validate_run_request(request: dict[str, Any], limits: dict[str, Any]) -> None:
    for field in limits.get("required_text_fields", []):
        _require_text(request.get(field), field)

    profile_count = request.get("profile_count")
    if not isinstance(profile_count, int):
        raise ValidationError("profile_count must be an integer")

    min_profiles = int(limits.get("min_profiles", 1))
    max_profiles = int(limits.get("max_profiles", 3))
    if profile_count < min_profiles or profile_count > max_profiles:
        raise ValidationError(f"profile_count must be between {min_profiles} and {max_profiles}")

    profiles = request.get("profiles", [])
    if len(profiles) < min_profiles:
        raise ValidationError("at least one profile is required")
    if len(profiles) > max_profiles:
        raise ValidationError(f"no more than {max_profiles} profiles are allowed")

    for profile in profiles:
        validate_profile(profile)
