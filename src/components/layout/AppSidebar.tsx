
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Home, ArrowRightLeft, Settings, BarChart3, Users, Upload, TrendingUp, Droplets, Building, Beaker } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const menuItems = [
  { title: "Tableau de bord", url: "/dashboard", icon: Home },
  { title: "Transactions", url: "/transactions", icon: ArrowRightLeft },
  { title: "Clients", url: "/customers", icon: Users },
  { title: "Agences", url: "/agencies", icon: Building },
  { title: "Liquidité", url: "/liquidity", icon: Droplets },
  { title: "Taux et commissions", url: "/rates", icon: TrendingUp },
  { title: "Statistiques", url: "/stats", icon: BarChart3 },
  { title: "Import", url: "/import", icon: Upload },
  { title: "Fonctionnalités avancées", url: "/test-features", icon: Beaker },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const [companyName, setCompanyName] = useState("Koba");

  useEffect(() => {
    const loadCompanyName = () => {
      try {
        const savedSettings = localStorage.getItem("koba-general-settings");
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setCompanyName(settings.companyName || "Koba");
        }
      } catch (error) {
        console.error("Error loading company name", error);
      }
    };

    loadCompanyName();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "koba-general-settings") {
        loadCompanyName();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    const handleSettingsUpdate = () => {
      loadCompanyName();
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <ArrowRightLeft className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{companyName}</h1>
            <p className="text-xs text-gray-500">Multi-pays</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-medium">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="hover:bg-blue-50 hover:text-blue-700 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Version 1.0.0 • Beta
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
