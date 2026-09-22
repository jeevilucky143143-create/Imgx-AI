from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict


class UserRegister(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

    @field_validator("name")
    @classmethod
    def name_must_not_be_blank(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Name cannot be empty or blank")
        return stripped

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()


class UserLogin(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TopPrediction(BaseModel):
    label: str
    confidence: float
    category: Optional[str] = None
    subcategory: Optional[str] = None
    specific: Optional[str] = None


class AlternativePrediction(BaseModel):
    name: str
    confidence: float


class HierarchyLevel(BaseModel):
    name: str
    confidence: float


class HierarchicalClassification(BaseModel):
    category: HierarchyLevel
    subcategory: HierarchyLevel
    specific: HierarchyLevel


class HierarchyDict(BaseModel):
    level1: str
    level2: str
    level3: str


class DetectedObject(BaseModel):
    category: str
    subcategory: str
    specific: str
    confidence: float


class ClassificationResponse(BaseModel):
    id: int
    success: bool = True
    prediction: str
    confidence: float
    category: Optional[str] = "General"
    subcategory: Optional[str] = "General"
    specific: Optional[str] = None
    classification: Optional[HierarchicalClassification] = None
    hierarchy: Optional[HierarchyDict] = None
    other_detections: Optional[List[DetectedObject]] = []
    top_predictions: List[TopPrediction]
    alternatives: List[AlternativePrediction]
    features: List[str]
    latency: str
    image_filename: str
    image_url: str
    is_unknown: Optional[bool] = False
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HistoryItemResponse(BaseModel):
    id: int
    image_filename: str
    image_url: str
    prediction: str
    confidence: float
    category: Optional[str] = "General"
    subcategory: Optional[str] = "General"
    specific: Optional[str] = None
    classification: Optional[HierarchicalClassification] = None
    hierarchy: Optional[HierarchyDict] = None
    other_detections: Optional[List[DetectedObject]] = []
    latency: Optional[str] = "12.0ms"
    top_alternatives: Optional[List[AlternativePrediction]] = []
    tensor_meta: Optional[str] = "ResNet-50 • Hierarchical Softmax • 224×224"
    created_at: datetime
    display_date: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
