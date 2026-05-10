from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
import uuid

from db.database import get_db
from api.deps import get_current_user
from models.user import User
from models.trip import Trip
from schemas.trip import TripShareResponse, TripCreate, TripRead, TripCreateResponse

router = APIRouter()

@router.post("/", response_model=TripCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(
    trip_in: TripCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = Trip(
        **trip_in.model_dump(),
        user_id=current_user.id
    )
    db.add(trip)
    await db.commit()
    await db.refresh(trip)
    return trip

@router.post("/{trip_id}/share/public", response_model=TripShareResponse)
async def toggle_public_share(
    trip_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch trip
    result = await db.execute(select(Trip).filter(Trip.id == trip_id))
    trip = result.scalars().first()
    
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found"
        )
    
    # Ownership check
    if trip.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to share this trip"
        )
    
    # Toggle logic
    trip.is_public = not trip.is_public
    
    # Generate public_link_id if enabling and it doesn't exist
    if trip.is_public and not trip.public_link_id:
        trip.public_link_id = str(uuid.uuid4())
    
    await db.commit()
    await db.refresh(trip)
    
    return {
        "is_public": trip.is_public,
        "public_link_id": trip.public_link_id
    }
from typing import Any, List
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
from schemas.trip import TripCreate, TripUpdate, TripRead

router = APIRouter()

@router.get("/", response_model=List[TripRead])
async def read_trips(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Retrieve all trips for the current user."""
    result = await db.execute(
        select(Trip)
        .options(selectinload(Trip.stops).selectinload(Stop.activities))
        .where(Trip.user_id == current_user.id)
    )
    trips = result.scalars().all()
    return trips

@router.post("/", response_model=TripRead, status_code=status.HTTP_201_CREATED)
async def create_trip(
    *,
    db: AsyncSession = Depends(get_db),
    trip_in: TripCreate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create new trip."""
    trip = Trip(**trip_in.model_dump(), user_id=current_user.id)
    db.add(trip)
    await db.commit()
    
    # Reload with eager loaded relationships
    result = await db.execute(
        select(Trip)
        .options(selectinload(Trip.stops).selectinload(Stop.activities))
        .where(Trip.id == trip.id)
    )
    trip_loaded = result.scalars().first()
    return trip_loaded

@router.get("/{trip_id}", response_model=TripRead)
async def read_trip(
    *,
    db: AsyncSession = Depends(get_db),
    trip_id: UUID,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get a specific trip by ID."""
    result = await db.execute(
        select(Trip)
        .options(selectinload(Trip.stops).selectinload(Stop.activities))
        .where(Trip.id == trip_id, Trip.user_id == current_user.id)
    )
    trip = result.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.put("/{trip_id}", response_model=TripRead)
async def update_trip(
    *,
    db: AsyncSession = Depends(get_db),
    trip_id: UUID,
    trip_in: TripUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update a trip."""
    result = await db.execute(
        select(Trip).where(Trip.id == trip_id, Trip.user_id == current_user.id)
    )
    trip = result.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    update_data = trip_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(trip, field, value)
        
    await db.commit()
    
    # Reload with eager loaded relationships
    result = await db.execute(
        select(Trip)
        .options(selectinload(Trip.stops).selectinload(Stop.activities))
        .where(Trip.id == trip.id)
    )
    trip_loaded = result.scalars().first()
    return trip_loaded

@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(
    *,
    db: AsyncSession = Depends(get_db),
    trip_id: UUID,
    current_user: User = Depends(get_current_user)
) -> None:
    """Delete a trip."""
    result = await db.execute(
        select(Trip).where(Trip.id == trip_id, Trip.user_id == current_user.id)
    )
    trip = result.scalars().first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    await db.delete(trip)
    await db.commit()
    return None
