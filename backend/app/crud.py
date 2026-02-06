from datetime import date

from sqlalchemy.orm import Session

from . import models, schemas


# ── Employee CRUD ──


def create_employee(db: Session, data: schemas.EmployeeCreate) -> models.Employee:
    employee = models.Employee(
        employee_id=data.employee_id,
        full_name=data.full_name,
        email=data.email,
        department=data.department,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


def get_employees(db: Session) -> list[models.Employee]:
    return db.query(models.Employee).order_by(models.Employee.id).all()


def get_employee(db: Session, employee_id: int) -> models.Employee | None:
    return db.query(models.Employee).filter(models.Employee.id == employee_id).first()


def get_employee_by_employee_id(db: Session, employee_id: str) -> models.Employee | None:
    return db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()


def get_employee_by_email(db: Session, email: str) -> models.Employee | None:
    return db.query(models.Employee).filter(models.Employee.email == email).first()


def delete_employee(db: Session, employee_id: int) -> models.Employee | None:
    employee = get_employee(db, employee_id)
    if employee:
        db.delete(employee)
        db.commit()
    return employee


# ── Attendance CRUD ──


def create_attendance(db: Session, employee_db_id: int, data: schemas.AttendanceCreate) -> models.Attendance:
    record = models.Attendance(
        employee_id=employee_db_id,
        date=data.date,
        status=data.status,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_attendance(
    db: Session,
    employee_id: str | None = None,
    record_date: date | None = None,
) -> list[models.Attendance]:
    query = db.query(models.Attendance).join(models.Employee)
    if employee_id:
        query = query.filter(models.Employee.employee_id == employee_id)
    if record_date:
        query = query.filter(models.Attendance.date == record_date)
    return query.order_by(models.Attendance.date.desc(), models.Attendance.id).all()


def get_attendance_by_employee_and_date(
    db: Session, employee_db_id: int, record_date: date
) -> models.Attendance | None:
    return (
        db.query(models.Attendance)
        .filter(
            models.Attendance.employee_id == employee_db_id,
            models.Attendance.date == record_date,
        )
        .first()
    )


# ── Dashboard ──


def get_dashboard_summary(db: Session) -> schemas.DashboardSummary:
    total_employees = db.query(models.Employee).count()
    today = date.today()
    present_today = (
        db.query(models.Attendance)
        .filter(models.Attendance.date == today, models.Attendance.status == "Present")
        .count()
    )
    absent_today = (
        db.query(models.Attendance)
        .filter(models.Attendance.date == today, models.Attendance.status == "Absent")
        .count()
    )
    total_departments = (
        db.query(models.Employee.department).distinct().count()
    )
    return schemas.DashboardSummary(
        total_employees=total_employees,
        present_today=present_today,
        absent_today=absent_today,
        total_departments=total_departments,
    )
