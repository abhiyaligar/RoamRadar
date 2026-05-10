from typing import Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from api.deps import get_current_user
from db.database import get_db
from models.user import User
from models.trip import Trip
from models.stop import Stop
from models.activity import Activity
from schemas.activity import ActivityCreate, ActivityUpdate, ActivityRead

router = APIRouter()

async def verify_stop_ownership(db: AsyncSession, stop_id: UUID, user_id: UUID) -> Stop:
    """Helper function to verify the user owns the trip that contains this stop."""
    result = await db.execute(
        select(Stop)
        .join(Trip, Stop.trip_id == Trip.id)
        .where(Stop.id == stop_id, Trip.user_id == user_id)
    )
    stop = result.scalars().first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found or access denied")
    return stop

@router.post("/{stop_id}/activities", response_model=ActivityRead, status_code=status.HTTP_201_CREATED)
async def create_activity(
    *,
    db: AsyncSession = Depends(get_db),
    stop_id: UUID,
    activity_in: ActivityCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Add a new activity to a stop."""
    await verify_stop_ownership(db, stop_id, current_user.id)
    
    activity = Activity(**activity_in.model_dump(), stop_id=stop_id)
    db.add(activity)
    await db.commit()
    await db.refresh(activity)
    return activity

@router.put("/{stop_id}/activities/{activity_id}", response_model=ActivityRead)
async def update_activity(
    *,
    db: AsyncSession = Depends(get_db),
    stop_id: UUID,
    activity_id: UUID,
    activity_in: ActivityUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update an activity's details."""
    await verify_stop_ownership(db, stop_id, current_user.id)
    
    result = await db.execute(select(Activity).where(Activity.id == activity_id, Activity.stop_id == stop_id))
    activity = result.scalars().first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    update_data = activity_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(activity, field, value)
        
    await db.commit()
    await db.refresh(activity)
    return activity

@router.delete("/{stop_id}/activities/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(
    *,
    db: AsyncSession = Depends(get_db),
    stop_id: UUID,
    activity_id: UUID,
    current_user: User = Depends(get_current_user)
) -> None:
    """Delete an activity from a stop."""
    await verify_stop_ownership(db, stop_id, current_user.id)
    
    result = await db.execute(select(Activity).where(Activity.id == activity_id, Activity.stop_id == stop_id))
    activity = result.scalars().first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    await db.delete(activity)
    await db.commit()
    return None
