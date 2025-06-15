
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TransactionSortButton } from "./TransactionSortButton";

interface TransactionTableHeaderProps {
  onSort: (field: 'timestamp' | 'amount' | 'status' | 'agency') => void;
}

export function TransactionTableHeader({ onSort }: TransactionTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50">
        <TableHead className="w-[100px]">ID</TableHead>
        <TableHead>
          <TransactionSortButton field="timestamp" onSort={onSort}>
            Date
          </TransactionSortButton>
        </TableHead>
        <TableHead>
          <TransactionSortButton field="agency" onSort={onSort}>
            Agence
          </TransactionSortButton>
        </TableHead>
        <TableHead>Catégorie</TableHead>
        <TableHead className="text-right">
          <TransactionSortButton field="amount" onSort={onSort}>
            Montant
          </TransactionSortButton>
        </TableHead>
        <TableHead className="text-right">Converti</TableHead>
        <TableHead>
          <TransactionSortButton field="status" onSort={onSort}>
            Statut
          </TransactionSortButton>
        </TableHead>
        <TableHead>Client</TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
