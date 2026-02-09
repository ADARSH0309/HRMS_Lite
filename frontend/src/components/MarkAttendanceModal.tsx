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
      <DialogContent className="w-full max-w-md p-0">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <DialogDescription>
              Select an employee and mark their attendance for a specific date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4 modal-stagger">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 dark:text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}
            <div>
              <Label className="mb-1 block">Employee</Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.employee_id} value={emp.employee_id}>
                      {emp.full_name} ({emp.employee_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-focus-glow"
              />
            </div>
            <div>
              <Label className="mb-1 block">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "Present" | "Absent")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
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
              className="w-full mt-2 btn-shimmer"
              onClick={handleSave}
              type="button"
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </span>
              ) : "Mark Attendance"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
