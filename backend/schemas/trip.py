from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import List, Optional
from uuid import UUID
from .stop import StopRead, StopPublicRead

# Trip Schemas
class TripBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    total_budget: float = 0.0
    member_limit: int = 1
    cover_image_url: Optional[str] = None
    is_public: bool = False

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    total_budget: Optional[float] = None
    member_limit: Optional[int] = None
    cover_image_url: Optional[str] = None
    is_public: Optional[bool] = None

class TripRead(TripBase):
    id: UUID
    user_id: UUID
    public_link_id: Optional[str] = None
    created_at: datetime
    stops: List[StopRead] = []
    
    model_config = ConfigDict(from_attributes=True)

class TripCreateResponse(TripBase):
    id: UUID
    user_id: UUID
    public_link_id: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class TripPublicRead(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    stops: List[StopPublicRead] = []
    
    model_config = ConfigDict(from_attributes=True)

class TripShareResponse(BaseModel):
    is_public: bool
    public_link_id: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)
