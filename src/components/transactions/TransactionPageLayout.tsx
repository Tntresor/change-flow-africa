
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionPageHeader } from "@/components/transactions/TransactionPageHeader";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { CriticalTransactionsSection } from "@/components/transactions/CriticalTransactionsSection";
import { Transaction } from "@/types/transaction";
import { FilterState } from "@/components/transactions/TransactionFilters";

interface TransactionPageLayoutProps {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  hasActiveFilters: boolean;
  onAddTransaction: () => void;
  onViewTransaction: (transaction: Transaction) => void;
  onFiltersChange: (filters: FilterState) => void;
}

export function TransactionPageLayout({
  transactions,
  filteredTransactions,
  hasActiveFilters,
  onAddTransaction,
  onViewTransaction,
  onFiltersChange
}: TransactionPageLayoutProps) {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <TransactionPageHeader
        transactionCount={filteredTransactions.length}
        hasFilters={hasActiveFilters}
        onAddTransaction={onAddTransaction}
      />

      {/* Section Transactions Critiques */}
      <CriticalTransactionsSection
        transactions={transactions}
        onViewTransaction={onViewTransaction}
      />

      {/* Statistiques rapides */}
      <TransactionStats transactions={filteredTransactions} />

      {/* Filtres */}
      <TransactionFilters onFiltersChange={onFiltersChange} />

      {/* Tableau des transactions */}
      <TransactionTable 
        transactions={filteredTransactions}
        onViewTransaction={onViewTransaction}
      />
    </div>
  );
}
