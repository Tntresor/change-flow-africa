
import { useState, useCallback } from "react";
import { MakerCheckerService } from "@/services/makerCheckerService";
import { Transaction } from "@/types/transaction";
import { TransactionApproval, PendingTransaction } from "@/types/makerChecker";
import { useToast } from "@/hooks/use-toast";

export function useMakerChecker() {
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const { toast } = useToast();

  const checkTransactionApproval = useCallback((transaction: Partial<Transaction>) => {
    return MakerCheckerService.checkTransactionRequiresApproval(transaction);
  }, []);

  const submitForApproval = useCallback((
    transaction: Partial<Transaction>,
    requestedBy: string,
    requestedByName: string
  ) => {
    const approvalCheck = MakerCheckerService.checkTransactionRequiresApproval(transaction);
    
    if (!approvalCheck.requiresApproval || !approvalCheck.rule) {
      return { success: false, error: "Cette transaction ne nécessite pas d'approbation" };
    }

    const approvalRequest = MakerCheckerService.createApprovalRequest(
      transaction,
      approvalCheck.rule,
      requestedBy,
      requestedByName
    );

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
    setPendingTransactions(prev => prev.map(pending => {
      if (pending.approvalRequest.id === approvalId) {
        return {
          ...pending,
          approvalRequest: {
            ...pending.approvalRequest,
            status: 'approved',
            approvedBy,
            approvedByName,
            approvedAt: new Date(),
            comments
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
    setPendingTransactions(prev => prev.map(pending => {
      if (pending.approvalRequest.id === approvalId) {
        return {
          ...pending,
          approvalRequest: {
            ...pending.approvalRequest,
            status: 'rejected',
            approvedBy,
            approvedByName,
            approvedAt: new Date(),
            rejectionReason
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
