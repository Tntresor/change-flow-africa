
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentTransactions } from "@/components/transactions/RecentTransactions";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, Building } from "lucide-react";
import { mockTransactions, mockAgencies, formatAmount } from "@/data/mockData";

export default function Dashboard() {
  const [primaryCurrency, setPrimaryCurrency] = useState("XOF");
  const [secondaryCurrency, setSecondaryCurrency] = useState("MAD");

  useEffect(() => {
    const loadCurrencySettings = () => {
      const primary = localStorage.getItem("exchangehub-primary-currency") || "XOF";
      const secondary = localStorage.getItem("exchangehub-secondary-currency") || "MAD";
      setPrimaryCurrency(primary);
      setSecondaryCurrency(secondary);
    };

    loadCurrencySettings();

    const handleSettingsUpdate = () => {
      loadCurrencySettings();
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  // Calculer les statistiques globales
  const totalTransactions = mockTransactions.length;
  const completedTransactions = mockTransactions.filter(t => t.status === 'completed').length;
  const totalVolume = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
  const activeAgencies = mockAgencies.filter(a => a.isActive).length;

  // Realistic exchange rates for our currencies
  const exchangeRates = {
    "EUR_XOF": 656.95,
    "EUR_MAD": 11.2,
    "EUR_USD": 1.1,
    "EUR_AED": 4.0,
    "EUR_RWF": 1100,
    "USD_XOF": 600.5,
    "USD_MAD": 10.2,
    "USD_AED": 3.67,
    "USD_RWF": 1000,
    "XOF_MAD": 0.017,
    "MAD_AED": 0.36,
    "AED_RWF": 275
  };

  const getDisplayRates = () => {
    const rates = [];
    
    // Always show EUR rates as they're common
    rates.push({ from: "EUR", to: primaryCurrency, rate: exchangeRates[`EUR_${primaryCurrency}`] || "N/A" });
    if (secondaryCurrency !== primaryCurrency) {
      rates.push({ from: "EUR", to: secondaryCurrency, rate: exchangeRates[`EUR_${secondaryCurrency}`] || "N/A" });
    }
    
    // Show USD rates
    rates.push({ from: "USD", to: primaryCurrency, rate: exchangeRates[`USD_${primaryCurrency}`] || "N/A" });
    
    return rates.slice(0, 3); // Limit to 3 rates for clean display
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre activité d'échange de devises</p>
      </div>
      
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {completedTransactions} complétées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(totalVolume, primaryCurrency)}</div>
            <p className="text-xs text-muted-foreground">
              En {primaryCurrency}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agences Actives</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgencies}</div>
            <p className="text-xs text-muted-foreground">
              Sur {mockAgencies.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTransactions > 0 ? Math.round((completedTransactions / totalTransactions) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Transactions complétées
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Taux de change</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getDisplayRates().map((rate, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{rate.from} → {rate.to}</span>
                    <span className="font-semibold">{rate.rate}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
