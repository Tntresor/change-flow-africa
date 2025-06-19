
import { Transaction } from "@/types/transaction";
import { TransactionCancellation, ReversalTransaction } from "@/types/transactionCancellation";

export class TransactionCancellationService {
  static canCancelTransaction(
    transaction: Transaction,
    userRole: string,
    userAgency?: string
  ): { canCancel: boolean; reason?: string } {
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

    return { canCancel: true };
  }

  static createReversalTransaction(
    originalTransaction: Transaction,
    cancelledBy: string,
    cancelledByName: string,
    reason: string
  ): ReversalTransaction {
    return {
      ...originalTransaction,
      id: `rev_${originalTransaction.id}_${Date.now()}`,
      timestamp: new Date(),
      isReversal: true,
      originalTransactionId: originalTransaction.id,
      reversalReason: reason,
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
        name: cancelledByName,
        role: 'supervisor' // Assumons que c'est un superviseur qui annule
      }
    } as ReversalTransaction;
  }

  static createCancellationRecord(
    originalTransactionId: string,
    reversalTransactionId: string,
    cancelledBy: string,
    cancelledByName: string,
    reason: string
  ): TransactionCancellation {
    return {
      id: `cancel_${Date.now()}`,
      originalTransactionId,
      reversalTransactionId,
      cancelledBy,
      cancelledByName,
      cancelledAt: new Date(),
      reason,
      status: 'completed'
    };
  }
}
