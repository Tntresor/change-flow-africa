
import { useState, useCallback } from "react";
import { Transaction } from "@/types/transaction";
import { mockTransactions } from "@/data/mockData";
import { useLiquidityManager } from "./useLiquidityManager";
import { useTransactionValidation } from "./useTransactionValidation";
import { useToast } from "@/hooks/use-toast";

export function useTransactionState() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { updateBalanceAfterTransaction } = useLiquidityManager();
  const { validateTransaction } = useTransactionValidation();
  const { toast } = useToast();

  const handleViewTransaction = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
  }, []);

  const handleCloseDetailDialog = useCallback(() => {
    setSelectedTransaction(null);
  }, []);

  const handleAddTransaction = useCallback((newTransaction: Transaction) => {
    // Valider la transaction avant de l'ajouter
    const validation = validateTransaction(newTransaction);
    
    if (!validation.isValid) {
      toast({
        title: "Erreur de validation",
        description: validation.errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    // Ajouter l'agent par défaut si non spécifié
    const transactionWithAgent = {
      ...newTransaction,
      agent: newTransaction.agent || {
        id: "emp_1",
        name: "Marie Dubois",
        role: "manager"
      }
    };

    setTransactions(currentTransactions => [transactionWithAgent, ...currentTransactions]);
    
    // Mettre à jour les balances de liquidité
    updateBalanceAfterTransaction(transactionWithAgent);
    
    setShowAddForm(false);
    
    toast({
      title: "Transaction créée",
      description: "La transaction a été créée avec succès",
    });
  }, [validateTransaction, toast, updateBalanceAfterTransaction]);

  const handleCloseAddForm = useCallback(() => {
    setShowAddForm(false);
  }, []);

  const handleOpenAddForm = useCallback(() => {
    setShowAddForm(true);
  }, []);

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
