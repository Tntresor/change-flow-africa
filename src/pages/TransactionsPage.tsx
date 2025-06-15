
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { useTransactionState } from "@/hooks/useTransactionState";
import { TransactionPageLayout } from "@/components/transactions/TransactionPageLayout";
import { TransactionDialogs } from "@/components/transactions/TransactionDialogs";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function TransactionsPage() {
  const {
    transactions,
    selectedTransaction,
    showAddForm,
    handleViewTransaction,
    handleCloseDetailDialog,
    handleAddTransaction,
    handleCloseAddForm: originalCloseAddForm,
    handleOpenAddForm,
  } = useTransactionState();

  const { 
    setFilters, 
    filteredTransactions, 
    hasActiveFilters 
  } = useTransactionFilters(transactions);
  
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      handleOpenAddForm();
    }
  }, [searchParams, handleOpenAddForm]);

  const handleCloseAddForm = () => {
    originalCloseAddForm();
    setSearchParams(params => {
      params.delete('new');
      return params;
    }, { replace: true });
  };

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
