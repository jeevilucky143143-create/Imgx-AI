from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base


def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    classifications = relationship(
        "ClassificationHistory",
        back_populates="user",
        cascade="all, delete-orphan",
        order_by="desc(ClassificationHistory.created_at)"
    )


class ClassificationHistory(Base):
    __tablename__ = "classification_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    image_filename = Column(String(255), nullable=False)
    prediction = Column(String(150), nullable=False)
    confidence = Column(Float, nullable=False)
    category = Column(String(100), nullable=True, default="General")
    subcategory = Column(String(100), nullable=True, default="General")
    specific = Column(String(150), nullable=True)
    latency = Column(String(50), nullable=True, default="12.0ms")
    top_predictions_json = Column(Text, nullable=True)  # JSON-serialized alternatives/features/hierarchy
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False, index=True)

    user = relationship("User", back_populates="classifications")
