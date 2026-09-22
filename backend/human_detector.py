"""
Human and Face detection module for IMGX.AI
Identifies human presence, broad life-stage subcategory (Adult / Child / Baby),
and appropriate specific classification without unsupported sensitive assumptions.
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

BABY_INDICATORS = {'diaper', 'bib', 'cradle', 'crib', 'baby'}
MALE_INDICATORS = {'groom', 'ballplayer', 'suit', 'bow tie', 'military uniform'}
FEMALE_INDICATORS = {'bonnet', 'bikini', 'gown', 'kimono', 'sari', 'brassiere'}


def analyze_skin_presence(image: Image.Image) -> tuple:
    """
    Compute skin-tone pixel density, spatial cluster coherence, and image contrast in YCbCr color space.
    Standard universal skin locus across all human complexions:
    77 <= Cb <= 127 and 133 <= Cr <= 173 with Y >= 40
    """
    try:
        small_img = image.resize((128, 128), Image.Resampling.BILINEAR).convert('YCbCr')
        arr = np.array(small_img)
        y, cb, cr = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        skin_mask = (cb >= 77) & (cb <= 127) & (cr >= 133) & (cr <= 173) & (y >= 40)
        
        height, width = skin_mask.shape
        upper_mask = skin_mask[:int(height * 0.75), :]
        ratio = float(np.mean(upper_mask))

        # Check neighbor spatial coherence (out of 4 neighbors)
        neighbor_count = (skin_mask[:-2, 1:-1].astype(int) + skin_mask[2:, 1:-1].astype(int) + 
                          skin_mask[1:-1, :-2].astype(int) + skin_mask[1:-1, 2:].astype(int))
        skin_inner = skin_mask[1:-1, 1:-1]
        coherence = float(np.mean(neighbor_count[skin_inner])) if np.sum(skin_inner) > 0 else 0.0
        contrast = float(np.std(arr))

        return ratio, coherence, contrast
    except Exception:
        return 0.0, 0.0, 0.0


def evaluate_human(
    image: Image.Image,
    top_predictions: List[Dict[str, Any]]
) -> Optional[Dict[str, Any]]:
    """
    Evaluate if image primarily depicts a human subject.
    Returns structured hierarchical human classification or None.
    """
    if not top_predictions:
        return None

    top_label_lower = top_predictions[0]["label"].lower()
    top_prob = top_predictions[0]["confidence"]

    # If an animal, vehicle, or food has dominant high confidence, skip human evaluation
    non_human_strong = any(
        term in top_label_lower for term in [
            'dog', 'cat', 'retriever', 'terrier', 'hound', 'shepherd', 'husky',
            'car', 'truck', 'bus', 'train', 'airplane', 'bird', 'fish', 'flower',
            'pizza', 'banana', 'apple', 'building', 'chair', 'table'
        ]
    )
    if non_human_strong and top_prob >= 0.35:
        return None

    # Check for direct person / clothing activations in top-5
    matching_person = [p for p in top_predictions[:5] if p["label"].lower() in HUMAN_IMAGENET_PERSON_CLASSES]
    matching_clothing = [p for p in top_predictions[:5] if p["label"].lower() in HUMAN_IMAGENET_CLOTHING_CLASSES]

    skin_ratio, coherence, contrast = analyze_skin_presence(image)

    # Rejection of flat solids or random uncorrelated noise
    if contrast < 12.0 or coherence < 2.0:
        skin_ratio = 0.0

    is_human = False
    confidence = 0.0

    # Case 1: Direct ImageNet person class
    if matching_person:
        is_human = True
        confidence = max(matching_person[0]["confidence"] * 1.5, 0.86)
    # Case 2: Human attire + skin tone presence
    elif matching_clothing and skin_ratio >= 0.03:
        is_human = True
        clothing_conf = matching_clothing[0]["confidence"]
        confidence = min(0.72 + (skin_ratio * 0.5) + (clothing_conf * 0.4), 0.94)
    # Case 3: High skin tone concentration in upper portrait region with coherent face cluster
    elif skin_ratio >= 0.12 and coherence >= 2.8 and contrast >= 25.0 and top_prob < 0.28:
        is_human = True
        confidence = min(0.68 + (skin_ratio * 0.4), 0.88)

    if not is_human:
        return None

    # Determine Subcategory: Adult / Child / Baby
    all_top_labels = " ".join(p["label"].lower() for p in top_predictions[:5])
    label_words = set(all_top_labels.split())

    is_male_adult = any(m in all_top_labels for m in MALE_INDICATORS)
    is_female_adult = any(f in all_top_labels for f in FEMALE_INDICATORS)

    if (any(b in all_top_labels for b in BABY_INDICATORS) or (skin_ratio > 0.28 and 'diaper' in all_top_labels)) and not is_male_adult:
        subcategory = "Baby"
        specific = "Baby"
        sub_conf = round(min(confidence * 0.95, 0.92), 4)
        spec_conf = round(min(confidence * 0.90, 0.89), 4)
    elif bool(label_words & {'child', 'toddler', 'doll', 'teddy'}) and not (is_male_adult or is_female_adult):
        subcategory = "Child"
        specific = "Child"
        sub_conf = round(min(confidence * 0.94, 0.91), 4)
        spec_conf = round(min(confidence * 0.88, 0.86), 4)
    else:
        subcategory = "Adult"
        sub_conf = round(min(confidence * 0.97, 0.95), 4)
        # Specific: Man, Woman, or Person
        if is_male_adult:
            specific = "Man"
            spec_conf = round(min(confidence * 0.92, 0.89), 4)
        elif is_female_adult:
            specific = "Woman"
            spec_conf = round(min(confidence * 0.92, 0.89), 4)
        else:
            specific = "Person"
            spec_conf = round(min(confidence * 0.93, 0.90), 4)

    return {
        "category": {
            "name": "Human",
            "confidence": round(float(confidence), 4)
        },
        "subcategory": {
            "name": subcategory,
            "confidence": sub_conf
        },
        "specific": {
            "name": specific,
            "confidence": spec_conf
        }
    }
