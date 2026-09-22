# IMGX.AI — General-Purpose Hierarchical Image Classification System

## 1. Overview
IMGX.AI has been upgraded from a dog-breed-only image classifier into a **General-Purpose Hierarchical Image Classification System**. The system dynamically analyzes an input image without pre-assuming its taxonomic identity, classifying concepts across three cascading levels:
- **Level 1: Category** (`Animal`, `Bird`, `Human`, `Plant`, `Object`, `Vehicle`, `Food`, `Building`, `Nature`, `Other`, `Unknown`)
- **Level 2: Subcategory** (`Dog`, `Cat`, `Furniture`, `Electronics`, `Appliance`, `Clothing`, `Car`, `Bicycle`, `Flower`, `Adult`, `Child`, `Baby`, etc.)
- **Level 3: Specific Class / Type / Breed** (`Golden Retriever`, `Persian Cat`, `Electric Fan`, `Office Chair`, `Wall Clock`, `Laptop`, `Pizza`, etc.)

---

## 2. Model Used & Architectural Selection
- **Backbone Model**: Pretrained deep residual convolutional neural network (`ResNet-50`) with weights pretrained on ImageNet-1K (1,000 distinct real-world classes).
- **Inference Engine**: PyTorch 2.14 / Torchvision with Apple Silicon Metal Performance Shaders (`mps`) hardware acceleration, falling back gracefully to CPU.
- **Why Selected**:
  1. **Broad Object Recognition**: Covers 1,000 object, animal, vehicle, food, and environmental classes rather than a narrow single-domain set.
  2. **Zero Cold-Start Overhead**: Model initialized and GPU kernel pre-warmed once upon server startup (`@asynccontextmanager lifespan`).
  3. **Deterministic Local Execution**: Runs entirely in the local environment with zero third-party cloud API costs, no network dependencies, and strict data privacy.
  4. **Multi-Task Augmentation**: Augmented with a specialized Human & Face Vision Analyzer and Multi-Object Co-occurrence detector.

---

## 3. Image Preprocessing & Tensor Pipeline
1. **Input Ingestion**: File read as raw binary buffer via `multipart/form-data`.
2. **Integrity Validation**: Evaluated via Pillow (`Image.open(buffer).verify()`) to reject corrupted files, oversized payloads (> 15MB), or unsupported formats.
3. **Spatial Normalization**: Downscaled if image dimensions exceed 768px for fast preprocessing; interpolated to \(224 \times 224\) pixels.
4. **Color Conversion**: Converted to 3-channel RGB format.
5. **ImageNet Z-Score Normalization**:
   \[
   x_{\text{norm}} = \frac{x / 255.0 - \mu}{\sigma}
   \]
   where \(\mu = [0.485, 0.456, 0.406]\) and \(\sigma = [0.229, 0.224, 0.225]\).

---

## 4. Hierarchical Classification Pipeline

```
               UPLOAD IMAGE
                    ↓
            IMAGE VALIDATION
                    ↓
           IMAGE PREPROCESSING
                    ↓
      DEEP CONVOLUTIONAL FORWARD PASS
                    ↓
          1000-CLASS SOFTMAX P(i)
                    ↓
       ┌──────────────────────────┐
       │  HUMAN VISION EVALUATION │
       └──────────────────────────┘
                    ↓
      ┌────────────────────────────┐
      │ LEVEL 1: CATEGORY AGGREGATE│ P(Category) = ∑ P(i)
      └────────────────────────────┘
                    ↓
      ┌────────────────────────────┐
      │ LEVEL 2: SUBCATEGORY PROB  │ P(Subcategory | Category)
      └────────────────────────────┘
                    ↓
      ┌────────────────────────────┐
      │ LEVEL 3: SPECIFIC CLASS    │ P(Specific) = P(k)
      └────────────────────────────┘
                    ↓
      ┌────────────────────────────┐
      │ UNKNOWN / REJECTION CHECK  │ Rejects low confidence
      └────────────────────────────┘
                    ↓
      ┌────────────────────────────┐
      │ MULTI-OBJECT DETECTIONS    │ Co-occurring candidates
      └────────────────────────────┘
                    ↓
         STRUCTURED JSON RESPONSE
```

---

## 5. Taxonomy Hierarchy Structure

### Level 1 Categories
- **Animal**: Domestic & wild animals, fish, reptiles, amphibians, insects, crustaceans.
- **Bird**: Songbirds, raptors, waterfowl, parrots, tropical birds.
- **Human**: Adults, children, infants, portraits, person representations.
- **Plant**: Flowers, fungi, trees, crops, foliage.
- **Object**: Electronics, furniture, appliances, clothing, tools, musical instruments, household items, sports equipment, stationery, toys.
- **Vehicle**: Cars, motorcycles, bicycles, trucks, buses, trains, aircraft, boats.
- **Food**: Fruits, vegetables, prepared foods, desserts, beverages.
- **Building**: Residential, religious, commercial, historical architecture, civil infrastructure.
- **Nature**: Landscapes, water bodies, geological formations.
- **Unknown**: Images with low confidence or diffuse activations that cannot be honestly identified.

