import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEmployees, markAttendance } from "@/lib/api";
import type { Employee } from "@/types";

interface MarkAttendanceModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
}

export default function MarkAttendanceModal({
  open,
  onOpenChange,
  onSuccess,
}: MarkAttendanceModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"Present" | "Absent">("Present");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      getEmployees()
        .then(setEmployees)
        .catch(() => {});
    }
  }, [open]);

  const resetForm = () => {
    setSelectedEmployeeId("");
    setDate(new Date().toISOString().split("T")[0]);
    setStatus("Present");
    setError(null);
  };

  const handleSave = async () => {
    if (!selectedEmployeeId || !date) {
      setError("Please select an employee and date.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await markAttendance({
        employee_id: selectedEmployeeId,
        date,
        status,
      });
      onOpenChange(false);
      resetForm();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to mark attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm(); }}>
      <DialogContent className="bg-slate-900 border-slate-700 w-full max-w-md p-0">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <DialogDescription>
              Select an employee and mark their attendance for a specific date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            <div>
              <Label className="text-slate-300 mb-1 block">Employee</Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger className="bg-slate-800 text-white border-slate-700">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {employees.map((emp) => (
                    <SelectItem key={emp.employee_id} value={emp.employee_id} className="text-white">
                      {emp.full_name} ({emp.employee_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-300 mb-1 block">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-slate-800 text-white border-slate-700"
              />
            </div>
            <div>
              <Label className="text-slate-300 mb-1 block">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "Present" | "Absent")}>
                <SelectTrigger className="bg-slate-800 text-white border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Present" className="text-white">Present</SelectItem>
                  <SelectItem value="Absent" className="text-white">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="ghost" className="w-full mt-2" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave}
              type="button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Mark Attendance"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
