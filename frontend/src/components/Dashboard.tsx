import { useState, useEffect } from "react";
import { Users, Clock, Calendar, Building, ArrowUpRight, Plus, TrendingUp, UserPlus, ClipboardCheck, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import { AuroraText } from "@/components/ui/aurora-text";
import AddEmployeeModal from "./AddEmployeeModal";
import AnimatedCounter from "./AnimatedCounter";
import { useNavigate } from "react-router-dom";
import { getDashboardSummary, createEmployee } from "@/lib/api";
import type { DashboardSummary } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

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
      { title: "Total Employees", value: summary.total_employees, icon: Users, color: "text-blue-500 bg-blue-500/15 border-blue-500/20", href: "/employees" },
      { title: "Present Today", value: summary.present_today, icon: Clock, color: "text-green-500 bg-green-500/15 border-green-500/20", href: "/attendance" },
      { title: "Absent Today", value: summary.absent_today, icon: Calendar, color: "text-amber-500 bg-amber-500/15 border-amber-500/20", href: "/attendance" },
      { title: "Departments", value: summary.total_departments, icon: Building, color: "text-indigo-500 bg-indigo-500/15 border-indigo-500/20", href: "/employees" },
    ]
    : [];

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your organization</p>
        </div>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchSummary} variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          <AuroraText colors={["#6366f1", "#8b5cf6", "#a78bfa", "#6366f1"]} speed={0.5}>Dashboard</AuroraText>
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 rounded w-1/2 shimmer-bg" />
                  <div className="h-10 rounded w-1/4 shimmer-bg" />
                </div>
              </CardContent>
            </Card>
          ))
          : stats.map((stat, index) => (
            <Card
              key={index}
              className="relative group cursor-pointer hover-lift border bg-card animate-fade-in-up opacity-0 overflow-hidden card-hover-border card-depth"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(stat.href)}
            >
              <ShineBorder shineColor={["#6366f1", "#a78bfa", "#818cf8"]} duration={8} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                      {stat.title}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground tabular-nums">
                        <AnimatedCounter value={stat.value} duration={1000} />
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color} border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>View details</span>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card className="shadow-sm border bg-card/50 backdrop-blur-sm hover-lift animate-fade-in-up opacity-0 card-hover-border card-depth" style={{ animationDelay: '400ms' }}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Attendance Trend (Last 7 Days)
            </h3>
            <div className="h-[300px] w-full">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center bg-muted/10 rounded-lg animate-pulse">
                  <span className="text-muted-foreground">Loading chart...</span>
                </div>
              ) : summary?.recent_attendance ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.recent_attendance}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { weekday: 'short' })}
                    />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                      cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                    />
                    <Legend />
                    <Bar dataKey="present" name="Present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    <Bar dataKey="absent" name="Absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="shadow-sm border bg-card/50 backdrop-blur-sm hover-lift animate-fade-in-up opacity-0 card-hover-border card-depth" style={{ animationDelay: '500ms' }}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-500" />
              Department Distribution
            </h3>
            <div className="h-[300px] w-full">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center bg-muted/10 rounded-lg animate-pulse">
                  <span className="text-muted-foreground">Loading chart...</span>
                </div>
              ) : summary?.department_distribution ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summary.department_distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {summary.department_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '600ms' }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Add Employee",
              desc: "Onboard a new team member",
              icon: UserPlus,
              bg: "bg-gradient-to-br from-indigo-500 to-violet-600",
              shadow: "shadow-indigo-500/20",
              onClick: () => setShowAddEmployee(true),
            },
            {
              label: "View Attendance",
              desc: "Check daily logs and status",
              icon: ClipboardCheck,
              bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
              shadow: "shadow-emerald-500/20",
              onClick: () => navigate("/attendance"),
            },
            {
              label: "Manage Team",
              desc: "View and edit employee details",
              icon: Users,
              bg: "bg-gradient-to-br from-amber-500 to-orange-600",
              shadow: "shadow-amber-500/20",
              onClick: () => navigate("/employees"),
            },
          ].map((action, index) => (
            <div
              key={index}
              className={`group relative cursor-pointer rounded-xl ${action.bg} p-5 text-white shadow-lg ${action.shadow} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl animate-fade-in-up opacity-0 overflow-hidden`}
              style={{ animationDelay: `${700 + index * 100}ms` }}
              onClick={action.onClick}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-xl" />
              <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                <div className="flex items-start justify-between">
                  <span className="text-lg font-semibold tracking-tight">{action.label}</span>
                  <ArrowUpRight className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-sm text-white/70">{action.desc}</p>
                  <action.icon className="w-8 h-8 text-white/20 group-hover:text-white/40 transition-colors duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddEmployeeModal
        open={showAddEmployee}
        onOpenChange={setShowAddEmployee}
        onAddEmployee={async (data) => {
          await createEmployee(data);
          fetchSummary();
        }}
      />
    </div>
  );
};

export default Dashboard;
