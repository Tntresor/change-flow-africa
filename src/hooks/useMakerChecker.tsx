
import { useState, useCallback } from "react";
import { MakerCheckerService } from "@/services/makerCheckerService";
import { Transaction } from "@/types/transaction";
import { TransactionApproval, PendingTransaction } from "@/types/makerChecker";
import { useToast } from "@/hooks/use-toast";

export function useMakerChecker() {
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const { toast } = useToast();

  const checkTransactionApproval = useCallback((transaction: Partial<Transaction>) => {
    try {
      const result = MakerCheckerService.checkTransactionRequiresApproval(transaction);
      
      if (result.error) {
        toast({
          title: "Erreur de validation",
          description: result.error,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error("Erreur lors de la vérification d'approbation:", error);
      toast({
        title: "Erreur système",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
      return { requiresApproval: false, error: "Erreur système" };
    }
  }, [toast]);

  const submitForApproval = useCallback((
    transaction: Partial<Transaction>,
    requestedBy: string,
    requestedByName: string
  ) => {
    try {
      // Validation stricte des paramètres d'entrée
      if (!requestedBy?.trim() || requestedBy.trim().length < 3) {
        const errorMsg = "ID du demandeur invalide (minimum 3 caractères)";
        toast({
          title: "Erreur",
          description: errorMsg,
          variant: "destructive"
        });
        return { success: false, error: errorMsg };
      }

      if (!requestedByName?.trim() || requestedByName.trim().length < 2) {
        const errorMsg = "Nom du demandeur invalide (minimum 2 caractères)";
        toast({
          title: "Erreur",
          description: errorMsg,
          variant: "destructive"
        });
        return { success: false, error: errorMsg };
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
        requestedBy.trim(),
        requestedByName.trim()
      );

      if (!approvalRequest) {
        const errorMsg = "Impossible de créer la demande d'approbation";
        toast({
          title: "Erreur",
          description: errorMsg,
          variant: "destructive"
        });
        return { success: false, error: errorMsg };
      }

      const pendingTransaction: PendingTransaction = {
        id: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
    } catch (error) {
      console.error("Erreur lors de la soumission pour approbation:", error);
      const errorMsg = "Erreur système lors de la soumission";
      toast({
        title: "Erreur système",
        description: errorMsg,
        variant: "destructive"
      });
      return { success: false, error: errorMsg };
    }
  }, [toast]);

  const approveTransaction = useCallback((
    approvalId: string,
    approvedBy: string,
    approvedByName: string,
    comments?: string
  ) => {
    try {
      // Validation stricte des paramètres
      if (!approvalId?.trim()) {
        toast({
          title: "Erreur",
          description: "ID d'approbation manquant",
          variant: "destructive"
        });
        return;
      }

      if (!approvedBy?.trim() || approvedBy.trim().length < 3) {
        toast({
          title: "Erreur",
          description: "ID approbateur invalide (minimum 3 caractères)",
          variant: "destructive"
        });
        return;
      }

      if (!approvedByName?.trim() || approvedByName.trim().length < 2) {
        toast({
          title: "Erreur",
          description: "Nom approbateur invalide (minimum 2 caractères)",
          variant: "destructive"
        });
        return;
      }

      // Vérifier que l'approbation existe et est en attente
      const pendingTransaction = pendingTransactions.find(
        p => p.approvalRequest.id === approvalId.trim()
      );

      if (!pendingTransaction) {
        toast({
          title: "Erreur",
          description: "Demande d'approbation introuvable",
          variant: "destructive"
        });
        return;
      }

      if (pendingTransaction.approvalRequest.status !== 'pending') {
        toast({
          title: "Erreur",
          description: "Cette demande a déjà été traitée",
          variant: "destructive"
        });
        return;
      }

      setPendingTransactions(prev => prev.map(pending => {
        if (pending.approvalRequest.id === approvalId.trim()) {
          return {
            ...pending,
            approvalRequest: {
              ...pending.approvalRequest,
              status: 'approved',
              approvedBy: approvedBy.trim(),
              approvedByName: approvedByName.trim(),
              approvedAt: new Date(),
              comments: comments?.trim() || undefined
            }
          };
        }
        return pending;
      }));

      toast({
        title: "Transaction approuvée",
        description: "La transaction peut maintenant être exécutée",
      });
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
      toast({
        title: "Erreur système",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    }
  }, [toast, pendingTransactions]);

  const rejectTransaction = useCallback((
    approvalId: string,
    approvedBy: string,
    approvedByName: string,
    rejectionReason: string
  ) => {
    try {
      // Validation stricte des paramètres
      if (!approvalId?.trim()) {
        toast({
          title: "Erreur",
          description: "ID d'approbation manquant",
          variant: "destructive"
        });
        return;
      }

      if (!approvedBy?.trim() || approvedBy.trim().length < 3) {
        toast({
          title: "Erreur",
          description: "ID approbateur invalide (minimum 3 caractères)",
          variant: "destructive"
        });
        return;
      }

      if (!approvedByName?.trim() || approvedByName.trim().length < 2) {
        toast({
          title: "Erreur",
          description: "Nom approbateur invalide (minimum 2 caractères)",
          variant: "destructive"
        });
        return;
      }

      if (!rejectionReason?.trim() || rejectionReason.trim().length < 5) {
        toast({
          title: "Erreur",
          description: "La raison du rejet doit contenir au moins 5 caractères",
          variant: "destructive"
        });
        return;
      }

      if (rejectionReason.trim().length > 500) {
        toast({
          title: "Erreur",
          description: "La raison du rejet ne peut dépasser 500 caractères",
          variant: "destructive"
        });
        return;
      }

      // Vérifier que l'approbation existe et est en attente
      const pendingTransaction = pendingTransactions.find(
        p => p.approvalRequest.id === approvalId.trim()
      );

      if (!pendingTransaction) {
        toast({
          title: "Erreur",
          description: "Demande d'approbation introuvable",
          variant: "destructive"
        });
        return;
      }

      if (pendingTransaction.approvalRequest.status !== 'pending') {
        toast({
          title: "Erreur",
          description: "Cette demande a déjà été traitée",
          variant: "destructive"
        });
        return;
      }

      setPendingTransactions(prev => prev.map(pending => {
        if (pending.approvalRequest.id === approvalId.trim()) {
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
        description: rejectionReason.trim(),
        variant: "destructive"
      });
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
      toast({
        title: "Erreur système",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    }
  }, [toast, pendingTransactions]);

  return {
    pendingTransactions,
    checkTransactionApproval,
    submitForApproval,
    approveTransaction,
    rejectTransaction
  };
}
