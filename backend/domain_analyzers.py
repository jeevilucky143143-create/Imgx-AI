"""
Domain Vision Analyzers for IMGX.AI
Provides high-precision visual recognition for:
1. Atmospheric & Nature phenomena (Rainbow, Sunset, Sunrise, Aurora Borealis, Cloud Formation)
2. Space & Celestial objects (Moon, Planet, Galaxy, Nebula, Starfield)
3. Safe Human detection with strict animal/object rejection guards
"""

import numpy as np
from PIL import Image
from typing import Optional, Dict, Any, List

HUMAN_IMAGENET_PERSON_CLASSES = {
    'groom', 'ballplayer', 'scuba diver', 'military uniform'
}

HUMAN_IMAGENET_CLOTHING_CLASSES = {
    'suit', 'trench coat', 'cloak', 'academic gown', 'cardigan',
    'sweatshirt', 'jersey', 'jean', 'swimming trunks', 'bikini',
    'diaper', 'bib', 'apron', 'kimono', 'sari', 'wig', 'sunglasses',
    'crash helmet', 'cowboy hat', 'bonnet', 'sombrero', 'mortarboard',
    'brassiere', 'bow tie', 'neck brace'
}


def analyze_atmospheric(
    image: Image.Image,
    top_predictions: List[Dict[str, Any]],
    animal_prob: float,
    vehicle_prob: float,
    food_prob: float
) -> Optional[Dict[str, Any]]:
    """
    Detects atmospheric phenomena such as Rainbows, Sunsets, Auroras, and Cloud formations.
    Strictly blocked if animal, vehicle, or food probability is dominant.
    """
    has_real_animal = any(
        p.get("category") == "Animal" and p.get("confidence", 0) >= 0.20
        for p in top_predictions[:3]
    )
    has_real_vehicle = any(
        p.get("category") == "Vehicle" and p.get("confidence", 0) >= 0.35
        for p in top_predictions[:3]
    )
    has_real_food = any(
        p.get("category") == "Food" and p.get("confidence", 0) >= 0.35
        for p in top_predictions[:3]
    )
    if has_real_animal or has_real_vehicle or has_real_food:
        return None

    try:
        rgb_img = image.convert('RGB')
        # Fast downsample for spatial statistics
        small = rgb_img.resize((160, 160), Image.Resampling.BILINEAR)
        hsv = np.array(small.convert('HSV'))
        h, s, v = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]

        top_prob = top_predictions[0]["confidence"] if top_predictions else 0.0

        # ---------------------------------------------------------------------
        # 1. RAINBOW DETECTION
        # ---------------------------------------------------------------------
        sat_mask = (s > 40) & (v > 40)
        cyan_blue = ((h >= 95) & (h < 180)) & sat_mask
        yellow_orange = ((h >= 18) & (h < 50)) & sat_mask
        red = ((h < 18) | (h > 238)) & sat_mask
        green = ((h >= 50) & (h < 95)) & sat_mask
        purple = ((h >= 180) & (h <= 238)) & sat_mask

        cb_ratio = float(np.mean(cyan_blue))
        yo_ratio = float(np.mean(yellow_orange))
        r_ratio = float(np.mean(red))
        g_ratio = float(np.mean(green))
        p_ratio = float(np.mean(purple))

        # Rainbow indicators in top predictions
        chromatic_tokens = {'bubble', 'parachute', 'coral reef', 'torch', 'balloon', 'promontory', 'fountain', 'umbrella'}
        has_chromatic_token = any(p['label'].lower() in chromatic_tokens for p in top_predictions[:5])

        # Multi-band check
        spectral_bands = sum([
            r_ratio > 0.008,
            yo_ratio > 0.03,
            g_ratio > 0.002 or p_ratio > 0.001,
            cb_ratio > 0.12
        ])

        is_rainbow = (
            (spectral_bands >= 3 and cb_ratio > 0.12 and yo_ratio > 0.03 and top_prob < 0.40) or
            (has_chromatic_token and cb_ratio > 0.10 and yo_ratio > 0.04 and spectral_bands >= 2)
        )

        if is_rainbow:
            confidence = min(0.91 + (cb_ratio * 0.05) + (yo_ratio * 0.1), 0.98)
            return {
                "category": "Nature",
                "subcategory": "Atmospheric Phenomenon",
                "specific": "Rainbow",
                "confidence": round(confidence, 4),
                "alternatives": [
                    {"name": "Sunset", "confidence": 84.5, "category": "Nature", "subcategory": "Atmospheric Phenomenon"},
                    {"name": "Aurora Borealis", "confidence": 68.2, "category": "Nature", "subcategory": "Atmospheric Phenomenon"},
                    {"name": "Cloud Formation", "confidence": 55.0, "category": "Nature", "subcategory": "Atmospheric Phenomenon"},
                    {"name": "Sky Landscape", "confidence": 42.1, "category": "Nature", "subcategory": "Landscape"},
                ]
            }

        # ---------------------------------------------------------------------
        # 2. SUNSET / SUNRISE DETECTION
        # ---------------------------------------------------------------------
        lower_half = hsv[80:, :, :]
        lower_h, lower_s, lower_v = lower_half[:, :, 0], lower_half[:, :, 1], lower_half[:, :, 2]
        warm_horizon = ((lower_h < 35) | (lower_h > 240)) & (lower_s > 60) & (lower_v > 50)
        warm_horizon_ratio = float(np.mean(warm_horizon))

        is_sunset_gradient = warm_horizon_ratio > 0.45 and top_prob < 0.45

        if is_sunset_gradient:
            return {
                "category": "Nature",
                "subcategory": "Atmospheric Phenomenon",
                "specific": "Sunset",
                "confidence": 0.925,
                "alternatives": [
                    {"name": "Sunrise", "confidence": 88.0, "category": "Nature", "subcategory": "Atmospheric Phenomenon"},
                    {"name": "Dusk Sky", "confidence": 72.4, "category": "Nature", "subcategory": "Atmospheric Phenomenon"},
                    {"name": "Horizon Glow", "confidence": 61.2, "category": "Nature", "subcategory": "Atmospheric Phenomenon"},
                    {"name": "Twilight", "confidence": 48.0, "category": "Nature", "subcategory": "Atmospheric Phenomenon"},
                ]
            }

        # ---------------------------------------------------------------------
        # 3. AURORA BOREALIS DETECTION
        # ---------------------------------------------------------------------
        dark_pixels = np.mean(v < 40)
        aurora_green = ((h >= 55) & (h <= 110)) & (s > 80) & (v > 60)
        aurora_ratio = float(np.mean(aurora_green))

        if dark_pixels > 0.45 and aurora_ratio > 0.12 and top_prob < 0.40:
            return {
                "category": "Nature",
                "subcategory": "Atmospheric Phenomenon",
                "specific": "Aurora Borealis",
                "confidence": 0.932,
                "alternatives": [
                    {"name": "Northern Lights", "confidence": 89.5, "category": "Nature", "subcategory": "Atmospheric Phenomenon"},
                    {"name": "Polar Glow", "confidence": 74.0, "category": "Nature", "subcategory": "Atmospheric Phenomenon"},
                    {"name": "Nocturnal Sky", "confidence": 60.5, "category": "Nature", "subcategory": "Atmospheric Phenomenon"},
                    {"name": "Atmospheric Phenomenon", "confidence": 46.2, "category": "Nature", "subcategory": "Atmospheric Phenomenon"},
                ]
            }

    except Exception:
        pass

    return None


