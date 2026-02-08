from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..database import get_database
from .. import crud, schemas

router = APIRouter(prefix="/api/attendance", tags=["attendance"])


@router.post("/", response_model=schemas.AttendanceOut, status_code=201)
async def mark_attendance(data: schemas.AttendanceCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Look up the employee by their string employee_id
    employee = await crud.get_employee_by_employee_id(db, data.employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check for duplicate
    existing = await crud.get_attendance_by_employee_and_date(db, employee["id"], data.date)
    if existing:
        raise HTTPException(
            status_code=409, detail="Attendance already marked for this employee on this date"
        )

    record = await crud.create_attendance(db, employee["id"], data)
    # Fetch with nested employee for response
    return await crud.get_attendance_record_with_employee(db, record["id"])


@router.get("/", response_model=list[schemas.AttendanceOut])
async def list_attendance(
    employee_id: str | None = Query(None),
    date: date | None = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    return await crud.get_attendance(db, employee_id=employee_id, record_date=date)


@router.put("/{record_id}", response_model=schemas.AttendanceOut)
async def update_attendance(record_id: int, data: schemas.AttendanceUpdate, db: AsyncIOMotorDatabase = Depends(get_database)):
    record = await crud.update_attendance(db, record_id, data)
    if not record:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return await crud.get_attendance_record_with_employee(db, record_id)


@router.delete("/{record_id}")
async def delete_attendance(record_id: int, db: AsyncIOMotorDatabase = Depends(get_database)):
    success = await crud.delete_attendance(db, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return {"ok": True}
