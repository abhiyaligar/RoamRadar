import uuid
import enum
from sqlalchemy import Column, String, Float, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from db.database import Base

class ActivityCategory(str, enum.Enum):
    FLIGHT = "Flight"
    HOTEL = "Hotel"
    FOOD = "Food"
    SIGHTSEEING = "Sightseeing"
    TRANSIT = "Transit"
    OTHER = "Other"

class Activity(Base):
    __tablename__ = "activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    stop_id = Column(UUID(as_uuid=True), ForeignKey("stops.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    category = Column(Enum(ActivityCategory), nullable=False, default=ActivityCategory.OTHER)
    cost_amount = Column(Float, nullable=False, default=0.0)
    scheduled_time = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    stop = relationship("Stop", back_populates="activities")
