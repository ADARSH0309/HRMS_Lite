from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..database import get_database
from .. import crud, schemas

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=schemas.DashboardSummary)
async def get_summary(db: AsyncIOMotorDatabase = Depends(get_database)):
    return await crud.get_dashboard_summary(db)
