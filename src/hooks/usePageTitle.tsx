
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function usePageTitle() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Tableau de bord";
      case "/transactions":
        return "Transactions";
      case "/agencies":
        return "Agences";
      case "/liquidity":
        return "Liquidité";
      case "/stats":
        return "Statistiques";
      case "/import":
        return "Import";
      case "/rates":
        return "Taux et Commissions";
      case "/settings":
        return "Paramètres";
      default:
        return "Tableau de bord";
    }
  };

  useEffect(() => {
    document.title = `${getPageTitle()} - Money Transfer`;
  }, [location.pathname]);

  return getPageTitle();
}
