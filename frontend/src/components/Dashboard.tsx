import { useState, useEffect } from "react";
import { Users, Clock, Calendar, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddEmployeeModal from "./AddEmployeeModal";
import { useNavigate } from "react-router-dom";
import { getDashboardSummary, createEmployee } from "@/lib/api";
import type { DashboardSummary } from "@/types";

const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const navigate = useNavigate();

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const stats = summary
    ? [
        { title: "Total Employees", value: summary.total_employees.toString(), icon: Users, color: "bg-blue-500" },
        { title: "Present Today", value: summary.present_today.toString(), icon: Clock, color: "bg-green-500" },
        { title: "Absent Today", value: summary.absent_today.toString(), icon: Calendar, color: "bg-red-500" },
        { title: "Departments", value: summary.total_departments.toString(), icon: Building, color: "bg-purple-500" },
      ]
    : [];

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">Dashboard</h1>
        </div>
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchSummary} variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/20">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">Dashboard</h1>
        <p className="text-muted-foreground text-lg">Welcome back! Here's what's happening with your team today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="glass-card">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-slate-700 rounded w-24" />
                    <div className="h-8 bg-slate-700 rounded w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          : stats.map((stat, index) => (
              <Card key={index} className="glass-card hover-lift group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium tracking-wide">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Quick Actions */}
      <Card className="glass-card relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary" />
        <CardHeader className="pb-4">
          <CardTitle className="text-foreground flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse-glow" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              title: "Add New Employee",
              desc: "Onboard a new team member",
              icon: Users,
              onClick: () => setShowAddEmployee(true),
              gradient: "from-blue-500 to-purple-600",
            },
            {
              title: "View Attendance",
              desc: "Check today's attendance",
              icon: Clock,
              onClick: () => navigate("/attendance"),
              gradient: "from-orange-500 to-red-600",
            },
            {
              title: "View Employees",
              desc: "Manage your team members",
              icon: Building,
              onClick: () => navigate("/employees"),
              gradient: "from-green-500 to-emerald-600",
            },
          ].map((action, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent/10 transition-all duration-300 hover:scale-105 hover:shadow-lg text-left group"
              onClick={action.onClick}
              type="button"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-foreground font-semibold">{action.title}</p>
                <p className="text-muted-foreground text-sm">{action.desc}</p>
              </div>
            </button>
          ))}
        </CardContent>
        <AddEmployeeModal
          open={showAddEmployee}
          onOpenChange={setShowAddEmployee}
          onAddEmployee={async (data) => {
            await createEmployee(data);
            fetchSummary();
          }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
