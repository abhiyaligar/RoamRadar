from pydantic import BaseModel, EmailStr, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, Any

# Shared base
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    profile_picture_url: Optional[str] = None
    mobile_number: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    additional_details: Optional[Any] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to return via API
class UserRead(UserBase):
    id: UUID
    is_verified: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

# OTP Verify Schema
class OTPVerify(BaseModel):
    email: EmailStr
    otp_code: str

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str
