
import { useLocation } from "react-router-dom";

interface NavigationTab {
  label: string;
  path: string;
  icon?: string;
}

export function useNavigationTabs() {
  const location = useLocation();

  const allTabs: NavigationTab[] = [
    { label: "Tableau de bord", path: "/dashboard" },
    { label: "Transactions", path: "/transactions" },
    { label: "Liquidité", path: "/liquidity" },
    { label: "Agences", path: "/agencies" },
    { label: "Clients", path: "/customers" },
    { label: "Taux et Tarifs", path: "/rates" },
    { label: "Statistiques", path: "/stats" },
    { label: "Import", path: "/import" },
    { label: "Paramètres", path: "/settings" },
    { label: "Test Fonctionnalités", path: "/test-features" },
    { label: "Nouvelles fonctionnalités", path: "/test-new-features" },
  ];

  const visibleTabs = allTabs;

  return {
    visibleTabs,
    currentPath: location.pathname
  };
}