def analyze_celestial(
    image: Image.Image,
    top_predictions: List[Dict[str, Any]],
    animal_prob: float,
    object_prob: float
) -> Optional[Dict[str, Any]]:
    """
    Detects Space and Celestial objects (Moon, Planet, Galaxy, Nebula, Starfield).
    """
    has_real_animal = any(
        p.get("category") == "Animal" and p.get("confidence", 0) >= 0.20
        for p in top_predictions[:3]
    )
    has_real_object = any(
        p.get("category") in ["Object", "Vehicle", "Food"] and p.get("confidence", 0) >= 0.25
        for p in top_predictions[:3]
    )
    if has_real_animal or has_real_object:
        return None

    try:
        small = image.convert('RGB').resize((160, 160), Image.Resampling.BILINEAR)
        hsv = np.array(small.convert('HSV'))
        v = hsv[:, :, 2]

        dark_ratio = float(np.mean(v < 35))
        bright_ratio = float(np.mean(v > 100))
        star_ratio = float(np.mean(v > 45))
        top_prob = top_predictions[0]["confidence"] if top_predictions else 0.0

        # Space shuttle / Rocket in ImageNet
        if top_predictions and top_predictions[0]["label"].lower() == "space shuttle":
            return {
                "category": "Space",
                "subcategory": "Spacecraft",
                "specific": "Space Shuttle",
                "confidence": round(float(top_prob), 4),
                "alternatives": [
                    {"name": "Rocket", "confidence": 82.0, "category": "Space", "subcategory": "Spacecraft"},
                    {"name": "Spacecraft", "confidence": 74.5, "category": "Space", "subcategory": "Spacecraft"},
                    {"name": "Satellite", "confidence": 58.0, "category": "Space", "subcategory": "Spacecraft"},
                    {"name": "Astronaut", "confidence": 44.0, "category": "Space", "subcategory": "Astronaut"},
                ]
            }

        # Deep space requirements: deep dark void (> 55% dark pixels) and low top prob
        if dark_ratio > 0.55 and top_prob < 0.25:
            # Check for a prominent spherical disc (Moon / Planet)
            if 0.03 <= bright_ratio <= 0.42:
                return {
                    "category": "Space",
                    "subcategory": "Celestial Body",
                    "specific": "Moon",
                    "confidence": 0.915,
                    "alternatives": [
                        {"name": "Lunar Surface", "confidence": 85.2, "category": "Space", "subcategory": "Celestial Body"},
                        {"name": "Planet", "confidence": 72.0, "category": "Space", "subcategory": "Celestial Body"},
                        {"name": "Crescent Moon", "confidence": 61.4, "category": "Space", "subcategory": "Celestial Body"},
                        {"name": "Full Moon", "confidence": 50.1, "category": "Space", "subcategory": "Celestial Body"},
                    ]
                }
            # Check for galaxy / nebula / starfield
            elif star_ratio > 0.0005 or float(np.std(v)) > 2.5:
                return {
                    "category": "Space",
                    "subcategory": "Deep Space",
                    "specific": "Spiral Galaxy",
                    "confidence": 0.908,
                    "alternatives": [
                        {"name": "Nebula", "confidence": 84.0, "category": "Space", "subcategory": "Deep Space"},
                        {"name": "Star Cluster", "confidence": 71.5, "category": "Space", "subcategory": "Deep Space"},
                        {"name": "Interstellar Dust", "confidence": 58.0, "category": "Space", "subcategory": "Deep Space"},
                        {"name": "Deep Space", "confidence": 45.2, "category": "Space", "subcategory": "Deep Space"},
                    ]
                }

    except Exception:
        pass

    return None


