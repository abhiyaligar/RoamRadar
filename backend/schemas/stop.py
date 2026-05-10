from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from uuid import UUID
from schemas.activity import ActivityRead

class StopBase(BaseModel):
    city_name: str
    country: str
    latitude: float
    longitude: float
    arrival_date: date
    departure_date: date
    order_index: int = 0

class StopCreate(StopBase):
    pass

class StopUpdate(BaseModel):
    city_name: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    arrival_date: Optional[date] = None
    departure_date: Optional[date] = None
    order_index: Optional[int] = None

class StopRead(StopBase):
    id: UUID
    trip_id: UUID
    activities: List[ActivityRead] = []

    class Config:
        from_attributes = True
