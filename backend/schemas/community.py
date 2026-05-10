from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class CommunityBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CommunityCreate(CommunityBase):
    pass

class CommunityRead(CommunityBase):
    id: UUID
    admin_id: UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class CommunityMemberRead(BaseModel):
    user_id: UUID
    joined_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
