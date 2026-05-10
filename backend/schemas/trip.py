from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from uuid import UUID
from schemas.stop import StopRead

class TripBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    cover_image_url: Optional[str] = None
    is_public: bool = False

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    cover_image_url: Optional[str] = None
    is_public: Optional[bool] = None

class TripRead(TripBase):
    id: UUID
    user_id: UUID
    stops: List[StopRead] = []
    total_budget: float = 0.0

    class Config:
        from_attributes = True
