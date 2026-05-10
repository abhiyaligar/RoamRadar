import asyncio
from sqlalchemy import text
from db.database import engine
from models.community import Community, CommunityMember # Import to ensure metadata is loaded

async def fix():
    async with engine.begin() as conn:
        try:
            # Create communities table
            await conn.execute(text('''
                CREATE TABLE IF NOT EXISTS communities (
                    id UUID PRIMARY KEY,
                    name VARCHAR NOT NULL,
                    description TEXT,
                    image_url VARCHAR,
                    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            '''))
            # Create community_members table
            await conn.execute(text('''
                CREATE TABLE IF NOT EXISTS community_members (
                    id UUID PRIMARY KEY,
                    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            '''))
            print('Community tables created successfully!')
        except Exception as e:
            print(f'Error: {e}')

if __name__ == "__main__":
    asyncio.run(fix())
