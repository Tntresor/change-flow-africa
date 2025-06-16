
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roleLabels = {
  agent: "Agent",
  cashier: "Caissier",
  supervisor: "Superviseur", 
  manager: "Manager",
  business_user: "Utilisateur Métier",
  administrator: "Administrateur"
};

const roleColors = {
  agent: "bg-green-100 text-green-800",
  cashier: "bg-blue-100 text-blue-800",
  supervisor: "bg-orange-100 text-orange-800",
  manager: "bg-purple-100 text-purple-800",
  business_user: "bg-yellow-100 text-yellow-800",
  administrator: "bg-red-100 text-red-800"
};

export function UserProfile() {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  if (!authState.user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">
            {authState.user.firstName} {authState.user.lastName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="font-medium">
              {authState.user.firstName} {authState.user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {authState.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1">
          <Badge className={roleColors[authState.user.role]} variant="secondary">
            {roleLabels[authState.user.role]}
          </Badge>
          {authState.user.agencyName && (
            <p className="text-xs text-muted-foreground mt-1">
              {authState.user.agencyName}
            </p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
