import type { Employee, AttendanceRecord, DashboardSummary } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.detail || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return res.json();
}

// ── Employees ──

export async function getEmployees(): Promise<Employee[]> {
  return request<Employee[]>("/api/employees/");
}

export async function getEmployee(id: number): Promise<Employee> {
  return request<Employee>(`/api/employees/${id}`);
}

export async function createEmployee(data: {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}): Promise<Employee> {
  return request<Employee>("/api/employees/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteEmployee(id: number): Promise<Employee> {
  return request<Employee>(`/api/employees/${id}`, { method: "DELETE" });
}

// ── Attendance ──

export async function getAttendance(params?: {
  employee_id?: string;
  date?: string;
}): Promise<AttendanceRecord[]> {
  const searchParams = new URLSearchParams();
  if (params?.employee_id) searchParams.set("employee_id", params.employee_id);
  if (params?.date) searchParams.set("date", params.date);
  const qs = searchParams.toString();
  return request<AttendanceRecord[]>(`/api/attendance/${qs ? `?${qs}` : ""}`);
}

export async function markAttendance(data: {
  employee_id: string;
  date: string;
  status: "Present" | "Absent";
}): Promise<AttendanceRecord> {
  return request<AttendanceRecord>("/api/attendance/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Dashboard ──

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>("/api/dashboard/summary");
}
