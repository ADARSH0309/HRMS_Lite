import { useState, useEffect, useMemo } from "react";
import { Search, Plus, MoreHorizontal, Trash2, Eye, Users, Pencil, UserPlus, Filter, Mail, Hash, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddEmployeeModal from "@/components/AddEmployeeModal";
import EditEmployeeModal from "@/components/EditEmployeeModal";
import EmployeeDetailsModal from "@/components/EmployeeDetailsModal";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee as deleteEmployeeApi } from "@/lib/api";
import type { Employee } from "@/types";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [employeeToView, setEmployeeToView] = useState<Employee | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const [departmentFilter, setDepartmentFilter] = useState("");

  const departments = useMemo(
    () => [...new Set(employees.map((e) => e.department))].sort(),
    [employees]
  );

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (data: {
    employee_id: string;
    full_name: string;
    email: string;
    department: string;
  }) => {
    await createEmployee(data);
    await fetchEmployees();
  };

  const handleDeleteEmployee = async () => {
    if (employeeToDelete !== null) {
      try {
        await deleteEmployeeApi(employeeToDelete);
        setEmployeeToDelete(null);
        setDeleteDialogOpen(false);
        await fetchEmployees();
      } catch (err) {
        console.error("Error deleting employee:", err);
      }
    }
  };

  const handleEditEmployee = async (id: number, data: Partial<Omit<Employee, "id">>) => {
    await updateEmployee(id, data);
    await fetchEmployees();
  };

  const handleViewDetails = (id: number) => {
    const found = employees.find((emp) => emp.id === id) || null;
    setEmployeeToView(found);
    setDetailsOpen(true);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !departmentFilter || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground mb-2">Employees</h1>
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-6 text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={fetchEmployees} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-1">
      <AddEmployeeModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddEmployee={handleAddEmployee}
      />

      <EditEmployeeModal
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEmployeeToEdit(null);
        }}
        employee={employeeToEdit}
        onSave={handleEditEmployee}
      />

      <EmployeeDetailsModal
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) setEmployeeToView(null);
        }}
        employee={employeeToView}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone. All attendance records for this employee will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEmployeeToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 w-fit mb-2">
            Employees
          </h1>
          <p className="text-muted-foreground text-lg">Manage your team members and their roles</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group btn-shimmer">
          <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Add Employee
        </Button>
      </div>

      {/* Search & Filter */}
      <Card className="border shadow-sm bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative max-w-md flex-1 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by name, email, or id..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-input focus-visible:ring-1"
              />
            </div>
            <Select
              value={departmentFilter}
              onValueChange={(v) => setDepartmentFilter(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-56 bg-background transition-all duration-200 hover:border-primary/50">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Count */}
      <div className="text-muted-foreground text-sm font-medium px-1">
        Showing <span className="text-foreground font-bold">{filteredEmployees.length}</span> of {employees.length} employees
      </div>

      {loading ? (
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-0">
            <div className="space-y-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full shimmer-bg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 rounded w-40 shimmer-bg" />
                      <div className="h-3 rounded w-24 shimmer-bg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : filteredEmployees.length === 0 ? (
        <Card className="border border-dashed shadow-none bg-muted/10">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-float-glow">
              <Users className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-foreground text-xl font-bold mb-2">
              {employees.length === 0 ? "No employees yet" : "No matches found"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {employees.length === 0
                ? "Get started by adding your first employee to the platform."
                : "We couldn't find any employees matching your search criteria."}
            </p>
            {employees.length === 0 && (
              <Button onClick={() => setShowAddModal(true)} size="lg" className="shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                Add First Employee
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border shadow-sm bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr className="text-left">
                    <th className="h-10 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">NAME</th>
                    <th className="h-10 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">EMPLOYEE ID</th>
                    <th className="h-10 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">EMAIL</th>
                    <th className="h-10 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">DEPARTMENT</th>
                    <th className="h-10 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="">
                  {filteredEmployees.map((employee, index) => (
                    <tr
                      key={employee.id}
                      className="h-16 border-b border-border/40 table-row-hover group animate-row-slide-in opacity-0"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105 avatar-glow-ring">
                            <span className="text-primary text-xs font-bold tracking-wider">
                              {getInitials(employee.full_name)}
                            </span>
                          </div>
                          <div>
                            <div className="text-foreground font-semibold tracking-tight text-sm">{employee.full_name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 text-sm text-muted-foreground font-mono">{employee.employee_id}</td>
                      <td className="px-6 text-sm text-muted-foreground hidden md:table-cell">{employee.email}</td>
                      <td className="px-6">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-secondary-foreground/10">
                          {employee.department}
                        </span>
                      </td>
                      <td className="px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(employee.id)}
                              className="cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEmployeeToEdit(employee);
                                setEditOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive cursor-pointer"
                              onClick={() => {
                                setEmployeeToDelete(employee.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Employee
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Employees;
