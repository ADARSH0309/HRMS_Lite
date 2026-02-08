import { useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import Employees from "@/components/Employees";
import Attendance from "@/components/Attendance";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  function getCurrentPageName(pathname: string): string {
    if (!pathname || pathname === "/") return "Dashboard";
    if (pathname.startsWith("/employees")) return "Employees";
    if (pathname.startsWith("/attendance")) return "Attendance";
    return "Dashboard";
  }
  const currentPage = getCurrentPageName(location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPage={currentPage}
          onPageChange={(pageName: string) => {
            const routeMap: Record<string, string> = {
              Dashboard: "/",
              Employees: "/employees",
              Attendance: "/attendance",
            };
            navigate(routeMap[pageName] || "/");
          }}
        />
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-20'}`}>
          <Header
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            currentPage={currentPage}
          />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="*" element={
                <div className="text-center pt-20 text-muted-foreground text-2xl">
                  404 - Page Not Found
                </div>
              } />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
