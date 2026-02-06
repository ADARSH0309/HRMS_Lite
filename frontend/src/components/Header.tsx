import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onToggleSidebar: () => void;
  currentPage: string;
}

const Header = ({ onToggleSidebar, currentPage }: HeaderProps) => {
  return (
    <header className="h-16 glass-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:scale-110 transition-all duration-300"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-semibold">{currentPage}</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
          title="Profile"
          tabIndex={0}
          role="button"
        >
          <span className="text-white text-sm font-bold">A</span>
        </div>
      </div>
    </header>
  );
};

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default Header;
