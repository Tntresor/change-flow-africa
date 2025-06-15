
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function usePageTitle() {
  const location = useLocation();

  const getPageInfo = () => {
    switch (location.pathname) {
      case "/":
        return { title: "Tableau de bord", description: "Vue d'ensemble des activités" };
      case "/transactions":
        return { title: "Transactions", description: "Gérez et suivez toutes les transactions" };
      case "/agencies":
        return { title: "Agences", description: "Gérez vos agences et leurs employés" };
      case "/liquidity":
        return { title: "Liquidité", description: "Suivez la liquidité de vos agences" };
      case "/stats":
        return { title: "Statistiques", description: "Analysez les performances de votre activité" };
      case "/import":
        return { title: "Import", description: "Importez des données en masse" };
      case "/rates":
        return { title: "Taux et Commissions", description: "Configurez les taux de change et les frais" };
      case "/settings":
        return { title: "Paramètres", description: "Gérez les paramètres de l'application" };
      default:
        return { title: "Tableau de bord", description: "Vue d'ensemble des activités" };
    }
  };

  const pageInfo = getPageInfo();

  useEffect(() => {
    document.title = `${pageInfo.title} - Money Transfer`;
  }, [location.pathname, pageInfo.title]);

  return pageInfo;
}
