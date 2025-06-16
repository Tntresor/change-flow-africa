
import { useLocation, useNavigate } from "react-router-dom";
import { useNavigationTabs } from "@/hooks/useNavigationTabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NavigationTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { visibleTabs } = useNavigationTabs();

  return (
    <div className="flex flex-col gap-2 p-4">
      {visibleTabs.map((tab) => (
        <Button
          key={tab.path}
          variant={location.pathname === tab.path ? "default" : "ghost"}
          className={cn(
            "justify-start",
            location.pathname === tab.path && "bg-blue-100 text-blue-900"
          )}
          onClick={() => navigate(tab.path)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
