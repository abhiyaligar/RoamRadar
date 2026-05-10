import uuid
from sqlalchemy import Column, String, DateTime, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    profile_picture_url = Column(String, nullable=True)
    mobile_number = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    additional_details = Column(JSON, nullable=True)
    is_verified = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


    # Relationships
    trips = relationship("Trip", back_populates="owner", cascade="all, delete-orphan")
    owned_communities = relationship("Community", back_populates="admin", cascade="all, delete-orphan")
    joined_communities = relationship("CommunityMember", back_populates="user", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="user", cascade="all, delete-orphan")
