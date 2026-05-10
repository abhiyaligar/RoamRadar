from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date
from uuid import UUID
from .activity import ActivityRead, ActivityPublicRead

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
    
    model_config = ConfigDict(from_attributes=True)

class StopPublicRead(BaseModel):
    city_name: str
    country: str
    arrival_date: date
    departure_date: date
    activities: List[ActivityPublicRead] = []
    
    model_config = ConfigDict(from_attributes=True)
