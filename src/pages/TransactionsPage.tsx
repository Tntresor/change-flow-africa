
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { useTransactionState } from "@/hooks/useTransactionState";
import { TransactionPageLayout } from "@/components/transactions/TransactionPageLayout";
import { TransactionDialogs } from "@/components/transactions/TransactionDialogs";

export default function TransactionsPage() {
  const {
    transactions,
    selectedTransaction,
    showAddForm,
    handleViewTransaction,
    handleCloseDetailDialog,
    handleAddTransaction,
    handleCloseAddForm,
    handleOpenAddForm,
  } = useTransactionState();

  const { 
    setFilters, 
    filteredTransactions, 
    hasActiveFilters 
  } = useTransactionFilters(transactions);

  return (
    <>
      <TransactionPageLayout
        transactions={transactions}
        filteredTransactions={filteredTransactions}
        hasActiveFilters={hasActiveFilters}
        onAddTransaction={handleOpenAddForm}
        onViewTransaction={handleViewTransaction}
        onFiltersChange={setFilters}
      />

      <TransactionDialogs
        selectedTransaction={selectedTransaction}
        showAddForm={showAddForm}
        onCloseDetailDialog={handleCloseDetailDialog}
        onCloseAddForm={handleCloseAddForm}
        onAddTransaction={handleAddTransaction}
      />
    </>
  );
}
