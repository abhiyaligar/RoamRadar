from typing import Any
from fastapi import APIRouter, Depends
from models.user import User
from schemas.user import UserRead
from api.deps import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserRead)
async def read_users_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user.
    """
    return current_user
