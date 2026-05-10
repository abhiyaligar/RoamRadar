import asyncio
from sqlalchemy import text
from db.database import engine

async def check():
    async with engine.connect() as conn:
        try:
            res = await conn.execute(text("SELECT version_num FROM alembic_version"))
            version = res.scalar()
            print(f"Current Alembic Version: {version}")
        except Exception as e:
            print(f"Error fetching alembic version: {e}")
        
        res = await conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public'"))
        tables = res.scalars().all()
        print(f"Tables in DB: {tables}")

if __name__ == "__main__":
    asyncio.run(check())
