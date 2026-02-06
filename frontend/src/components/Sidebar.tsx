import { Layout, Users, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar = ({ isOpen, onToggle, currentPage, onPageChange }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: Layout, href: "/" },
    { name: "Employees", icon: Users, href: "/employees" },
    { name: "Attendance", icon: Clock, href: "/attendance" },
  ];

  function isMenuActive(item: { name: string; href: string }): boolean {
    return location.pathname === item.href ||
      (item.href !== "/" && location.pathname.startsWith(item.href));
  }

  return (
    <div className={`fixed left-0 top-0 h-full glass-card border-r border-border transition-all duration-500 z-50 ${
      isOpen ? 'w-64' : 'w-16'
    } backdrop-blur-xl`}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
            <span className="text-white font-bold text-sm">HR</span>
          </div>
          {isOpen && (
            <div className="animate-slide-in">
              <h1 className="text-xl font-bold gradient-text">HRMS Lite</h1>
              <p className="text-xs text-muted-foreground">Employee Management</p>
            </div>
          )}
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.name}>
              <button
                onClick={() => {
                  onPageChange(item.name);
                  navigate(item.href);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden ${
                  isMenuActive(item)
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
                type="button"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <span className="flex-1 text-left">{item.name}</span>
                )}
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
