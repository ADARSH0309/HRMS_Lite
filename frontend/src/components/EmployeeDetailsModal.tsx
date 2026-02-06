import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import type { Employee } from "@/types";

interface EmployeeDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

const EmployeeDetailsModal = ({ open, onOpenChange, employee }: EmployeeDetailsModalProps) => {
  if (!employee) return null;

  const initials = employee.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
              {initials}
            </span>
            <div>
              <div className="text-xs text-slate-500">{employee.employee_id}</div>
              <span>{employee.full_name}</span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {employee.department}
          </DialogDescription>
        </DialogHeader>

        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-200">Employee ID:</span>{" "}
                <span className="text-slate-300">{employee.employee_id}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-200">Full Name:</span>{" "}
                <span className="text-slate-300">{employee.full_name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-200">Email:</span>{" "}
                <span className="text-slate-300">{employee.email}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-200">Department:</span>{" "}
                <span className="text-slate-300">{employee.department}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsModal;
