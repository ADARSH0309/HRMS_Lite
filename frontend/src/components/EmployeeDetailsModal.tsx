import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import { getAttendance } from "@/lib/api";
import type { Employee, AttendanceRecord } from "@/types";

interface EmployeeDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

const EmployeeDetailsModal = ({ open, onOpenChange, employee }: EmployeeDetailsModalProps) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    if (open && employee) {
      setLoadingRecords(true);
      getAttendance({ employee_id: employee.employee_id })
        .then(setRecords)
        .catch(() => setRecords([]))
        .finally(() => setLoadingRecords(false));
    } else {
      setRecords([]);
    }
  }, [open, employee]);

  if (!employee) return null;

  const initials = employee.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const totalPresent = records.filter((r) => r.status === "Present").length;
  const totalAbsent = records.filter((r) => r.status === "Absent").length;
  const attendanceRate =
    records.length > 0 ? ((totalPresent / records.length) * 100).toFixed(1) : "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-lg font-bold avatar-ring">
              {initials}
            </span>
            <div>
              <div className="text-xs text-muted-foreground">{employee.employee_id}</div>
              <span>{employee.full_name}</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            {employee.department}
          </DialogDescription>
        </DialogHeader>

        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-foreground">Employee ID:</span>{" "}
                <span className="text-muted-foreground">{employee.employee_id}</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">Full Name:</span>{" "}
                <span className="text-muted-foreground">{employee.full_name}</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">Email:</span>{" "}
                <span className="text-muted-foreground">{employee.email}</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">Department:</span>{" "}
                <span className="text-muted-foreground">{employee.department}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Attendance Summary</h3>
            {loadingRecords ? (
              <div className="space-y-2">
                <div className="h-4 rounded w-32 animate-shimmer" style={{ background: 'linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted-foreground) / 0.08) 50%, hsl(var(--muted)) 75%)', backgroundSize: '200% 100%' }} />
                <div className="h-4 rounded w-24 animate-shimmer" style={{ background: 'linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted-foreground) / 0.08) 50%, hsl(var(--muted)) 75%)', backgroundSize: '200% 100%' }} />
              </div>
            ) : records.length === 0 ? (
              <p className="text-muted-foreground text-sm">No attendance records found.</p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 text-center mb-4 stagger-children">
                  <div className="bg-green-500/10 rounded-lg p-2">
                    <p className="text-green-600 dark:text-green-400 text-lg font-bold">{totalPresent}</p>
                    <p className="text-muted-foreground text-xs">Present</p>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-2">
                    <p className="text-red-600 dark:text-red-400 text-lg font-bold">{totalAbsent}</p>
                    <p className="text-muted-foreground text-xs">Absent</p>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-2">
                    <p className="text-blue-600 dark:text-blue-400 text-lg font-bold">{attendanceRate}%</p>
                    <p className="text-muted-foreground text-xs">Rate</p>
                  </div>
                </div>

                {/* Recent Records Table */}
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                  Recent Records ({Math.min(records.length, 10)} of {records.length})
                </h4>
                <div className="max-h-48 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-1 text-muted-foreground font-medium">Date</th>
                        <th className="text-left py-1 text-muted-foreground font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.slice(0, 10).map((r) => (
                        <tr key={r.id} className="border-b border-border">
                          <td className="py-1.5 text-muted-foreground">{r.date}</td>
                          <td className="py-1.5">
                            <StatusBadge status={r.status as "Present" | "Absent"} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsModal;
