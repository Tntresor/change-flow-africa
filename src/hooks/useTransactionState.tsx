
import { useState, useCallback } from "react";
import { Transaction } from "@/types/transaction";
import { mockTransactions } from "@/data/mockData";
import { useLiquidityManager } from "./useLiquidityManager";
import { useTransactionValidation } from "./useTransactionValidation";
import { useToast } from "@/hooks/use-toast";
import { LedgerService } from "@/services/ledgerService";

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
    
    // Générer automatiquement les écritures comptables
    try {
      LedgerService.autoGenerateLedgerEntries(transactionWithAgent);
      console.log('Écritures comptables générées automatiquement pour la transaction:', transactionWithAgent.id);
    } catch (error) {
      console.error('Erreur lors de la génération des écritures comptables:', error);
      toast({
        title: "Avertissement",
        description: "Transaction créée mais erreur lors de la génération des écritures comptables",
        variant: "destructive",
      });
    }
    
    setShowAddForm(false);
    
    toast({
      title: "Transaction créée",
      description: "La transaction et ses écritures comptables ont été créées avec succès",
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
