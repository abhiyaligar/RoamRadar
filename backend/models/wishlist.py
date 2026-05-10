import uuid
import enum
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from db.database import Base

class WishlistItemType(str, enum.Enum):
    CITY = "CITY"
    ACTIVITY = "ACTIVITY"

class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    item_type = Column(Enum(WishlistItemType), nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True) # For activities
    location = Column(String, nullable=True) # City name for activities
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="wishlist_items")
