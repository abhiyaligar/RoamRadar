from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from models.wishlist import WishlistItemType

class WishlistCreate(BaseModel):
    item_type: WishlistItemType
    name: str
    category: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None

class WishlistRead(WishlistCreate):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
