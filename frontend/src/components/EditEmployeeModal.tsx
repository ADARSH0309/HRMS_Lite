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
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import type { Employee } from "@/types";

type EditEmployeeModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employee: Employee | null;
  onSave: (id: number, data: Partial<Omit<Employee, "id">>) => Promise<void>;
};

export default function EditEmployeeModal({
  open,
  onOpenChange,
  employee,
  onSave,
}: EditEmployeeModalProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (employee) {
      setEmployeeId(employee.employee_id);
      setFullName(employee.full_name);
      setEmail(employee.email);
      setDepartment(employee.department);
      setError(null);
    }
  }, [employee]);

  const handleSave = async () => {
    if (!employeeId.trim() || !fullName.trim() || !email.trim() || !department.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!employee) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(employee.id, {
        employee_id: employeeId.trim(),
        full_name: fullName.trim(),
        email: email.trim(),
        department: department.trim(),
      });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to update employee.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md p-0 max-h-screen overflow-y-auto">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2 modal-stagger">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 dark:text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="editEmployeeId" className="mb-1 block">
                Employee ID
              </Label>
              <Input
                id="editEmployeeId"
                placeholder="e.g. EMP001"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                autoFocus
                className="input-focus-glow"
              />
            </div>
            <div>
              <Label htmlFor="editFullName" className="mb-1 block">
                Full Name
              </Label>
              <Input
                id="editFullName"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-focus-glow"
              />
            </div>
            <div>
              <Label htmlFor="editEmail" className="mb-1 block">
                Email
              </Label>
              <Input
                id="editEmail"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-focus-glow"
              />
            </div>
            <div>
              <Label htmlFor="editDepartment" className="mb-1 block">
                Department
              </Label>
              <Input
                id="editDepartment"
                placeholder="e.g. Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="input-focus-glow"
              />
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
              ) : "Save Changes"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
