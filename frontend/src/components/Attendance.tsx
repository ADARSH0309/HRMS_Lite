import { useState, useEffect } from "react";
import { Calendar, Clock, Users } from "lucide-react";
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
import MarkAttendanceModal from "./MarkAttendanceModal";
import { getAttendance, getEmployees } from "@/lib/api";
import type { AttendanceRecord, Employee } from "@/types";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMarkModal, setShowMarkModal] = useState(false);

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
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [selectedDate, selectedEmployeeId]);

  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;

  const stats = [
    { title: "Total Present", value: presentCount.toString(), color: "text-green-400" },
    { title: "Total Absent", value: absentCount.toString(), color: "text-red-400" },
    { title: "Total Records", value: records.length.toString(), color: "text-blue-400" },
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
        <h1 className="text-3xl font-bold text-white mb-2">Attendance</h1>
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchRecords} variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/20">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <MarkAttendanceModal
        open={showMarkModal}
        onOpenChange={setShowMarkModal}
        onSuccess={fetchRecords}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Attendance</h1>
          <p className="text-slate-400">Track employee attendance</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowMarkModal(true)}>
          <Clock className="w-4 h-4 mr-2" />
          Mark Attendance
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 backdrop-blur-xl border-slate-700">
            <CardContent className="p-6 text-center">
              <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
              <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white w-44"
              />
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <Select
                value={selectedEmployeeId}
                onValueChange={(v) => setSelectedEmployeeId(v === "all" ? "" : v)}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white w-56">
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Employees</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.employee_id} value={emp.employee_id} className="text-white">
                      {emp.full_name} ({emp.employee_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedDate && (
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-400"
                onClick={() => setSelectedDate("")}
              >
                Clear Date
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      {loading ? (
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700">
          <CardContent className="p-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 border-b border-slate-700/50 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-40" />
                    <div className="h-3 bg-slate-700 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : records.length === 0 ? (
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700">
          <CardContent className="p-12 text-center">
            <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No attendance records</h3>
            <p className="text-slate-400 mb-4">
              No records found for the selected filters. Mark attendance to get started.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowMarkModal(true)}>
              <Clock className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Attendance Records {selectedDate && `- ${selectedDate}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-slate-700">
                  <tr className="text-left">
                    <th className="p-4 text-slate-400 font-medium">EMPLOYEE</th>
                    <th className="p-4 text-slate-400 font-medium">DATE</th>
                    <th className="p-4 text-slate-400 font-medium">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {record.employee
                                ? getInitials(record.employee.full_name)
                                : "?"}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {record.employee?.full_name || "Unknown"}
                            </div>
                            <div className="text-slate-400 text-sm">
                              {record.employee?.employee_id || ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{record.date}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.status === "Present"
                              ? "bg-green-400/20 text-green-400"
                              : "bg-red-400/20 text-red-400"
                          }`}
                        >
                          {record.status}
                        </span>
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
