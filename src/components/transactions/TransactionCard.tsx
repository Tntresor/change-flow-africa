
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";
import { Clock, CheckCircle, XCircle, Wifi, WifiOff } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TransactionCardProps {
  transaction: Transaction;
}

const statusConfig = {
  pending: { label: "En attente", color: "bg-orange-100 text-orange-800", icon: Clock },
  completed: { label: "Terminée", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejetée", color: "bg-red-100 text-red-800", icon: XCircle },
  offline: { label: "Hors ligne", color: "bg-gray-100 text-gray-800", icon: WifiOff }
};

export function TransactionCard({ transaction }: TransactionCardProps) {
  const status = statusConfig[transaction.status];
  const StatusIcon = status.icon;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow border-l-4" style={{borderLeftColor: transaction.category.color.replace('bg-', '#')}}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${transaction.category.color} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
            {transaction.category.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{transaction.category.name}</p>
            <p className="text-sm text-gray-500">{transaction.agencyName}</p>
          </div>
        </div>
        <Badge className={status.color}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.label}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm text-gray-500">Montant</p>
          <p className="font-semibold text-gray-900">
            {transaction.amount.toLocaleString()} {transaction.fromCurrency}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Converti</p>
          <p className="font-semibold text-gray-900">
            {transaction.convertedAmount.toLocaleString()} {transaction.toCurrency}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {format(transaction.timestamp, "PPp", { locale: fr })}
        </span>
        <div className="flex items-center gap-1">
          {transaction.isOffline ? (
            <WifiOff className="w-3 h-3 text-gray-400" />
          ) : (
            <Wifi className="w-3 h-3 text-green-500" />
          )}
          <span className="text-gray-600">
            Taux: {transaction.exchangeRate}
          </span>
        </div>
      </div>
      
      {transaction.customerName && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-600">Client: {transaction.customerName}</p>
        </div>
      )}
    </Card>
  );
}
