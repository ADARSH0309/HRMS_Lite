import { useState, useEffect } from "react";
import { Calendar, Clock, Users, MoreHorizontal, ArrowLeftRight, Trash2, CheckCircle2, XCircle, ListChecks, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import MarkAttendanceModal from "./MarkAttendanceModal";
import StatusBadge from "./StatusBadge";
import AnimatedCounter from "./AnimatedCounter";
import { getAttendance, getEmployees, updateAttendance, deleteAttendance } from "@/lib/api";
import type { AttendanceRecord, Employee } from "@/types";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleToggleStatus = async (record: AttendanceRecord) => {
    setActionError(null);
    try {
      const newStatus = record.status === "Present" ? "Absent" : "Present";
      await updateAttendance(record.id, newStatus);
      await fetchRecords();
    } catch (err: any) {
      setActionError(err.message || "Failed to update attendance");
    }
  };

  const handleDeleteAttendance = async () => {
    if (recordToDelete !== null) {
      setActionError(null);
      try {
        await deleteAttendance(recordToDelete);
        setRecordToDelete(null);
        setDeleteDialogOpen(false);
        await fetchRecords();
      } catch (err: any) {
        setDeleteDialogOpen(false);
        setRecordToDelete(null);
        setActionError(err.message || "Failed to delete attendance");
      }
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { date?: string; employee_id?: string } = {};
      if (selectedDate) params.date = selectedDate;
      if (selectedEmployeeId) params.employee_id = selectedEmployeeId;
      const data = await getAttendance(params);
      setRecords(data);
    } catch (err: any) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(() => { });
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [selectedDate, selectedEmployeeId]);

  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;

  const stats = [
    { title: "Total Present", value: presentCount, color: "text-green-600 dark:text-green-400", icon: CheckCircle2, iconBg: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400" },
    { title: "Total Absent", value: absentCount, color: "text-red-600 dark:text-red-400", icon: XCircle, iconBg: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" },
    { title: "Total Records", value: records.length, color: "text-blue-600 dark:text-blue-400", icon: ListChecks, iconBg: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  ];

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
        <h1 className="text-3xl font-bold text-foreground mb-2">Attendance</h1>
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-6 text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={fetchRecords} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-1">
      <MarkAttendanceModal
        open={showMarkModal}
        onOpenChange={setShowMarkModal}
        onSuccess={fetchRecords}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Attendance Record?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this attendance record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRecordToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAttendance}
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
            Attendance
          </h1>
          <p className="text-muted-foreground text-lg">Track and manage employee attendance records</p>
        </div>
        <Button onClick={() => setShowMarkModal(true)} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group btn-shimmer">
          <ClipboardCheck className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Mark Attendance
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm bg-card hover-lift animate-fade-in-up opacity-0 card-hover-border card-depth" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.iconBg} transition-transform duration-300 hover:scale-110`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{stat.title}</p>
                  <p className={`text-3xl font-bold mt-1 ${stat.color} tracking-tight`}>
                    <AnimatedCounter value={stat.value} duration={800} />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Error Banner */}
      {actionError && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-4 flex items-center justify-between">
            <p className="text-red-500 dark:text-red-400 text-sm">{actionError}</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => setActionError(null)}
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="border shadow-sm bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-background p-1 pr-3 rounded-md border border-input focus-within:ring-1 ring-ring transition-all">
              <div className="p-2 bg-muted rounded-md text-muted-foreground">
                <Calendar className="w-4 h-4" />
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40 border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
              />
            </div>
            <div className="flex items-center gap-2 bg-background p-1 pr-1 rounded-md border border-input focus-within:ring-1 ring-ring transition-all">
              <div className="p-2 bg-muted rounded-md text-muted-foreground">
                <Users className="w-4 h-4" />
              </div>
              <Select
                value={selectedEmployeeId}
                onValueChange={(v) => setSelectedEmployeeId(v === "all" ? "" : v)}
              >
                <SelectTrigger className="w-56 border-0 bg-transparent focus:ring-0 shadow-none">
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.employee_id} value={emp.employee_id}>
                      {emp.full_name} ({emp.employee_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDate("")}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Date
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      {loading ? (
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-0">
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
          </CardContent>
        </Card>
      ) : records.length === 0 ? (
        <Card className="border border-dashed shadow-none bg-muted/10">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-float-glow">
              <Clock className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-foreground text-xl font-bold mb-2">No attendance records</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              No records found for the selected filters. Mark attendance to get started.
            </p>
            <Button onClick={() => setShowMarkModal(true)} size="lg" className="shadow-lg">
              <Clock className="w-5 h-5 mr-2" />
              Mark Attendance
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border shadow-sm bg-card overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/50 py-4">
            <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
              Attendance Records
              {selectedDate && <span className="text-muted-foreground font-normal text-xs bg-muted border px-2 py-0.5 rounded-full">{selectedDate}</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr className="text-left">
                    <th className="h-10 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">EMPLOYEE</th>
                    <th className="h-10 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">DATE</th>
                    <th className="h-10 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">STATUS</th>
                    <th className="h-10 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="">
                  {records.map((record, index) => (
                    <tr
                      key={record.id}
                      className="h-16 border-b border-border/40 table-row-hover group animate-row-slide-in opacity-0"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105 avatar-glow-ring">
                            <span className="text-primary text-xs font-bold tracking-wider">
                              {record.employee
                                ? getInitials(record.employee.full_name)
                                : "?"}
                            </span>
                          </div>
                          <div>
                            <div className="text-foreground font-semibold tracking-tight text-sm">
                              {record.employee?.full_name || "Unknown"}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {record.employee?.employee_id || ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 text-sm text-foreground/80 font-medium font-mono">{record.date}</td>
                      <td className="px-6">
                        <StatusBadge status={record.status as "Present" | "Absent"} />
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
                              onClick={() => handleToggleStatus(record)}
                              className="cursor-pointer"
                            >
                              <ArrowLeftRight className="w-4 h-4 mr-2" />
                              Switch to {record.status === "Present" ? "Absent" : "Present"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive cursor-pointer"
                              onClick={() => {
                                setRecordToDelete(record.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Record
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

export default Attendance;
