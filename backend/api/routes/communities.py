from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from db.database import get_db
from models.community import Community, CommunityMember
from models.user import User
from schemas.community import CommunityCreate, CommunityRead
from api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=CommunityRead)
async def create_community(
    community: CommunityCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new community and make the creator the admin."""
    new_community = Community(
        **community.model_dump(),
        admin_id=current_user.id
    )
    db.add(new_community)
    await db.flush() # Get the ID
    
    # Automatically add the admin as the first member
    member = CommunityMember(community_id=new_community.id, user_id=current_user.id)
    db.add(member)
    
    await db.commit()
    await db.refresh(new_community)
    return new_community

@router.get("/", response_model=List[CommunityRead])
async def list_communities(db: AsyncSession = Depends(get_db)):
    """List all available communities."""
    result = await db.execute(select(Community))
    return result.scalars().all()

@router.delete("/{community_id}")
async def delete_community(
    community_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a community. Only the admin can do this."""
    result = await db.execute(select(Community).where(Community.id == community_id))
    community = result.scalar_one_or_none()
    
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    
    if community.admin_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the admin can delete this community")
    
    await db.delete(community)
    await db.commit()
    return {"message": "Community deleted successfully"}
