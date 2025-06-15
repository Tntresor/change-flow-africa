
import { useState } from "react";
import { Transaction } from "@/types/transaction";
import { Card } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { TransactionTableHeader } from "./TransactionTableHeader";
import { TransactionTableRow } from "./TransactionTableRow";
import { TransactionTablePagination } from "./TransactionTablePagination";

interface TransactionTableProps {
  transactions: Transaction[];
  onViewTransaction: (transaction: Transaction) => void;
}

type SortField = 'timestamp' | 'amount' | 'status' | 'agency';
type SortDirection = 'asc' | 'desc';

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

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TransactionTableHeader onSort={handleSort} />
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TransactionTableRow
                key={transaction.id}
                transaction={transaction}
                onViewTransaction={onViewTransaction}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      <TransactionTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={transactions.length}
        onPageChange={setCurrentPage}
      />
    </Card>
  );
}
