
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";
import { WifiOff, Clock, AlertTriangle } from "lucide-react";

interface CriticalTransactionsSectionProps {
  transactions: Transaction[];
  onViewTransaction: (transaction: Transaction) => void;
}

export function CriticalTransactionsSection({ 
  transactions, 
  onViewTransaction 
}: CriticalTransactionsSectionProps) {
  const offlineTransactions = transactions.filter(t => t.status === 'offline' || t.isOffline);
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const criticalTransactions = [...offlineTransactions, ...pendingTransactions];

  if (criticalTransactions.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 border-orange-200 bg-orange-50">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-600" />
        <h2 className="text-lg font-semibold text-orange-900">Transactions nécessitant une attention</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Transactions Hors Ligne */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <WifiOff className="w-4 h-4 text-gray-600" />
            <h3 className="font-medium text-gray-900">Transactions Hors Ligne</h3>
            <Badge variant="secondary" className="ml-auto">
              {offlineTransactions.length}
            </Badge>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {offlineTransactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <span className="font-mono">{transaction.prefixId}</span>
                <span className="text-gray-600">{transaction.agencyName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewTransaction(transaction)}
                  className="h-6 px-2 text-xs"
                >
                  Voir
                </Button>
              </div>
            ))}
            {offlineTransactions.length > 3 && (
              <p className="text-xs text-gray-500 text-center pt-2">
                +{offlineTransactions.length - 3} autres transactions
              </p>
            )}
          </div>
        </div>

        {/* Transactions En Attente */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-orange-600" />
            <h3 className="font-medium text-gray-900">Transactions En Attente</h3>
            <Badge variant="secondary" className="ml-auto">
              {pendingTransactions.length}
            </Badge>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {pendingTransactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <span className="font-mono">{transaction.prefixId}</span>
                <span className="text-gray-600">{transaction.agencyName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewTransaction(transaction)}
                  className="h-6 px-2 text-xs"
                >
                  Voir
                </Button>
              </div>
            ))}
            {pendingTransactions.length > 3 && (
              <p className="text-xs text-gray-500 text-center pt-2">
                +{pendingTransactions.length - 3} autres transactions
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