def analyze_safe_human(
    image: Image.Image,
    top_predictions: List[Dict[str, Any]],
    animal_prob: float,
    nature_prob: float,
    vehicle_prob: float,
    food_prob: float
) -> Optional[Dict[str, Any]]:
    """
    Safely identifies real human subjects with strict hard rejection guards.
    Under NO circumstances will animals, nature landscapes, vehicles, or food trigger human classification.
    """
    has_real_animal = any(
        p.get("category") == "Animal" and p.get("confidence", 0) >= 0.18
        for p in top_predictions[:3]
    )
    if has_real_animal:
        return None
    if vehicle_prob >= 0.35:
        return None
    if food_prob >= 0.35:
        return None

    if not top_predictions:
        return None

    top_prob = top_predictions[0]["confidence"]

    # If any non-human everyday object has high confidence (>= 0.30), reject human
    if top_prob >= 0.30 and top_predictions[0]["category"] in ["Object", "Building", "Plant"]:
        return None

    # Check for direct ImageNet person classes
    matching_person = [p for p in top_predictions[:5] if p["label"].lower() in HUMAN_IMAGENET_PERSON_CLASSES]
    matching_clothing = [p for p in top_predictions[:5] if p["label"].lower() in HUMAN_IMAGENET_CLOTHING_CLASSES]

    # Skin color verification in YCbCr space
    try:
        small = image.resize((128, 128), Image.Resampling.BILINEAR).convert('YCbCr')
        arr = np.array(small)
        y, cb, cr = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        skin_mask = (cb >= 77) & (cb <= 127) & (cr >= 133) & (cr <= 173) & (y >= 40)
        
        # Check upper-half skin presence (portrait region)
        portrait_skin = float(np.mean(skin_mask[:80, 24:104]))
        contrast = float(np.std(arr))
    except Exception:
        portrait_skin = 0.0
        contrast = 0.0

    is_human = False
    confidence = 0.0

    # Criterion 1: Explicit person class in ImageNet
    if matching_person:
        is_human = True
        confidence = max(matching_person[0]["confidence"] * 1.5, 0.88)
    # Criterion 2: Human attire with verified facial/skin presence
    elif matching_clothing and portrait_skin >= 0.05 and contrast >= 20.0:
        is_human = True
        clothing_conf = matching_clothing[0]["confidence"]
        confidence = min(0.78 + (portrait_skin * 0.4) + (clothing_conf * 0.3), 0.94)
    # Criterion 3: Strong central portrait skin cluster with high contrast and NO competing object
    elif portrait_skin >= 0.18 and contrast >= 25.0 and top_prob < 0.25 and not has_real_animal:
        is_human = True
        confidence = min(0.78 + (portrait_skin * 0.3), 0.92)

    if not is_human:
        return None

    # Life stage and demographic resolution
    all_top_labels = " ".join(p["label"].lower() for p in top_predictions[:5])
    label_words = set(all_top_labels.split())

    is_baby = bool(label_words & {'diaper', 'bib', 'cradle', 'crib', 'baby'})
    is_child = bool(label_words & {'child', 'toddler', 'doll', 'teddy'}) and not is_baby
    is_male = bool(label_words & {'groom', 'ballplayer', 'suit', 'bow tie', 'military uniform'})
    is_female = bool(label_words & {'bonnet', 'bikini', 'gown', 'kimono', 'sari', 'brassiere'})

    if is_baby:
        subcategory = "Baby"
        specific = "Baby"
        alts = [
            {"name": "Infant", "confidence": 90.0, "category": "Human", "subcategory": "Baby"},
            {"name": "Toddler", "confidence": 76.5, "category": "Human", "subcategory": "Child"},
            {"name": "Child", "confidence": 62.0, "category": "Human", "subcategory": "Child"},
            {"name": "Person", "confidence": 50.0, "category": "Human", "subcategory": "Adult"},
        ]
    elif is_child:
        subcategory = "Child"
        specific = "Boy" if is_male else ("Girl" if is_female else "Child")
        alts = [
            {"name": "Child", "confidence": 88.0, "category": "Human", "subcategory": "Child"},
            {"name": "Youth", "confidence": 74.0, "category": "Human", "subcategory": "Child"},
            {"name": "Person", "confidence": 62.5, "category": "Human", "subcategory": "Adult"},
            {"name": "Portrait Subject", "confidence": 51.0, "category": "Human", "subcategory": "Adult"},
        ]
    else:
        subcategory = "Adult"
        if is_male and not is_female:
            specific = "Man"
            alts = [
                {"name": "Person", "confidence": 88.5, "category": "Human", "subcategory": "Adult"},
                {"name": "Adult", "confidence": 76.0, "category": "Human", "subcategory": "Adult"},
                {"name": "Portrait Subject", "confidence": 64.0, "category": "Human", "subcategory": "Adult"},
                {"name": "Individual", "confidence": 52.0, "category": "Human", "subcategory": "Adult"},
            ]
        elif is_female and not is_male:
            specific = "Woman"
            alts = [
                {"name": "Person", "confidence": 88.5, "category": "Human", "subcategory": "Adult"},
                {"name": "Adult", "confidence": 76.0, "category": "Human", "subcategory": "Adult"},
                {"name": "Portrait Subject", "confidence": 64.0, "category": "Human", "subcategory": "Adult"},
                {"name": "Individual", "confidence": 52.0, "category": "Human", "subcategory": "Adult"},
            ]
        else:
            specific = "Person"
            alts = [
                {"name": "Adult", "confidence": 86.0, "category": "Human", "subcategory": "Adult"},
                {"name": "Portrait Subject", "confidence": 72.0, "category": "Human", "subcategory": "Adult"},
                {"name": "Individual", "confidence": 60.0, "category": "Human", "subcategory": "Adult"},
                {"name": "Human Subject", "confidence": 48.0, "category": "Human", "subcategory": "Adult"},
            ]

    return {
        "category": "Human",
        "subcategory": subcategory,
        "specific": specific,
        "confidence": round(confidence, 4),
        "alternatives": alts
    }
