import asyncio
import uuid
from sqlalchemy import text
from db.database import engine

async def fix_links():
    async with engine.begin() as conn:
        try:
            # Find public trips with no public_link_id and fix them
            result = await conn.execute(text("SELECT id FROM trips WHERE is_public = true AND public_link_id IS NULL OR public_link_id = 'undefined'"))
            rows = result.fetchall()
            
            for row in rows:
                new_id = str(uuid.uuid4())[:12]
                await conn.execute(
                    text("UPDATE trips SET public_link_id = :new_id WHERE id = :trip_id"),
                    {"new_id": new_id, "trip_id": row[0]}
                )
            
            print(f"Fixed {len(rows)} trip links successfully!")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(fix_links())
