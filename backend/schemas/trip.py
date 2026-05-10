from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import List, Optional
from uuid import UUID
from decimal import Decimal

# Activity Schemas
class ActivityBase(BaseModel):
    name: str
    category: str
    cost_amount: Optional[Decimal] = Decimal("0.00")
    currency: Optional[str] = "USD"
    scheduled_time: Optional[datetime] = None
    notes: Optional[str] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityRead(ActivityBase):
    id: UUID
    stop_id: UUID
    model_config = ConfigDict(from_attributes=True)

class ActivityPublicRead(BaseModel):
    name: str
    category: str
    model_config = ConfigDict(from_attributes=True)

# Stop Schemas
class StopBase(BaseModel):
    city_name: str
    country: str
    latitude: float
    longitude: float
    arrival_date: date
    departure_date: date
    order_index: int

class StopCreate(StopBase):
    pass

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

# Trip Schemas
class TripBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    cover_image_url: Optional[str] = None

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
    is_public: bool
    public_link_id: Optional[str] = None
    created_at: datetime
    stops: List[StopRead] = []
    model_config = ConfigDict(from_attributes=True)

class TripCreateResponse(TripBase):
    id: UUID
    user_id: UUID
    is_public: bool
    public_link_id: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TripPublicRead(BaseModel):
    trip_name: str # Mapping from 'name'
    description: Optional[str] = None
    start_date: date
    end_date: date
    stops: List[StopPublicRead] = []
    model_config = ConfigDict(from_attributes=True)

class TripShareResponse(BaseModel):
    is_public: bool
    public_link_id: str
