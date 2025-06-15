
import { useState } from "react";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { TransactionPageLayout } from "@/components/transactions/TransactionPageLayout";
import { TransactionDialogs } from "@/components/transactions/TransactionDialogs";
import { Transaction } from "@/types/transaction";
import { mockTransactions } from "@/data/mockData";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { 
    filters, 
    setFilters, 
    filteredTransactions, 
    hasActiveFilters 
  } = useTransactionFilters(transactions);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseDetailDialog = () => {
    setSelectedTransaction(null);
  };

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([newTransaction, ...transactions]);
    setShowAddForm(false);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  return (
    <>
      <TransactionPageLayout
        transactions={transactions}
        filteredTransactions={filteredTransactions}
        hasActiveFilters={hasActiveFilters}
        onAddTransaction={() => setShowAddForm(true)}
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