### Level 2 Subcategories (Selected Examples)
- **Animal**: Dog, Cat, Wild Cat, Wild Canine, Bear, Elephant, Primate, Fish, Reptile, Amphibian, Insect, Small Mammal, Herbivore.
- **Bird**: Parrot, Eagle, Owl, Songbird, Waterfowl, Tropical Bird, Gamebird, Wading Bird, Penguin.
- **Human**: Adult, Child, Baby.
- **Object**: Electronics, Furniture, Appliance, Clothing, Tool, Musical Instrument, Sports Equipment, Stationery, Toy, Household Object.
- **Vehicle**: Car, Motorcycle, Bicycle, Bus, Truck, Train, Aircraft, Boat.
- **Food**: Fruit, Vegetable, Prepared Food, Dessert, Beverage.
- **Plant**: Flower, Fungus, Plant.

---

## 6. Confidence Scoring & Calibration
- **Category Confidence**:
  \[
  P(\text{Category } C) = \sum_{i \in C} P(i)
  \]
- **Subcategory Confidence**:
  Normalized conditional probability:
  \[
  P(\text{Subcategory } S \mid C) = \frac{\sum_{j \in S} P(j)}{\sum_{i \in C} P(i)}
  \]
- **Specific Class Confidence**:
  Direct softmax probability \(P(k)\) of the winning class.
- All confidences represent authentic neural probabilities between `0.0` and `1.0`.

---

## 7. Unknown / Low-Confidence Handling
The system rejects false predictions:
1. **Global Low Confidence**:
   If top specific confidence \(P_{\text{specific}} < 0.12\) and category confidence \(P_{\text{category}} < 0.45\):
   - Category: `Unknown`
   - Subcategory: `Unknown`
   - Specific: `Could not confidently identify image`
   - Flag: `is_unknown = True`
2. **Partial Hierarchy Uncertainty**:
   If category confidence is confident (\(\ge 0.45\)), but fine-grained specific class is uncertain (\(< 0.10\)):
   - Returns reliable Level 1 & Level 2 labels.
   - Specific: `f"{Subcategory} type could not be confidently identified"` rather than hallucinating an inaccurate breed or type.

---

## 8. Multi-Object Image Analysis
When an image depicts multiple objects (e.g. Dog + Ball + Sofa), the system scans secondary probability peaks across distinct `(Category, Subcategory)` clusters:
- **Primary**: Highest-activation concept.
- **Other Detections (`other_detections`)**: Array of co-occurring objects with their individual hierarchical labels and confidence scores.

---

## 9. API Specifications

### Endpoint: `POST /api/classify`
- **Authentication**: Bearer Token (`Authorization: Bearer <jwt_token>`)
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `file`: binary image data (`.jpg`, `.jpeg`, `.png`, `.webp`, \(\le 15\text{MB}\))

### Response Schema:
```json
{
  "id": 42,
  "success": true,
  "prediction": "Golden Retriever",
  "confidence": 0.974,
  "category": "Animal",
  "subcategory": "Dog",
  "specific": "Golden Retriever",
  "classification": {
    "category": {
      "name": "Animal",
      "confidence": 0.992
    },
    "subcategory": {
      "name": "Dog",
      "confidence": 0.984
    },
    "specific": {
      "name": "Golden Retriever",
      "confidence": 0.974
    }
  },
  "hierarchy": {
    "level1": "Animal",
    "level2": "Dog",
    "level3": "Golden Retriever"
  },
  "other_detections": [
    {
      "category": "Object",
      "subcategory": "Sports Equipment",
      "specific": "Tennis Ball",
      "confidence": 0.142
    }
  ],
  "top_predictions": [ ... ],
  "alternatives": [ ... ],
  "features": [
    "Level 1: Animal",
    "Level 2: Dog",
    "Level 3: Golden Retriever",
    "Calibrated Hierarchical Softmax",
    "Multi-Scale Feature Latents"
  ],
  "latency": "12.4ms",
  "image_filename": "7a8b9c...jpg",
  "image_url": "/api/uploads/7a8b9c...jpg",
  "is_unknown": false,
  "created_at": "2026-09-18T17:30:00Z"
}
```

---

## 10. Environment Setup & Configuration

### Environment Variables (`backend/.env`):
```ini
SECRET_KEY=imgx_ai_super_secret_jwt_key_replace_in_production_2026!
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./imgx_ai.db
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=15
FRONTEND_URL=http://localhost:5173
```

### Running the Services:
```bash
# Backend Server
cd backend
source venv/bin/activate
uvicorn main:app --port 8000

# Frontend Server
npm run dev
```

---

## 11. Known Limitations
- **ImageNet Distribution Boundaries**: Concepts with no representation in modern computer vision pretraining distributions will be mapped to broader categories (`Everyday Object`, `Animal`, etc.) or flagged as `Unknown`.
- **Lighting & Occlusion**: Severely underexposed, blurry, or heavily occluded subjects may register low confidence and trigger `Unknown` classification by design to prevent false hallucination.
