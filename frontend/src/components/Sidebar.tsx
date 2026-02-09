import { LayoutDashboard, Users, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Employees", icon: Users, href: "/employees" },
    { name: "Attendance", icon: Clock, href: "/attendance" },
  ];

  function isMenuActive(item: { name: string; href: string }): boolean {
    return location.pathname === item.href ||
      (item.href !== "/" && location.pathname.startsWith(item.href));
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className={`fixed left-0 top-0 h-full bg-sidebar/95 backdrop-blur-xl text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col ${isOpen ? 'w-[250px]' : 'w-20'
        }`}>
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-sm">HR</span>
            </div>
            {isOpen && (
              <div className="overflow-hidden whitespace-nowrap">
                <h1 className="text-sm font-semibold tracking-tight">HRMS Lite</h1>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const active = isMenuActive(item);
            const button = (
              <button
                onClick={() => {
                  onPageChange(item.name);
                  navigate(item.href);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative group sidebar-indicator ${active
                  ? 'active bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 sidebar-active-glow'
                  : 'text-sidebar-foreground/60 hover:text-foreground hover:bg-sidebar-accent/50 hover:translate-x-1'
                  }`}
                type="button"
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-white' : ''}`} />
                {isOpen && (
                  <span className="flex-1 text-left truncate animate-slide-in-left">{item.name}</span>
                )}
              </button>
            );

            return (
              <div key={item.name}>
                {!isOpen ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="right" className="bg-sidebar text-white border-sidebar-border">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  button
                )}
              </div>
            );
          })}
        </nav>

        {isOpen && (
          <div className="p-4 border-t border-sidebar-border/50">
            <div className="text-xs text-sidebar-foreground/40 text-center">
              v1.0.0
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
