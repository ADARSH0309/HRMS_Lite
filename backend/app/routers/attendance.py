from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/attendance", tags=["attendance"])


@router.post("/", response_model=schemas.AttendanceOut, status_code=201)
def mark_attendance(data: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    # Look up the employee by their string employee_id
    employee = crud.get_employee_by_employee_id(db, data.employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check for duplicate
    existing = crud.get_attendance_by_employee_and_date(db, employee.id, data.date)
    if existing:
        raise HTTPException(
            status_code=409, detail="Attendance already marked for this employee on this date"
        )

    record = crud.create_attendance(db, employee.id, data)
    # Eager-load employee for response
    db.refresh(record, ["employee"])
    return record


@router.get("/", response_model=list[schemas.AttendanceOut])
def list_attendance(
    employee_id: str | None = Query(None),
    date: date | None = Query(None),
    db: Session = Depends(get_db),
):
    return crud.get_attendance(db, employee_id=employee_id, record_date=date)
