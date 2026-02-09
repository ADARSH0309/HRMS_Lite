import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-muted-foreground hover:text-foreground theme-toggle-icon"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Moon key="moon" className="w-5 h-5 animate-flip-in" />
      ) : (
        <Sun key="sun" className="w-5 h-5 animate-flip-in" />
      )}
    </Button>
  );
}
