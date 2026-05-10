from datetime import timedelta, datetime
from typing import Any
import random

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from core import security
from core.config import settings
from core.emails import generate_otp, send_otp_email
from db.database import get_db
from models.user import User
from models.otp import UserOTP
from schemas.user import UserCreate, UserRead, Token, OTPVerify, ForgotPassword, ResetPassword

router = APIRouter()


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)) -> Any:
    """
    Register a new user and send an OTP verification email.
    """
    result = await db.execute(select(User).filter(User.email == user_in.email))
    existing = result.scalars().first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )

    hashed_password = security.get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hashed_password,
        mobile_number=user_in.mobile_number,
        city=user_in.city,
        country=user_in.country,
        additional_details=user_in.additional_details,
        is_verified=True,
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)

    return {
        "message": "Registration successful! You can now log in.",
        "email": db_user.email
    }



@router.post("/verify-otp", response_model=dict)
async def verify_otp(payload: OTPVerify, db: AsyncSession = Depends(get_db)) -> Any:
    """
    Verify email OTP and activate user account.
    """
    result = await db.execute(select(User).filter(User.email == payload.email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if user.is_verified:
        return {"message": "Account is already verified. Please log in."}

    # Fetch the latest valid OTP
    otp_result = await db.execute(
        select(UserOTP)
        .where(UserOTP.user_id == user.id)
        .where(UserOTP.purpose == "VERIFICATION")
        .order_by(UserOTP.created_at.desc())
    )
    db_otp = otp_result.scalars().first()

    if not db_otp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No OTP found. Please register again.")

    if datetime.utcnow() > db_otp.expires_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired. Please request a new one.")

    if db_otp.otp_code != payload.otp_code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect OTP. Please try again.")

    # Mark user as verified
    user.is_verified = True
    await db.delete(db_otp)
    await db.commit()

    return {"message": "Email verified successfully! You can now log in."}


@router.post("/resend-otp", response_model=dict)
async def resend_otp(email: str, db: AsyncSession = Depends(get_db)) -> Any:
    """
    Resend a fresh OTP to the user's email.
    """
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    if user.is_verified:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account already verified.")

    otp_code = generate_otp()
    db_otp = UserOTP(
        user_id=user.id,
        otp_code=otp_code,
        purpose="VERIFICATION",
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.add(db_otp)
    await db.commit()
    await send_otp_email(user.email, user.full_name, otp_code)
    return {"message": "A new OTP has been sent to your email."}


@router.post("/token", response_model=Token)
async def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    OAuth2 compatible token login.
    """
    result = await db.execute(select(User).filter(User.email == form_data.username))
    user = result.scalars().first()

    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in."
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=str(user.id), expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.post("/forgot-password", response_model=dict)
async def forgot_password(payload: ForgotPassword, db: AsyncSession = Depends(get_db)) -> Any:
    """
    Send a password reset OTP to the user's email.
    """
    result = await db.execute(select(User).filter(User.email == payload.email))
    user = result.scalars().first()
    if not user:
        # We don't want to leak if an email exists, but for this app we can be direct
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    otp_code = generate_otp()
    db_otp = UserOTP(
        user_id=user.id,
        otp_code=otp_code,
        purpose="PASSWORD_RESET",
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.add(db_otp)
    await db.commit()
    
    # Send reset email
    await send_otp_email(user.email, user.full_name, otp_code)
    
    return {"message": "Password reset OTP has been sent to your email."}

@router.post("/reset-password", response_model=dict)
async def reset_password(payload: ResetPassword, db: AsyncSession = Depends(get_db)) -> Any:
    """
    Verify reset OTP and update user password.
    """
    result = await db.execute(select(User).filter(User.email == payload.email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    # Fetch the latest valid reset OTP
    otp_result = await db.execute(
        select(UserOTP)
        .where(UserOTP.user_id == user.id)
        .where(UserOTP.purpose == "PASSWORD_RESET")
        .order_by(UserOTP.created_at.desc())
    )
    db_otp = otp_result.scalars().first()

    if not db_otp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No reset request found.")

    if datetime.utcnow() > db_otp.expires_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired.")

    if db_otp.otp_code != payload.otp_code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect OTP.")

    # Update password
    user.hashed_password = security.get_password_hash(payload.new_password)
    await db.delete(db_otp)
    await db.commit()

    return {"message": "Password has been reset successfully! You can now log in with your new password."}
