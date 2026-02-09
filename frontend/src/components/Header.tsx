import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  onToggleSidebar: () => void;
  currentPage: string;
}

const Header = ({ onToggleSidebar, currentPage }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 h-16 bg-background/80 backdrop-blur-md border-b border-border supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 transition-all duration-300">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-muted-foreground hover:text-foreground md:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <span className="hover:text-foreground transition-colors cursor-pointer font-medium breadcrumb-link">Home</span>
          <ChevronRight className="w-4 h-4 text-border" />
          <span className="text-foreground font-semibold tracking-tight">{currentPage}</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="h-8 w-px bg-border mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-foreground leading-none">Admin User</p>
            <p className="text-xs text-muted-foreground mt-1">Administrator</p>
          </div>
          <div
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-all duration-300 border border-primary/20 avatar-glow-ring"
            title="Profile"
            tabIndex={0}
            role="button"
          >
            <span className="text-primary text-sm font-bold">AU</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
