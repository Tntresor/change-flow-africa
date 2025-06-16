
import { useAuth } from "@/hooks/useAuth";

export function useNavigationTabs() {
  const { hasPermission, authState } = useAuth();

  const getVisibleTabs = () => {
    const tabs = [];

    // Dashboard - toujours visible
    tabs.push({
      path: "/",
      label: "Tableau de bord",
      permission: null
    });

    // Transactions - visible pour tous les utilisateurs connectés
    tabs.push({
      path: "/transactions",
      label: "Transactions",
      permission: null
    });

    // Clients - visible pour tous les utilisateurs connectés
    tabs.push({
      path: "/customers",
      label: "Clients",
      permission: null
    });

    // Agences - seulement pour ceux qui peuvent voir toutes les agences
    if (hasPermission('view_all_agencies')) {
      tabs.push({
        path: "/agencies",
        label: "Agences",
        permission: "view_all_agencies"
      });
    }

    // Liquidité - seulement pour ceux qui peuvent gérer la liquidité
    if (hasPermission('manage_liquidity')) {
      tabs.push({
        path: "/liquidity",
        label: "Liquidité",
        permission: "manage_liquidity"
      });
    }

    // Statistiques - seulement pour ceux qui peuvent voir les rapports
    if (hasPermission('view_reports')) {
      tabs.push({
        path: "/stats",
        label: "Statistiques",
        permission: "view_reports"
      });
    }

    // Import - seulement pour les administrateurs système
    if (hasPermission('manage_system')) {
      tabs.push({
        path: "/import",
        label: "Import",
        permission: "manage_system"
      });
    }

    // Taux - seulement pour les administrateurs système
    if (hasPermission('manage_system')) {
      tabs.push({
        path: "/rates",
        label: "Taux",
        permission: "manage_system"
      });
    }

    return tabs;
  };

  return {
    visibleTabs: getVisibleTabs(),
    hasPermission
  };
}
