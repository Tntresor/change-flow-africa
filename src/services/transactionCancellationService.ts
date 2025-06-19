
import { Transaction } from "@/types/transaction";
import { TransactionCancellation, ReversalTransaction } from "@/types/transactionCancellation";

export class TransactionCancellationService {
  private static validateUser(userRole: string, userAgency?: string): boolean {
    if (!userRole || typeof userRole !== 'string') return false;
    if (userAgency && typeof userAgency !== 'string') return false;
    return true;
  }

  private static validateTransaction(transaction: Transaction): boolean {
    if (!transaction || !transaction.id) return false;
    if (!transaction.agencyId || !transaction.status) return false;
    return true;
  }

  static canCancelTransaction(
    transaction: Transaction,
    userRole: string,
    userAgency?: string
  ): { canCancel: boolean; reason?: string } {
    // Validation des paramètres d'entrée
    if (!this.validateUser(userRole, userAgency)) {
      return { canCancel: false, reason: "Données utilisateur invalides" };
    }

    if (!this.validateTransaction(transaction)) {
      return { canCancel: false, reason: "Transaction invalide" };
    }

    // Seuls les superviseurs et managers peuvent annuler
    if (!['supervisor', 'manager', 'administrator'].includes(userRole)) {
      return { canCancel: false, reason: "Permissions insuffisantes" };
    }

    // Ne peut pas annuler ses propres transactions (sauf admin)
    if (transaction.agent?.role === userRole && userRole !== 'administrator') {
      return { canCancel: false, reason: "Impossible d'annuler sa propre transaction" };
    }

    // Vérifier que la transaction est de la même agence (sauf admin)
    if (userRole !== 'administrator' && transaction.agencyId !== userAgency) {
      return { canCancel: false, reason: "Transaction d'une autre agence" };
    }

    // Ne peut pas annuler une transaction déjà annulée
    if ((transaction as any).isReversal) {
      return { canCancel: false, reason: "Transaction déjà annulée" };
    }

    // Ne peut pas annuler une transaction rejetée
    if (transaction.status === 'rejected') {
      return { canCancel: false, reason: "Transaction déjà rejetée" };
    }

    // Ne peut pas annuler une transaction en cours
    if (transaction.status === 'pending') {
      return { canCancel: false, reason: "Impossible d'annuler une transaction en cours" };
    }

    return { canCancel: true };
  }

  static createReversalTransaction(
    originalTransaction: Transaction,
    cancelledBy: string,
    cancelledByName: string,
    reason: string
  ): ReversalTransaction | null {
    // Validation des paramètres
    if (!originalTransaction || !originalTransaction.id) {
      console.error('Transaction originale invalide');
      return null;
    }

    if (!cancelledBy || !cancelledByName || !reason) {
      console.error('Paramètres d\'annulation manquants');
      return null;
    }

    if (reason.trim().length < 10) {
      console.error('Raison d\'annulation trop courte');
      return null;
    }

    try {
      return {
        ...originalTransaction,
        id: `rev_${originalTransaction.id}_${Date.now()}`,
        timestamp: new Date(),
        isReversal: true,
        originalTransactionId: originalTransaction.id,
        reversalReason: reason.trim(),
        // Inverser les montants pour annuler l'impact comptable
        amount: -originalTransaction.amount,
        convertedAmount: -originalTransaction.convertedAmount,
        // Inverser expéditeur et destinataire pour l'impact liquidité
        fromCurrency: originalTransaction.toCurrency,
        toCurrency: originalTransaction.fromCurrency,
        sender: originalTransaction.receiver,
        receiver: originalTransaction.sender,
        origin: originalTransaction.destination,
        destination: originalTransaction.origin,
        status: 'completed',
        agent: {
          id: cancelledBy,
          name: cancelledByName.trim(),
          role: 'supervisor' // Assumons que c'est un superviseur qui annule
        }
      } as ReversalTransaction;
    } catch (error) {
      console.error('Erreur lors de la création de la transaction d\'annulation:', error);
      return null;
    }
  }

  static createCancellationRecord(
    originalTransactionId: string,
    reversalTransactionId: string,
    cancelledBy: string,
    cancelledByName: string,
    reason: string
  ): TransactionCancellation | null {
    // Validation des paramètres
    if (!originalTransactionId || !reversalTransactionId || !cancelledBy || !cancelledByName || !reason) {
      console.error('Paramètres manquants pour la création de l\'enregistrement d\'annulation');
      return null;
    }

    try {
      return {
        id: `cancel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        originalTransactionId: originalTransactionId.trim(),
        reversalTransactionId: reversalTransactionId.trim(),
        cancelledBy: cancelledBy.trim(),
        cancelledByName: cancelledByName.trim(),
        cancelledAt: new Date(),
        reason: reason.trim(),
        status: 'completed'
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'enregistrement d\'annulation:', error);
      return null;
    }
  }
}
