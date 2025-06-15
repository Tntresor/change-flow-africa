
import { useState } from "react";
import { Transaction } from "@/types/transaction";
import { mockTransactions } from "@/data/mockData";

export function useTransactionState() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

  const handleOpenAddForm = () => {
    setShowAddForm(true);
  };

  return {
    transactions,
    selectedTransaction,
    showAddForm,
    handleViewTransaction,
    handleCloseDetailDialog,
    handleAddTransaction,
    handleCloseAddForm,
    handleOpenAddForm,
  };
}
