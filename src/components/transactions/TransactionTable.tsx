
import { useState } from "react";
import { Transaction } from "@/types/transaction";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  WifiOff, 
  Eye, 
  MoreHorizontal,
  ArrowUpDown
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TransactionTableProps {
  transactions: Transaction[];
  onViewTransaction: (transaction: Transaction) => void;
}

type SortField = 'timestamp' | 'amount' | 'status' | 'agency';
type SortDirection = 'asc' | 'desc';

const statusConfig = {
  pending: { label: "En attente", color: "bg-orange-100 text-orange-800", icon: Clock },
  completed: { label: "Terminée", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejetée", color: "bg-red-100 text-red-800", icon: XCircle },
  offline: { label: "Hors ligne", color: "bg-gray-100 text-gray-800", icon: WifiOff }
};

export function TransactionTable({ transactions, onViewTransaction }: TransactionTableProps) {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'timestamp') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (sortField === 'agency') {
      aValue = a.agencyName;
      bValue = b.agencyName;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="h-8 p-0 font-medium hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>
                <SortButton field="timestamp">Date</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="agency">Agence</SortButton>
              </TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">
                <SortButton field="amount">Montant</SortButton>
              </TableHead>
              <TableHead className="text-right">Converti</TableHead>
              <TableHead>
                <SortButton field="status">Statut</SortButton>
              </TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => {
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
            })}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, transactions.length)} sur {transactions.length} transactions
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <span className="text-sm">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
