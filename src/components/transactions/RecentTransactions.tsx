
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionCard } from "./TransactionCard";
import { mockTransactions } from "@/data/mockData";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function RecentTransactions() {
  const navigate = useNavigate();
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
  
  // Add safety check for mockTransactions
  const transactions = mockTransactions || [];
  const recentTransactions = transactions.slice(0, 5);

  const handleViewAll = () => {
    try {
      navigate('/transactions');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Transactions récentes</h3>
          <p className="text-sm text-gray-500">Dernières opérations effectuées</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleViewAll}>
          Voir tout
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <TransactionCard 
              key={transaction.id} 
              transaction={transaction}
              primaryCurrency={primaryCurrency}
              secondaryCurrency={secondaryCurrency}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucune transaction récente
          </div>
        )}
      </div>
    </Card>
  );
}
