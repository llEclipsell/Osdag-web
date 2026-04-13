import math
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status


# ---------------------------------------------------------------------------
# Hardcoded location data for 5 major Indian cities
# ---------------------------------------------------------------------------
LOCATION_DATA = [
    {
        "city": "Mumbai",
        "state": "Maharashtra",
        "wind_speed": 44,
        "seismic_zone": "III",
        "zone_factor": 0.16,
        "max_temp": 39,
        "min_temp": 11,
    },
    {
        "city": "Delhi",
        "state": "Delhi",
        "wind_speed": 47,
        "seismic_zone": "IV",
        "zone_factor": 0.24,
        "max_temp": 45,
        "min_temp": 1,
    },
    {
        "city": "Chennai",
        "state": "Tamil Nadu",
        "wind_speed": 50,
        "seismic_zone": "III",
        "zone_factor": 0.16,
        "max_temp": 42,
        "min_temp": 19,
    },
    {
        "city": "Bangalore",
        "state": "Karnataka",
        "wind_speed": 33,
        "seismic_zone": "II",
        "zone_factor": 0.10,
        "max_temp": 36,
        "min_temp": 12,
    },
    {
        "city": "Kolkata",
        "state": "West Bengal",
        "wind_speed": 50,
        "seismic_zone": "III",
        "zone_factor": 0.16,
        "max_temp": 40,
        "min_temp": 8,
    },
]


# ---------------------------------------------------------------------------
# GET /api/bridge/location-data/
# ---------------------------------------------------------------------------
@api_view(["GET"])
@permission_classes([AllowAny])
def location_data_view(request):
    """Return the full list of project location records."""
    return Response(LOCATION_DATA, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# POST /api/bridge/validate-geometry/
# ---------------------------------------------------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def validate_geometry_view(request):
    """
    Validate span, carriageway_width, and skew_angle.

    Accepts JSON:  { span, carriageway_width, skew_angle }
    Returns JSON:  { valid: bool, errors: { field?: msg } }
    """
    data = request.data
    errors = {}

    # --- span ---
    span = data.get("span")
    if span is not None:
        try:
            span = float(span)
            if span < 20 or span > 45:
                errors["span"] = "Outside the software range."
        except (ValueError, TypeError):
            errors["span"] = "Invalid number."

    # --- carriageway_width ---
    cw = data.get("carriageway_width")
    if cw is not None:
        try:
            cw = float(cw)
            if cw < 4.25 or cw >= 24:
                errors["carriageway_width"] = "Must be ≥ 4.25 m and < 24 m."
        except (ValueError, TypeError):
            errors["carriageway_width"] = "Invalid number."

    # --- skew_angle ---
    sa = data.get("skew_angle")
    if sa is not None:
        try:
            sa = float(sa)
            if sa < -15 or sa > 15:
                errors["skew_angle"] = "IRC 24 (2010) requires detailed analysis."
        except (ValueError, TypeError):
            errors["skew_angle"] = "Invalid number."

    return Response(
        {"valid": len(errors) == 0, "errors": errors},
        status=status.HTTP_200_OK,
    )


# ---------------------------------------------------------------------------
# POST /api/bridge/validate-girder-geometry/
# ---------------------------------------------------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def validate_girder_geometry_view(request):
    """
    Validate & auto-compute girder geometry fields.

    Accepts JSON:
        { carriageway_width, girder_spacing, num_girders,
          deck_overhang_width, changed_field }

    Returns JSON:
        { girder_spacing, num_girders, deck_overhang_width, errors: [] }
    """
    data = request.data
    errors = []

    try:
        carriageway_width = float(data.get("carriageway_width", 0))
        girder_spacing = float(data.get("girder_spacing", 0))
        num_girders = data.get("num_girders", 0)
        deck_overhang_width = float(data.get("deck_overhang_width", 0))
        changed_field = data.get("changed_field", "")
    except (ValueError, TypeError) as exc:
        return Response(
            {"girder_spacing": 0, "num_girders": 0, "deck_overhang_width": 0,
             "errors": [f"Invalid input: {exc}"]},
            status=status.HTTP_200_OK,
        )

    overall_bridge_width = carriageway_width + 5

    # --- recalculate based on changed_field ---
    if changed_field == "girder_spacing":
        if girder_spacing > 0:
            num_girders = round(
                (overall_bridge_width - deck_overhang_width) / girder_spacing
            )
        else:
            errors.append("Girder spacing must be positive.")

    elif changed_field == "num_girders":
        try:
            num_girders = int(num_girders)
        except (ValueError, TypeError):
            errors.append("Number of girders must be a positive integer.")
            num_girders = 0
        if num_girders > 0:
            girder_spacing = round(
                (overall_bridge_width - deck_overhang_width) / num_girders, 1
            )
        else:
            errors.append("Number of girders must be positive.")

    elif changed_field == "deck_overhang_width":
        if girder_spacing > 0:
            num_girders = round(
                (overall_bridge_width - deck_overhang_width) / girder_spacing
            )
        else:
            errors.append("Girder spacing must be positive.")

    # --- validation ---
    try:
        num_girders = int(num_girders)
    except (ValueError, TypeError):
        num_girders = 0
        errors.append("Number of girders must be a positive integer.")

    if num_girders <= 0:
        if "Number of girders must be positive." not in errors and \
           "Number of girders must be a positive integer." not in errors:
            errors.append("Number of girders must be a positive integer.")

    if girder_spacing >= overall_bridge_width:
        errors.append("Girder spacing must be less than overall bridge width.")

    if deck_overhang_width >= overall_bridge_width:
        errors.append("Deck overhang width must be less than overall bridge width.")

    return Response(
        {
            "girder_spacing": round(girder_spacing, 1),
            "num_girders": num_girders,
            "deck_overhang_width": round(deck_overhang_width, 1),
            "errors": errors,
        },
        status=status.HTTP_200_OK,
    )
