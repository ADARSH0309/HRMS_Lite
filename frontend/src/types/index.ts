export interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  date: string;
  status: "Present" | "Absent";
  employee: Employee | null;
}

export interface DashboardSummary {
  total_employees: number;
  present_today: number;
  absent_today: number;
  total_departments: number;
  recent_attendance: { date: string; present: number; absent: number }[];
  department_distribution: { name: string; value: number }[];
}
