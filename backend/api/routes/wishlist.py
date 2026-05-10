from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from db.database import get_db
from models.user import User
from models.wishlist import WishlistItem
from schemas.wishlist import WishlistCreate, WishlistRead
from api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=WishlistRead, status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(
    item_in: WishlistCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add an item to the user's wishlist."""
    # Check if item already exists to avoid duplicates
    query = select(WishlistItem).where(
        WishlistItem.user_id == current_user.id,
        WishlistItem.name == item_in.name,
        WishlistItem.item_type == item_in.item_type
    )
    result = await db.execute(query)
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Item already in wishlist"
        )

    db_item = WishlistItem(
        **item_in.dict(),
        user_id=current_user.id
    )
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item

@router.get("/", response_model=List[WishlistRead])
async def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Fetch current user's wishlist."""
    result = await db.execute(
        select(WishlistItem)
        .where(WishlistItem.user_id == current_user.id)
        .order_by(WishlistItem.created_at.desc())
    )
    return result.scalars().all()

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_wishlist(
    item_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove an item from the wishlist."""
    result = await db.execute(
        select(WishlistItem).where(
            WishlistItem.id == item_id,
            WishlistItem.user_id == current_user.id
        )
    )
    item = result.scalars().first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wishlist item not found"
        )
    
    await db.delete(item)
    await db.commit()
    return None
