
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/atoms/Button/Button";
import { Bell, Plus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { UserProfile } from "@/components/auth/UserProfile";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const navigate = useNavigate();
  const { title, description } = usePageTitle();
  const { hasPermission } = useAuth();

  const handleNewTransaction = () => {
    navigate('/transactions?new=true');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
          
          {hasPermission('create_transaction') && (
            <Button 
              size="sm" 
              className="gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={handleNewTransaction}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouvelle transaction</span>
            </Button>
          )}
          
          {hasPermission('manage_system') && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSettings}
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
          
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
