"""
Taxonomy definitions and ImageNet-1K Hierarchical Class Mapping
for IMGX.AI General-Purpose Hierarchical Image Classification System.

Taxonomy structure:
- Level 1: Category (Animal, Bird, Human, Plant, Object, Vehicle, Food, Building, Nature, Other, Unknown)
- Level 2: Subcategory (Dog, Cat, Furniture, Electronics, Appliance, Clothing, Car, etc.)
- Level 3: Specific Class / Type / Breed
"""

from typing import Dict, Any, Tuple, Optional

# Supported Level 1 Categories
LEVEL_1_CATEGORIES = [
    "Animal",
    "Bird",
    "Human",
    "Plant",
    "Object",
    "Vehicle",
    "Food",
    "Building",
    "Nature",
    "Space",
    "Other",
    "Unknown"
]

def format_clean_title(raw: str) -> str:
    """Format raw label strings like 'golden_retriever' or 'Persian_cat' into clean titles."""
    words = raw.replace("_", " ").replace("-", " ").split()
    return " ".join(w.capitalize() for w in words)


def map_imagenet_class(idx: int, raw_name: str) -> Tuple[str, str, str]:
    """
    Deterministically map an ImageNet-1K class index and label to:
    (Category, Subcategory, Specific)
    """
    name = raw_name.lower().replace("_", " ")

    # -------------------------------------------------------------------------
    # 1. BIRDS (ImageNet ranges: 7-24, 80-100, 127-146)
    # -------------------------------------------------------------------------
    bird_ranges = (
        (7 <= idx <= 24) or 
        (80 <= idx <= 100) or 
        (127 <= idx <= 146)
    )
    if bird_ranges or any(k in name for k in ['bird', 'parrot', 'eagle', 'hawk', 'owl', 'macaw', 'cockatoo', 'toucan', 'hummingbird', 'kingfisher']):
        if any(w in name for w in ['african grey', 'macaw', 'cockatoo', 'lorikeet', 'parrot', 'parakeet']):
            sub = "Parrot"
        elif any(w in name for w in ['bald eagle', 'eagle', 'kite', 'vulture', 'hawk']):
            sub = "Eagle"
        elif any(w in name for w in ['owl']):
            sub = "Owl"
        elif any(w in name for w in ['sparrow', 'finch', 'brambling', 'junco', 'bunting', 'robin', 'bulbul', 'jay', 'magpie', 'chickadee', 'water ouzel']):
            sub = "Songbird"
        elif any(w in name for w in ['duck', 'goose', 'swan', 'merganser', 'drake', 'coot', 'gallinule', 'grebe']):
            sub = "Waterfowl"
        elif any(w in name for w in ['toucan', 'hornbill', 'hummingbird', 'bee eater', 'jacamar', 'kingfisher']):
            sub = "Tropical Bird"
        elif any(w in name for w in ['penguin']):
            sub = "Penguin"
        elif any(w in name for w in ['peacock', 'quail', 'partridge', 'grouse', 'ptarmigan']):
            sub = "Gamebird"
        elif any(w in name for w in ['flamingo', 'stork', 'spoonbill', 'heron', 'egret', 'bittern', 'crane']):
            sub = "Wading Bird"
        else:
            sub = "Bird"
        return ("Bird", sub, format_clean_title(raw_name))

    # -------------------------------------------------------------------------
    # 2. ANIMALS
    # -------------------------------------------------------------------------
    # Fish (0-6)
    if 0 <= idx <= 6 or any(w in name for w in ['shark', 'goldfish', 'ray', 'tench', 'trout', 'salmon']):
        return ("Animal", "Fish", format_clean_title(raw_name))

    # Amphibians (25-32)
    if 25 <= idx <= 32 or any(w in name for w in ['salamander', 'newt', 'eft', 'axolotl', 'bullfrog', 'tree frog', 'frog', 'toad']):
        return ("Animal", "Amphibian", format_clean_title(raw_name))

    # Reptiles (33-71)
    if 33 <= idx <= 71 or any(w in name for w in ['turtle', 'terrapin', 'gecko', 'iguana', 'chameleon', 'lizard', 'gila monster', 'dragon', 'alligator', 'crocodile', 'snake', 'python', 'cobra', 'mamba', 'viper', 'boa']):
        return ("Animal", "Reptile", format_clean_title(raw_name))

    # Insects & Arachnids (72-79, 300-326)
    if (72 <= idx <= 79) or (300 <= idx <= 326) or any(w in name for w in ['spider', 'scorpion', 'tick', 'centipede', 'beetle', 'ladybug', 'weevil', 'fly', 'bee', 'ant', 'grasshopper', 'cricket', 'cockroach', 'mantis', 'cicada', 'dragonfly', 'butterfly', 'moth']):
        return ("Animal", "Insect", format_clean_title(raw_name))

    # Crustaceans & Marine Invertebrates (107-126, 327-330)
    if (107 <= idx <= 126) or (327 <= idx <= 330) or any(w in name for w in ['crab', 'lobster', 'crayfish', 'isopod', 'starfish', 'urchin', 'jellyfish', 'anemone', 'coral', 'snail', 'slug', 'nautilus']):
        return ("Animal", "Marine Life", format_clean_title(raw_name))

    # Marine Mammals (147-150)
    if 147 <= idx <= 150 or any(w in name for w in ['whale', 'dugong', 'sea lion', 'seal', 'walrus', 'dolphin']):
        return ("Animal", "Marine Mammal", format_clean_title(raw_name))

    # Dogs (151-268)
    if 151 <= idx <= 268 or any(w in name for w in ['retriever', 'terrier', 'spaniel', 'hound', 'shepherd', 'husky', 'poodle', 'pug', 'collie', 'beagle', 'mastiff', 'bulldog', 'chihuahua', 'malamute', 'rottweiler', 'doberman', 'puppy', 'canine']):
        specific = "Puppy" if "puppy" in name else format_clean_title(raw_name)
        return ("Animal", "Dog", specific)

    # Domestic Cats (281-285)
    if 281 <= idx <= 285 or any(w in name for w in ['persian cat', 'siamese cat', 'tabby', 'tiger cat', 'egyptian cat', 'domestic cat', 'kitten', 'feline', 'kitty']):
        specific = "Kitten" if "kitten" in name else format_clean_title(raw_name)
        return ("Animal", "Cat", specific)

    # Wild Felines (286-293)
    if 286 <= idx <= 293 or any(w in name for w in ['lion', 'tiger', 'cheetah', 'leopard', 'jaguar', 'lynx', 'cougar', 'snow leopard']):
        return ("Animal", "Wild Cat", format_clean_title(raw_name))

    # Wild Canines (269-280)
    if 269 <= idx <= 280 or any(w in name for w in ['wolf', 'coyote', 'dingo', 'dhole', 'hyena', 'fox', 'african hunting dog']):
        return ("Animal", "Wild Canine", format_clean_title(raw_name))

    # Bears (294-297)
    if 294 <= idx <= 297 or any(w in name for w in ['brown bear', 'black bear', 'polar bear', 'ice bear', 'sloth bear', 'grizzly']):
        return ("Animal", "Bear", format_clean_title(raw_name))

    # Elephants (385-386)
    if 385 <= idx <= 386 or 'elephant' in name or 'tusker' in name:
        return ("Animal", "Elephant", format_clean_title(raw_name))

    # Primates (365-384)
    if 365 <= idx <= 384 or any(w in name for w in ['monkey', 'chimpanzee', 'gorilla', 'orangutan', 'gibbon', 'baboon', 'macaque', 'lemur']):
        return ("Animal", "Primate", format_clean_title(raw_name))

    # Ungulates & Herbivores (341-353)
    if 341 <= idx <= 353 or any(w in name for w in ['horse', 'zebra', 'cow', 'ox', 'buffalo', 'bison', 'camel', 'llama', 'sheep', 'ram', 'bighorn', 'ibex', 'goat', 'gazelle', 'antelope', 'impala', 'deer', 'elk', 'pig', 'hog', 'boar', 'hippopotamus']):
        if any(w in name for w in ['horse', 'zebra']):
            sub = "Horse"
        elif any(w in name for w in ['cow', 'ox', 'buffalo', 'bison']):
            sub = "Cow"
        elif any(w in name for w in ['camel', 'llama']):
            sub = "Camel"
        else:
            sub = "Herbivore"
        return ("Animal", sub, format_clean_title(raw_name))

    # Rodents & Small Mammals (331-340, 354-364)
    if (331 <= idx <= 340) or (354 <= idx <= 364) or any(w in name for w in ['rabbit', 'hare', 'hamster', 'mouse', 'rat', 'squirrel', 'marmot', 'beaver', 'guinea pig', 'porcupine', 'otter', 'skunk', 'badger', 'ferret', 'weasel', 'koala', 'wombat', 'wallaby', 'kangaroo', 'panda']):
        if 'panda' in name:
            sub = "Bear"
        elif any(w in name for w in ['rabbit', 'hare']):
            sub = "Rabbit"
        else:
            sub = "Small Mammal"
        return ("Animal", sub, format_clean_title(raw_name))

    # General Animal fallback
    if 0 <= idx <= 397:
        return ("Animal", "Animal", format_clean_title(raw_name))

    # -------------------------------------------------------------------------
    # 3. HUMANS / PERSON REPRESENTATIONS
    # -------------------------------------------------------------------------
    if any(w in name for w in ['baby', 'infant', 'toddler', 'newborn']):
        return ("Human", "Baby", "Baby")
    if any(w in name for w in ['girl', 'schoolgirl']):
        return ("Human", "Child", "Girl")
    if any(w in name for w in ['boy', 'schoolboy']):
        return ("Human", "Child", "Boy")
    if any(w in name for w in ['child', 'kid', 'youth', 'children']):
        return ("Human", "Child", "Child")
    if any(w in name for w in ['woman', 'lady', 'bride', 'female adult', 'businesswoman']):
        return ("Human", "Adult", "Woman")
    words_set = set(name.split())
    if bool(words_set & {'man', 'gentleman', 'groom', 'male', 'businessman'}):
        return ("Human", "Adult", "Man")
    if any(w in name for w in ['scuba diver', 'ballplayer', 'baseball player', 'swimmer', 'person', 'people', 'human', 'adult', 'individual', 'portrait subject']):
        return ("Human", "Adult", format_clean_title(raw_name))

    # -------------------------------------------------------------------------
    # 4. PLANTS & FLOWERS (ImageNet ranges: 984-998)
    # -------------------------------------------------------------------------
    flower_words = ['daisy', 'rose', 'sunflower', "lady's slipper", 'orchid', 'tulip', 'cardoon', 'artichoke', 'blossom', 'petal']
    if any(w in name for w in flower_words) or (984 <= idx <= 987):
        return ("Plant", "Flower", format_clean_title(raw_name))

    fungi_words = ['fungus', 'agaric', 'gyromitra', 'stinkhorn', 'earthstar', 'hen-of-the-woods', 'bolete', 'mushroom']
    if any(w in name for w in fungi_words) or (991 <= idx <= 998):
        return ("Plant", "Fungus", format_clean_title(raw_name))

    if (988 <= idx <= 990) or any(w in name for w in ['corn', 'acorn', 'rapeseed', 'grass', 'tree', 'shrub', 'leaf', 'fern']):
        return ("Plant", "Plant", format_clean_title(raw_name))

    # -------------------------------------------------------------------------
    # 5. VEHICLES & TRANSPORT
    # -------------------------------------------------------------------------
    vehicle_keywords = [
        'car', 'coupe', 'convertible', 'sedan', 'limousine', 'sports car', 'racer',
        'minivan', 'jeep', 'truck', 'cab', 'bus', 'train', 'locomotive', 'aircraft',
        'airliner', 'warplane', 'airplane', 'helicopter', 'boat', 'ship', 'canoe',
        'yacht', 'speedboat', 'submarine', 'bicycle', 'motorcycle', 'scooter', 'moped',
        'tricycle', 'cart', 'wheelbarrow', 'tractor', 'trailer', 'ambulance', 'fire engine',
        'forklift', 'garbage truck', 'half track', 'snowplow', 'tank', 'unicycle', 'van', 'wagon'
    ]
    if any(w in name for w in vehicle_keywords):
        if any(w in name for w in ['sports car', 'racer', 'convertible', 'coupe', 'sedan', 'limousine', 'cab', 'taxi', 'car', 'minivan', 'model t']):
            sub = "Car"
        elif any(w in name for w in ['motorcycle', 'moped', 'scooter']):
            sub = "Motorcycle"
        elif any(w in name for w in ['bicycle', 'mountain bike', 'tricycle', 'unicycle']):
            sub = "Bicycle"
        elif any(w in name for w in ['bus', 'minibus', 'trolleybus', 'coach']):
            sub = "Bus"
        elif any(w in name for w in ['truck', 'trailer', 'tractor', 'garbage truck', 'fire engine', 'snowplow', 'ambulance', 'pickup']):
            sub = "Truck"
        elif any(w in name for w in ['train', 'locomotive', 'freight car', 'passenger car', 'subway']):
            sub = "Train"
        elif any(w in name for w in ['aircraft', 'airliner', 'warplane', 'airplane', 'wing', 'space shuttle', 'balloon', 'glider']):
            sub = "Aircraft"
        elif any(w in name for w in ['boat', 'ship', 'canoe', 'yacht', 'speedboat', 'submarine', 'lifeboat', 'gondola', 'catamaran', 'schooner', 'trimaran', 'yawl']):
            sub = "Boat"
        else:
            sub = "Vehicle"
        return ("Vehicle", sub, format_clean_title(raw_name))

    # -------------------------------------------------------------------------
    # 6. FOOD & BEVERAGES
    # -------------------------------------------------------------------------
    food_keywords = [
        'pizza', 'bagel', 'pretzel', 'hotdog', 'ice cream', 'burrito', 'espresso',
        'guacamole', 'apple', 'banana', 'strawberry', 'orange', 'lemon', 'fig',
        'pineapple', 'pomegranate', 'custard apple', 'jackfruit', 'cucumber', 'bell pepper',
        'head cabbage', 'broccoli', 'cauliflower', 'zucchini', 'spaghetti squash',
        'acorn squash', 'butternut squash', 'cheeseburger', 'hot pot', 'trifle', 'ice lolly',
        'french loaf', 'meat loaf', 'potpie', 'consomme', 'carbonara', 'sandwich'
    ]
    if any(w in name for w in food_keywords) or (923 <= idx <= 969):
        if any(w in name for w in ['apple', 'banana', 'strawberry', 'orange', 'lemon', 'fig', 'pineapple', 'pomegranate', 'jackfruit', 'custard apple']):
            sub = "Fruit"
        elif any(w in name for w in ['cucumber', 'bell pepper', 'cabbage', 'broccoli', 'cauliflower', 'zucchini', 'squash', 'corn', 'artichoke', 'cardoon']):
            sub = "Vegetable"
        elif any(w in name for w in ['ice cream', 'trifle', 'ice lolly', 'confectionery', 'chocolate', 'cake', 'cookie']):
            sub = "Dessert"
        elif any(w in name for w in ['espresso', 'coffee', 'cocktail', 'red wine', 'beer', 'cup', 'goblet', 'water jug']):
            sub = "Beverage"
        else:
            sub = "Prepared Food"
        return ("Food", sub, format_clean_title(raw_name))

    # -------------------------------------------------------------------------
    # 7. BUILDINGS & ARCHITECTURE
    # -------------------------------------------------------------------------
    building_words = [
        'church', 'mosque', 'palace', 'castle', 'monastery', 'shrine', 'tomb',
        'barn', 'greenhouse', 'lighthouse', 'boathouse', 'prison', 'restaurant',
        'cinema', 'bakery', 'barbershop', 'bookshop', 'butcher shop', 'confectionery',
        'grocery store', 'shoe shop', 'tobacco shop', 'toyshop', 'dam', 'pier',
        'suspension bridge', 'steel arch bridge', 'viaduct', 'beacon', 'drilling platform',
        'water tower', 'cliff dwelling', 'thatch', 'yurt'
    ]
    if any(w in name for w in building_words):
        return ("Building", "Architecture", format_clean_title(raw_name))

    # -------------------------------------------------------------------------
    # 7.5 NATURE & ATMOSPHERE
    # -------------------------------------------------------------------------
    atmospheric_words = [
        'rainbow', 'sunset', 'sunrise', 'aurora', 'northern lights', 'cloud', 'clouds', 'sky',
        'lightning', 'storm', 'rain', 'snow', 'twilight', 'dusk', 'horizon glow', 'cumulus'
    ]
    if any(w in name for w in atmospheric_words):
        return ("Nature", "Atmospheric Phenomenon", format_clean_title(raw_name))

    nature_words = [
        'volcano', 'valley', 'promontory', 'lakeshore', 'seashore', 'sandbar',
        'coral reef', 'alp', 'geyser', 'mountain', 'forest', 'woods', 'jungle',
        'river', 'waterfall', 'beach', 'ocean', 'landscape'
    ]
    if any(w in name for w in nature_words) or (970 <= idx <= 980):
        return ("Nature", "Landscape", format_clean_title(raw_name))

    # -------------------------------------------------------------------------
    # 7.6 SPACE & CELESTIAL OBJECTS
    # -------------------------------------------------------------------------
    space_multi_words = [
        'space shuttle', 'astronaut', 'rocket', 'spacecraft', 'satellite',
        'moon', 'planet', 'earth', 'mars', 'jupiter', 'saturn', 'venus', 'mercury',
        'galaxy', 'spiral galaxy', 'nebula', 'starfield', 'constellation',
        'asteroid', 'meteor', 'comet', 'deep space', 'lunar'
    ]
    name_words = set(name.split())
    is_space_word = any(w in name for w in space_multi_words) or bool(name_words & {'sun', 'star', 'stars', 'orbit'})
    if is_space_word or idx == 812:
        if any(w in name for w in ['space shuttle', 'rocket', 'spacecraft', 'satellite']):
            sub = "Spacecraft"
        elif any(w in name for w in ['astronaut', 'cosmonaut', 'spacewalker']):
            sub = "Astronaut"
        elif any(w in name for w in ['galaxy', 'nebula', 'star', 'stars', 'starfield', 'constellation', 'deep space']):
            sub = "Deep Space"
        else:
            sub = "Celestial Body"
        return ("Space", sub, format_clean_title(raw_name))

    # -------------------------------------------------------------------------
    # 9. OBJECTS (Categorized into subcategories)
    # -------------------------------------------------------------------------
    # Electronics
    if any(w in name for w in ['laptop', 'notebook', 'desktop', 'computer', 'keyboard', 'mouse', 'monitor', 'screen', 'television', 'cellular telephone', 'cell phone', 'phone', 'ipod', 'hard disc', 'modem', 'printer', 'cassette', 'tape player', 'loudspeaker', 'microphone', 'radio', 'remote control', 'joystick', 'camera', 'reflex camera']):
        return ("Object", "Electronics", format_clean_title(raw_name))

    # Furniture
    if any(w in name for w in ['chair', 'table', 'desk', 'sofa', 'couch', 'bench', 'bookcase', 'wardrobe', 'bed', 'cradle', 'crib', 'cabinet', 'throne', 'stool', 'chiffonier', 'file']):
        return ("Object", "Furniture", format_clean_title(raw_name))

    # Appliances
    if any(w in name for w in ['fan', 'vacuum', 'microwave', 'toaster', 'refrigerator', 'dishwasher', 'washing machine', 'iron', 'sewing machine', 'heater', 'stove', 'oven', 'air conditioner', 'blender', 'coffeepot', 'coffee maker', 'electric fan']):
        return ("Object", "Appliance", format_clean_title(raw_name))

    # Clothing & Personal Wear
    if any(w in name for w in ['suit', 'coat', 'jacket', 'jean', 'pants', 'trousers', 'skirt', 'dress', 'shirt', 'sweater', 'sweatshirt', 'jersey', 'sock', 'shoe', 'boot', 'sandal', 'hat', 'cap', 'helmet', 'glove', 'mitten', 'scarf', 'tie', 'belt', 'apron', 'diaper', 'bib', 'kimono', 'sari', 'cloak', 'gown', 'cardigan', 'bikini', 'swimsuit', 'trunks', 'sunglasses', 'wig', 'bonnet', 'sombrero', 'mortarboard', 'brassiere', 'buckle', 'purse', 'wallet', 'backpack']):
        return ("Object", "Clothing", format_clean_title(raw_name))

    # Musical Instruments
    if any(w in name for w in ['guitar', 'piano', 'violin', 'cello', 'harp', 'drum', 'flute', 'trumpet', 'saxophone', 'accordion', 'banjo', 'harmonica', 'organ', 'trombone', 'oboe', 'bassoon', 'cornet', 'french horn', 'marimba', 'chime']):
        return ("Object", "Musical Instrument", format_clean_title(raw_name))

    # Sports Equipment
    if any(w in name for w in ['ball', 'racket', 'bat', 'helmet', 'ski', 'snowboard', 'skateboard', 'surfboard', 'dumbbell', 'barbell', 'puck', 'bow', 'arrow', 'croquet ball', 'golf ball', 'ping pong ball', 'rugby ball', 'soccer ball', 'tennis ball', 'volleyball']):
        return ("Object", "Sports Equipment", format_clean_title(raw_name))

    # Tools
    if any(w in name for w in ['hammer', 'saw', 'wrench', 'screwdriver', 'pliers', 'axe', 'shovel', 'rake', 'drill', 'chisel', 'plane', 'spatula', 'syringe', 'cleaver', 'can opener', 'corkscrew', 'lawn mower', 'plow']):
        return ("Object", "Tool", format_clean_title(raw_name))

    # Stationery & Office
    if any(w in name for w in ['pen', 'pencil', 'eraser', 'notebook', 'paper', 'envelope', 'folder', 'stapler', 'scissors', 'binder', 'rubber eraser', 'pencil box', 'pencil sharpener']):
        return ("Object", "Stationery", format_clean_title(raw_name))

    # Toys
    if any(w in name for w in ['teddy', 'doll', 'puppet', 'balloon', 'jigsaw puzzle', 'maraca', 'yo-yo', 'pinwheel']):
        return ("Object", "Toy", format_clean_title(raw_name))

    # Household & Everyday Objects
    if any(w in name for w in ['clock', 'watch', 'sundial', 'timer', 'hourglass', 'pillow', 'cushion', 'quilt', 'blanket', 'vase', 'lamp', 'candle', 'curtain', 'mirror', 'soap', 'towel', 'basket', 'bucket', 'cup', 'mug', 'plate', 'bowl', 'pitcher', 'pot', 'pan', 'bottle', 'jar', 'broom', 'dustpan', 'umbrella', 'broom', 'barrel', 'tub', 'toilet paper', 'tissue', 'trophy']):
        return ("Object", "Household Object", format_clean_title(raw_name))

    # Default fallback for objects
    return ("Object", "Everyday Object", format_clean_title(raw_name))


# Cache map computed on import
_INDEX_TAXONOMY_MAP: Optional[Dict[int, Dict[str, str]]] = None


def get_taxonomy_for_index(idx: int, raw_name: str) -> Dict[str, str]:
    """Retrieve or compute the structured hierarchy for an ImageNet class index."""
    cat, sub, specific = map_imagenet_class(idx, raw_name)
    return {
        "category": cat,
        "subcategory": sub,
        "specific": specific,
    }


def get_taxonomy_for_label(raw_name: str) -> Dict[str, str]:
    """Taxonomy resolution by keyword analysis (useful for external models or fallbacks)."""
    cat, sub, specific = map_imagenet_class(999, raw_name)
    return {
        "category": cat,
        "subcategory": sub,
        "specific": specific,
    }
