import os

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ReturnDocument

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "hrms_lite")

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None


async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[MONGODB_DB_NAME]
    await create_indexes()


async def close_mongo_connection():
    global client
    if client:
        client.close()


async def create_indexes():
    """Create unique indexes to enforce constraints (replaces SQL UNIQUE)."""
    await db["employees"].create_index("employee_id", unique=True)
    await db["employees"].create_index("email", unique=True)
    await db["attendance"].create_index(
        [("employee_id", 1), ("date", 1)], unique=True
    )


async def get_next_id(collection_name: str) -> int:
    """Auto-increment integer ID using a counters collection."""
    result = await db["counters"].find_one_and_update(
        {"_id": collection_name},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return result["seq"]


async def get_database() -> AsyncIOMotorDatabase:
    """FastAPI dependency — returns the database handle."""
    return db
