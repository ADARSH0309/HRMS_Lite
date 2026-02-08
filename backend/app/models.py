"""
MongoDB document schemas (for reference only — no ORM models needed).

employees collection:
{
    "id": 1,                    # auto-increment integer
    "employee_id": "EMP001",    # unique string
    "full_name": "John Doe",
    "email": "john@example.com", # unique
    "department": "Engineering"
}

attendance collection:
{
    "id": 1,                    # auto-increment integer
    "employee_id": 3,           # references employees.id (integer)
    "date": "2024-01-15",       # ISO date string
    "status": "Present"         # "Present" or "Absent"
}

counters collection (for auto-increment IDs):
{
    "_id": "employees",         # collection name
    "seq": 42                   # current sequence value
}
"""
