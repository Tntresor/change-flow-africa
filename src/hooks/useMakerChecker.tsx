
import { useState, useCallback } from "react";
import { MakerCheckerService } from "@/services/makerCheckerService";
import { Transaction } from "@/types/transaction";
import { TransactionApproval, PendingTransaction } from "@/types/makerChecker";
import { useToast } from "@/hooks/use-toast";

export function useMakerChecker() {
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const { toast } = useToast();

  const checkTransactionApproval = useCallback((transaction: Partial<Transaction>) => {
    const result = MakerCheckerService.checkTransactionRequiresApproval(transaction);
    
    if (result.error) {
      toast({
        title: "Erreur de validation",
        description: result.error,
        variant: "destructive"
      });
    }
    
    return result;
  }, [toast]);

  const submitForApproval = useCallback((
    transaction: Partial<Transaction>,
    requestedBy: string,
    requestedByName: string
  ) => {
    // Validation des paramètres d'entrée
    if (!requestedBy?.trim() || !requestedByName?.trim()) {
      toast({
        title: "Erreur",
        description: "Informations du demandeur manquantes",
        variant: "destructive"
      });
      return { success: false, error: "Informations du demandeur manquantes" };
    }

    const approvalCheck = MakerCheckerService.checkTransactionRequiresApproval(transaction);
    
    if (approvalCheck.error) {
      toast({
        title: "Erreur de validation",
        description: approvalCheck.error,
        variant: "destructive"
      });
      return { success: false, error: approvalCheck.error };
    }
    
    if (!approvalCheck.requiresApproval || !approvalCheck.rule) {
      toast({
        title: "Information",
        description: "Cette transaction ne nécessite pas d'approbation",
      });
      return { success: false, error: "Cette transaction ne nécessite pas d'approbation" };
    }

    const approvalRequest = MakerCheckerService.createApprovalRequest(
      transaction,
      approvalCheck.rule,
      requestedBy,
      requestedByName
    );

    if (!approvalRequest) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande d'approbation",
        variant: "destructive"
      });
      return { success: false, error: "Impossible de créer la demande d'approbation" };
    }

    const pendingTransaction: PendingTransaction = {
      id: `pending_${Date.now()}`,
      originalTransaction: transaction,
      approvalRequest,
      ruleTriggered: approvalCheck.rule
    };

    setPendingTransactions(prev => [...prev, pendingTransaction]);

    toast({
      title: "Transaction soumise pour approbation",
      description: `La transaction nécessite une approbation car elle dépasse ${approvalCheck.rule.maxAmount.toLocaleString()} ${approvalCheck.rule.currency}`,
    });

    return { success: true, pendingTransaction };
  }, [toast]);

  const approveTransaction = useCallback((
    approvalId: string,
    approvedBy: string,
    approvedByName: string,
    comments?: string
  ) => {
    if (!approvalId?.trim() || !approvedBy?.trim() || !approvedByName?.trim()) {
      toast({
        title: "Erreur",
        description: "Paramètres d'approbation manquants",
        variant: "destructive"
      });
      return;
    }

    setPendingTransactions(prev => prev.map(pending => {
      if (pending.approvalRequest.id === approvalId) {
        return {
          ...pending,
          approvalRequest: {
            ...pending.approvalRequest,
            status: 'approved',
            approvedBy: approvedBy.trim(),
            approvedByName: approvedByName.trim(),
            approvedAt: new Date(),
            comments: comments?.trim()
          }
        };
      }
      return pending;
    }));

    toast({
      title: "Transaction approuvée",
      description: "La transaction peut maintenant être exécutée",
    });
  }, [toast]);

  const rejectTransaction = useCallback((
    approvalId: string,
    approvedBy: string,
    approvedByName: string,
    rejectionReason: string
  ) => {
    if (!approvalId?.trim() || !approvedBy?.trim() || !approvedByName?.trim() || !rejectionReason?.trim()) {
      toast({
        title: "Erreur",
        description: "Paramètres de rejet manquants",
        variant: "destructive"
      });
      return;
    }

    if (rejectionReason.trim().length < 5) {
      toast({
        title: "Erreur",
        description: "La raison du rejet doit contenir au moins 5 caractères",
        variant: "destructive"
      });
      return;
    }

    setPendingTransactions(prev => prev.map(pending => {
      if (pending.approvalRequest.id === approvalId) {
        return {
          ...pending,
          approvalRequest: {
            ...pending.approvalRequest,
            status: 'rejected',
            approvedBy: approvedBy.trim(),
            approvedByName: approvedByName.trim(),
            approvedAt: new Date(),
            rejectionReason: rejectionReason.trim()
          }
        };
      }
      return pending;
    }));

    toast({
      title: "Transaction rejetée",
      description: rejectionReason,
      variant: "destructive"
    });
  }, [toast]);

  return {
    pendingTransactions,
    checkTransactionApproval,
    submitForApproval,
    approveTransaction,
    rejectTransaction
  };
}
