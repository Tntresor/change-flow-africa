
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionCard } from "./TransactionCard";
import { mockTransactions } from "@/data/mockData";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function RecentTransactions() {
  const navigate = useNavigate();
  const recentTransactions = mockTransactions.slice(0, 5);

  const handleViewAll = () => {
    navigate('/transactions');
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
        {recentTransactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </Card>
  );
}
