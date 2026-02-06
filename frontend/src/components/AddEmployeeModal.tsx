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
import { useState } from "react";
import { Label } from "@/components/ui/label";

type AddEmployeeModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAddEmployee?: (employee: {
    employee_id: string;
    full_name: string;
    email: string;
    department: string;
  }) => void | Promise<void>;
};

export default function AddEmployeeModal({
  open,
  onOpenChange,
  onAddEmployee,
}: AddEmployeeModalProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setEmployeeId("");
    setFullName("");
    setEmail("");
    setDepartment("");
    setError(null);
  };

  const handleSave = async () => {
    if (!employeeId.trim() || !fullName.trim() || !email.trim() || !department.trim()) {
      setError("All fields are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (onAddEmployee) {
        await onAddEmployee({
          employee_id: employeeId.trim(),
          full_name: fullName.trim(),
          email: email.trim(),
          department: department.trim(),
        });
      }
      onOpenChange(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || "Failed to add employee.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm(); }}>
      <DialogContent className="bg-slate-900 border-slate-700 w-full max-w-md p-0 max-h-screen overflow-y-auto">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Enter employee information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="employeeId" className="text-slate-300 mb-1 block">
                Employee ID
              </Label>
              <Input
                id="employeeId"
                placeholder="e.g. EMP001"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="bg-slate-800 text-white border-slate-700"
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="fullName" className="text-slate-300 mb-1 block">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-slate-800 text-white border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-slate-300 mb-1 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 text-white border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="department" className="text-slate-300 mb-1 block">
                Department
              </Label>
              <Input
                id="department"
                placeholder="e.g. Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-slate-800 text-white border-slate-700"
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
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave}
              type="button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Employee"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
