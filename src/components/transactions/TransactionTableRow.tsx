
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";
import { Clock, CheckCircle, XCircle, WifiOff, Eye, MoreHorizontal, ArrowRight, Building, Globe, Users } from "lucide-react";
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

const typeConfig = {
  internal_transfer: { label: "Transfert interne", color: "bg-blue-500", icon: Building },
  international_transfer: { label: "Transfert international", color: "bg-purple-500", icon: Globe },
  currency_exchange: { label: "Change", color: "bg-green-500", icon: ArrowRight },
  payment: { label: "Paiement", color: "bg-orange-500", icon: Users }
};

export function TransactionTableRow({ transaction, onViewTransaction }: TransactionTableRowProps) {
  const status = statusConfig[transaction.status];
  const type = typeConfig[transaction.type];
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;

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
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 ${type.color} rounded-full flex items-center justify-center text-white`}>
            <TypeIcon className="w-3 h-3" />
          </div>
          <span className="text-sm">{type.label}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <span className="font-medium">{transaction.origin.name}</span>
            <ArrowRight className="w-3 h-3 text-gray-400" />
            <span className="font-medium">{transaction.destination.name}</span>
          </div>
          <div className="text-xs text-gray-500">
            {transaction.origin.country} → {transaction.destination.country}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div className="font-medium">{transaction.sender.name}</div>
          <div className="text-xs text-gray-500 truncate">{transaction.sender.phone}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div className="font-medium">{transaction.receiver.name}</div>
          <div className="text-xs text-gray-500 truncate">{transaction.receiver.phone}</div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="font-semibold">
          {transaction.amount.toLocaleString()} {transaction.fromCurrency}
        </div>
        <div className="text-xs text-gray-500">
          → {transaction.convertedAmount.toLocaleString()} {transaction.toCurrency}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="text-xs text-gray-500">
          Base: {transaction.exchangeRate.toFixed(4)}
        </div>
        <div className="text-xs text-orange-600">
          +{transaction.spread.toFixed(4)}
        </div>
        <div className="font-semibold text-green-600">
          = {transaction.finalRate.toFixed(4)}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={status.color}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.label}
        </Badge>
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
