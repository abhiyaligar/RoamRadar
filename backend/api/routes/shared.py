from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from db.database import get_db
from models.trip import Trip
from models.stop import Stop
from schemas.trip import TripPublicRead

router = APIRouter()

@router.get("/community", response_model=List[TripPublicRead])
async def get_community_trips(db: AsyncSession = Depends(get_db)):
    """Fetch all public trips for the community feed."""
    result = await db.execute(
        select(Trip)
        .where(Trip.is_public == True)
        .options(selectinload(Trip.stops).selectinload(Stop.activities))
        .order_by(Trip.created_at.desc())
    )
    return result.scalars().all()

@router.get("/{public_link_id}", response_model=TripPublicRead)
async def get_shared_trip(
    public_link_id: str,
    db: AsyncSession = Depends(get_db)
):
    # Fetch public trip with related stops and activities
    # Using selectinload for async relationship loading
    query = (
        select(Trip)
        .options(
            selectinload(Trip.stops).selectinload(Stop.activities)
        )
        .filter(Trip.public_link_id == public_link_id, Trip.is_public == True)
    )
    
    result = await db.execute(query)
    trip = result.scalars().first()
    
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Public trip not found"
        )
    
    # Manually build sanitized response to ensure no sensitive data leaks
    # This aligns with the requirement to build it manually
    return TripPublicRead(
        name=trip.name,
        description=trip.description,
        start_date=trip.start_date,
        end_date=trip.end_date,
        stops=[
            {
                "city_name": stop.city_name,
                "country": stop.country,
                "arrival_date": stop.arrival_date,
                "departure_date": stop.departure_date,
                "activities": [
                    {
                        "name": activity.name,
                        "category": activity.category
                    }
                    for activity in stop.activities
                ]
            }
            for stop in sorted(trip.stops, key=lambda s: s.order_index)
        ]
    )
