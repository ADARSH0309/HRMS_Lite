from datetime import date, timedelta

from motor.motor_asyncio import AsyncIOMotorDatabase

from . import schemas
from .database import get_next_id


def _clean(doc: dict | None) -> dict | None:
    """Strip MongoDB's _id field from a document."""
    if doc is None:
        return None
    doc.pop("_id", None)
    return doc


# ── Employee CRUD ──


async def create_employee(db: AsyncIOMotorDatabase, data: schemas.EmployeeCreate) -> dict:
    new_id = await get_next_id("employees")
    doc = {
        "id": new_id,
        "employee_id": data.employee_id,
        "full_name": data.full_name,
        "email": data.email,
        "department": data.department,
    }
    await db["employees"].insert_one(doc)
    return _clean(doc)


async def get_employees(db: AsyncIOMotorDatabase) -> list[dict]:
    cursor = db["employees"].find().sort("id", 1)
    return [_clean(doc) async for doc in cursor]


async def get_employee(db: AsyncIOMotorDatabase, emp_id: int) -> dict | None:
    doc = await db["employees"].find_one({"id": emp_id})
    return _clean(doc)


async def get_employee_by_employee_id(db: AsyncIOMotorDatabase, employee_id: str) -> dict | None:
    doc = await db["employees"].find_one({"employee_id": employee_id})
    return _clean(doc)


async def get_employee_by_email(db: AsyncIOMotorDatabase, email: str) -> dict | None:
    doc = await db["employees"].find_one({"email": email})
    return _clean(doc)


async def update_employee(db: AsyncIOMotorDatabase, emp_id: int, data: schemas.EmployeeUpdate) -> dict | None:
    update_data = data.model_dump(exclude_unset=True)
    if not update_data:
        return await get_employee(db, emp_id)
    doc = await db["employees"].find_one_and_update(
        {"id": emp_id},
        {"$set": update_data},
        return_document=True,
    )
    return _clean(doc)


async def delete_employee(db: AsyncIOMotorDatabase, emp_id: int) -> dict | None:
    doc = await db["employees"].find_one_and_delete({"id": emp_id})
    if doc:
        # Cascade: remove all attendance records for this employee
        await db["attendance"].delete_many({"employee_id": emp_id})
    return _clean(doc)


# ── Attendance CRUD ──


async def create_attendance(db: AsyncIOMotorDatabase, employee_db_id: int, data: schemas.AttendanceCreate) -> dict:
    new_id = await get_next_id("attendance")
    doc = {
        "id": new_id,
        "employee_id": employee_db_id,
        "date": data.date.isoformat(),
        "status": data.status,
    }
    await db["attendance"].insert_one(doc)
    return _clean(doc)


def _attendance_with_employee_pipeline(match_stage: dict | None = None) -> list[dict]:
    """Build an aggregation pipeline that joins attendance with employees."""
    pipeline = []
    if match_stage:
        pipeline.append({"$match": match_stage})
    pipeline += [
        {
            "$lookup": {
                "from": "employees",
                "localField": "employee_id",
                "foreignField": "id",
                "as": "employee",
            }
        },
        {"$unwind": {"path": "$employee", "preserveNullAndEmptyArrays": True}},
        {"$sort": {"date": -1, "id": 1}},
        {"$project": {"_id": 0, "employee._id": 0}},
    ]
    return pipeline


async def get_attendance(
    db: AsyncIOMotorDatabase,
    employee_id: str | None = None,
    record_date: date | None = None,
) -> list[dict]:
    match: dict = {}
    if employee_id:
        # Need to look up the employee's integer id first
        emp = await db["employees"].find_one({"employee_id": employee_id})
        if not emp:
            return []
        match["employee_id"] = emp["id"]
    if record_date:
        match["date"] = record_date.isoformat()

    pipeline = _attendance_with_employee_pipeline(match if match else None)
    cursor = db["attendance"].aggregate(pipeline)
    return [doc async for doc in cursor]


async def get_attendance_record(db: AsyncIOMotorDatabase, record_id: int) -> dict | None:
    doc = await db["attendance"].find_one({"id": record_id})
    return _clean(doc)


async def get_attendance_record_with_employee(db: AsyncIOMotorDatabase, record_id: int) -> dict | None:
    """Fetch a single attendance record with its nested employee."""
    pipeline = _attendance_with_employee_pipeline({"id": record_id})
    cursor = db["attendance"].aggregate(pipeline)
    results = [doc async for doc in cursor]
    return results[0] if results else None


async def update_attendance(db: AsyncIOMotorDatabase, record_id: int, data: schemas.AttendanceUpdate) -> dict | None:
    doc = await db["attendance"].find_one_and_update(
        {"id": record_id},
        {"$set": {"status": data.status}},
        return_document=True,
    )
    return _clean(doc)


async def delete_attendance(db: AsyncIOMotorDatabase, record_id: int) -> bool:
    result = await db["attendance"].delete_one({"id": record_id})
    return result.deleted_count > 0


async def get_attendance_by_employee_and_date(
    db: AsyncIOMotorDatabase, employee_db_id: int, record_date: date
) -> dict | None:
    doc = await db["attendance"].find_one(
        {"employee_id": employee_db_id, "date": record_date.isoformat()}
    )
    return _clean(doc)


# ── Dashboard ──


async def get_dashboard_summary(db: AsyncIOMotorDatabase) -> schemas.DashboardSummary:
    total_employees = await db["employees"].count_documents({})
    today = date.today()
    today_str = today.isoformat()

    present_today = await db["attendance"].count_documents(
        {"date": today_str, "status": "Present"}
    )
    absent_today = await db["attendance"].count_documents(
        {"date": today_str, "status": "Absent"}
    )

    # Distinct departments
    departments = await db["employees"].distinct("department")
    total_departments = len(departments)

    # Recent Attendance Trend (Last 7 Days)
    recent_attendance = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_str = day.isoformat()
        present = await db["attendance"].count_documents(
            {"date": day_str, "status": "Present"}
        )
        absent = await db["attendance"].count_documents(
            {"date": day_str, "status": "Absent"}
        )
        recent_attendance.append({
            "date": day_str,
            "present": present,
            "absent": absent,
        })

    # Department Distribution
    pipeline = [
        {"$group": {"_id": "$department", "value": {"$sum": 1}}},
        {"$project": {"_id": 0, "name": "$_id", "value": 1}},
    ]
    cursor = db["employees"].aggregate(pipeline)
    department_distribution = [doc async for doc in cursor]

    return schemas.DashboardSummary(
        total_employees=total_employees,
        present_today=present_today,
        absent_today=absent_today,
        total_departments=total_departments,
        recent_attendance=recent_attendance,
        department_distribution=department_distribution,
    )
