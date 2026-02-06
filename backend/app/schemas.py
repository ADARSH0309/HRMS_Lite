from datetime import date

from pydantic import BaseModel, EmailStr, Field


# ── Employee ──


class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=1)
    full_name: str = Field(..., min_length=1)
    email: EmailStr
    department: str = Field(..., min_length=1)


class EmployeeOut(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str

    model_config = {"from_attributes": True}


# ── Attendance ──


class AttendanceCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, description="The employee_id string (e.g. EMP001)")
    date: date
    status: str = Field(..., pattern="^(Present|Absent)$")


class AttendanceOut(BaseModel):
    id: int
    employee_id: int
    date: date
    status: str
    employee: EmployeeOut | None = None

    model_config = {"from_attributes": True}


# ── Dashboard ──


class DashboardSummary(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
    total_departments: int
