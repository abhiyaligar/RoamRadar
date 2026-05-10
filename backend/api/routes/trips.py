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
