import asyncio
from sqlalchemy import text
from db.database import engine

async def check():
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'activities'"))
        print(f"Activities columns: {res.all()}")

if __name__ == "__main__":
    asyncio.run(check())
