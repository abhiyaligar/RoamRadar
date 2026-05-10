from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID
from models.activity import ActivityCategory

class ActivityBase(BaseModel):
    name: str
    category: ActivityCategory = ActivityCategory.OTHER
    cost_amount: float = 0.0
    scheduled_time: Optional[datetime] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[ActivityCategory] = None
    cost_amount: Optional[float] = None
    scheduled_time: Optional[datetime] = None

class ActivityRead(ActivityBase):
    id: UUID
    stop_id: UUID
    
    model_config = ConfigDict(from_attributes=True)

class ActivityPublicRead(BaseModel):
    name: str
    category: ActivityCategory
    
    model_config = ConfigDict(from_attributes=True)
