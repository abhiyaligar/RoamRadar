import uuid
from sqlalchemy import Column, String, Date, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from db.database import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    cover_image_url = Column(String, nullable=True)
    is_public = Column(Boolean, default=False)

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
