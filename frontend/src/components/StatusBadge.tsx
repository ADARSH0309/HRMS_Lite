import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "Present" | "Absent";
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const isPresent = status === "Present";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105",
        isPresent
          ? "bg-green-500/10 text-green-600 dark:bg-green-500/15 dark:text-green-400 border border-green-500/20"
          : "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400 border border-red-500/20",
        className
      )}
    >
      {isPresent ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <XCircle className="w-3 h-3" />
      )}
      {status}
    </span>
  );
}
