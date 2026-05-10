import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Date, Float, Integer, DECIMAL, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, Date, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from db.database import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    cover_image_url = Column(String, nullable=True)
    is_public = Column(Boolean, default=False)
    public_link_id = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    owner = relationship("User", backref="trips")
    stops = relationship("Stop", back_populates="trip", cascade="all, delete-orphan")

class Stop(Base):
    __tablename__ = "stops"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id"), nullable=False)
    city_name = Column(String, nullable=False)
    country = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    arrival_date = Column(Date, nullable=False)
    departure_date = Column(Date, nullable=False)
    order_index = Column(Integer, nullable=False)

    # Relationships
    trip = relationship("Trip", back_populates="stops")
    activities = relationship("Activity", back_populates="stop", cascade="all, delete-orphan")

class Activity(Base):
    __tablename__ = "activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stop_id = Column(UUID(as_uuid=True), ForeignKey("stops.id"), nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # Transport, Stay, Meal, Activity
    cost_amount = Column(DECIMAL(10, 2), default=0.00)
    currency = Column(String, default='USD')
    scheduled_time = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)

    # Relationships
    stop = relationship("Stop", back_populates="activities")

    # Relationships
    user = relationship("User", back_populates="trips")
    stops = relationship("Stop", back_populates="trip", cascade="all, delete-orphan", order_by="Stop.order_index")

    @property
    def total_budget(self) -> float:
        total = 0.0
        # Check if stops are loaded to avoid async issues
        if "stops" in self.__dict__:
            for stop in self.stops:
                if "activities" in stop.__dict__:
                    total += sum(activity.cost_amount for activity in stop.activities)
        return total
