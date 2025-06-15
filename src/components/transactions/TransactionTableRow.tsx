
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";
import { Clock, CheckCircle, XCircle, WifiOff, Eye, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TransactionTableRowProps {
  transaction: Transaction;
  onViewTransaction: (transaction: Transaction) => void;
}

const statusConfig = {
  pending: { label: "En attente", color: "bg-orange-100 text-orange-800", icon: Clock },
  completed: { label: "Terminée", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejetée", color: "bg-red-100 text-red-800", icon: XCircle },
  offline: { label: "Hors ligne", color: "bg-gray-100 text-gray-800", icon: WifiOff }
};

export function TransactionTableRow({ transaction, onViewTransaction }: TransactionTableRowProps) {
  const status = statusConfig[transaction.status];
  const StatusIcon = status.icon;

  return (
    <TableRow key={transaction.id} className="hover:bg-gray-50">
      <TableCell className="font-mono text-sm">
        {transaction.prefixId || transaction.id.slice(0, 8)}
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {format(transaction.timestamp, "dd/MM/yyyy", { locale: fr })}
        </div>
        <div className="text-xs text-gray-500">
          {format(transaction.timestamp, "HH:mm", { locale: fr })}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-medium">{transaction.agencyName}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div 
            className={`w-6 h-6 ${transaction.category.color} rounded-full flex items-center justify-center text-white text-xs font-medium`}
          >
            {transaction.category.name.charAt(0)}
          </div>
          <span className="text-sm">{transaction.category.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="font-semibold">
          {transaction.amount.toLocaleString()} {transaction.fromCurrency}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="font-semibold">
          {transaction.convertedAmount.toLocaleString()} {transaction.toCurrency}
        </div>
        <div className="text-xs text-gray-500">
          Taux: {transaction.exchangeRate}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={status.color}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.label}
        </Badge>
      </TableCell>
      <TableCell>
        {transaction.customerName ? (
          <div className="text-sm">
            <div className="font-medium">{transaction.customerName}</div>
            {transaction.customerPhone && (
              <div className="text-gray-500">{transaction.customerPhone}</div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewTransaction(transaction)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
