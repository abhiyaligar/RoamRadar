import asyncio
from sqlalchemy import text
from db.database import engine

async def fix():
    async with engine.begin() as conn:
        try:
            await conn.execute(text('ALTER TABLE trips ADD COLUMN IF NOT EXISTS total_budget FLOAT DEFAULT 0.0'))
            await conn.execute(text('ALTER TABLE trips ADD COLUMN IF NOT EXISTS member_limit INTEGER DEFAULT 1'))
            print('Database columns added successfully!')
        except Exception as e:
            print(f'Error: {e}')

if __name__ == "__main__":
    asyncio.run(fix())
