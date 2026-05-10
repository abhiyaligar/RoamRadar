from typing import Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from api.deps import get_current_user
from db.database import get_db
from models.user import User
from models.trip import Trip
from models.stop import Stop
from schemas.stop import StopCreate, StopUpdate, StopRead

router = APIRouter()

@router.post("/{trip_id}/stops", response_model=StopRead, status_code=status.HTTP_201_CREATED)
async def create_stop(
    *,
    db: AsyncSession = Depends(get_db),
    trip_id: UUID,
    stop_in: StopCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Add a new stop (city) to an existing trip."""
    # Verify trip exists and belongs to current user
    result = await db.execute(select(Trip).where(Trip.id == trip_id, Trip.user_id == current_user.id))
    trip = result.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    stop = Stop(**stop_in.model_dump(), trip_id=trip_id)
    db.add(stop)
    await db.commit()
    
    # Reload with eager loaded activities to avoid MissingGreenlet error
    result = await db.execute(
        select(Stop)
        .options(selectinload(Stop.activities))
        .where(Stop.id == stop.id)
    )
    stop_loaded = result.scalars().first()
    return stop_loaded

@router.put("/{trip_id}/stops/{stop_id}", response_model=StopRead)
async def update_stop(
    *,
    db: AsyncSession = Depends(get_db),
    trip_id: UUID,
    stop_id: UUID,
    stop_in: StopUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update a stop's details."""
    # Verify Trip ownership
    result = await db.execute(select(Trip).where(Trip.id == trip_id, Trip.user_id == current_user.id))
    trip = result.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # Fetch Stop
    result = await db.execute(select(Stop).where(Stop.id == stop_id, Stop.trip_id == trip_id))
    stop = result.scalars().first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
        
    update_data = stop_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(stop, field, value)
        
    await db.commit()
    
    # Reload with eager loaded activities
    result = await db.execute(
        select(Stop)
        .options(selectinload(Stop.activities))
        .where(Stop.id == stop.id)
    )
    stop_loaded = result.scalars().first()
    return stop_loaded

@router.delete("/{trip_id}/stops/{stop_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_stop(
    *,
    db: AsyncSession = Depends(get_db),
    trip_id: UUID,
    stop_id: UUID,
    current_user: User = Depends(get_current_user)
) -> None:
    """Delete a stop from a trip."""
    # Verify Trip ownership
    result = await db.execute(select(Trip).where(Trip.id == trip_id, Trip.user_id == current_user.id))
    trip = result.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # Fetch Stop
    result = await db.execute(select(Stop).where(Stop.id == stop_id, Stop.trip_id == trip_id))
    stop = result.scalars().first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
        
    await db.delete(stop)
    await db.commit()
    return None
