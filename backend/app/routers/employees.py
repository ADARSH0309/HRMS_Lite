from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..database import get_database
from .. import crud, schemas

router = APIRouter(prefix="/api/employees", tags=["employees"])


@router.post("/", response_model=schemas.EmployeeOut, status_code=201)
async def create_employee(data: schemas.EmployeeCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    if await crud.get_employee_by_employee_id(db, data.employee_id):
        raise HTTPException(status_code=409, detail="Employee ID already exists")
    if await crud.get_employee_by_email(db, data.email):
        raise HTTPException(status_code=409, detail="Email already exists")
    return await crud.create_employee(db, data)


@router.get("/", response_model=list[schemas.EmployeeOut])
async def list_employees(db: AsyncIOMotorDatabase = Depends(get_database)):
    return await crud.get_employees(db)


@router.get("/{employee_id}", response_model=schemas.EmployeeOut)
async def get_employee(employee_id: int, db: AsyncIOMotorDatabase = Depends(get_database)):
    employee = await crud.get_employee(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.put("/{employee_id}", response_model=schemas.EmployeeOut)
async def update_employee(employee_id: int, data: schemas.EmployeeUpdate, db: AsyncIOMotorDatabase = Depends(get_database)):
    if data.employee_id:
        existing = await crud.get_employee_by_employee_id(db, data.employee_id)
        if existing and existing["id"] != employee_id:
            raise HTTPException(status_code=409, detail="Employee ID already exists")
    if data.email:
        existing = await crud.get_employee_by_email(db, data.email)
        if existing and existing["id"] != employee_id:
            raise HTTPException(status_code=409, detail="Email already exists")
    employee = await crud.update_employee(db, employee_id, data)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.delete("/{employee_id}", response_model=schemas.EmployeeOut)
async def delete_employee(employee_id: int, db: AsyncIOMotorDatabase = Depends(get_database)):
    employee = await crud.delete_employee(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee
