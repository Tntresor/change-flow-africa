
import { Transaction } from "@/types/transaction";
import { TransactionCancellation, ReversalTransaction } from "@/types/transactionCancellation";
import { LedgerService } from "./ledgerService";

export class TransactionCancellationService {
  
  /**
   * Vérifie si un utilisateur peut annuler une transaction
   * Validation stricte des permissions et contraintes métier
   */
  static canCancelTransaction(
    transaction: Transaction, 
    userRole: string, 
    userAgency: string
  ): { canCancel: boolean; reason?: string } {
    
    // Validation des paramètres d'entrée
    if (!transaction) {
      return { canCancel: false, reason: "Transaction invalide" };
    }

    if (!userRole?.trim()) {
      return { canCancel: false, reason: "Rôle utilisateur invalide" };
    }

    if (!userAgency?.trim()) {
      return { canCancel: false, reason: "Agence utilisateur invalide" };
    }

    // Validation du statut de la transaction
    if (transaction.status !== 'completed') {
      return { canCancel: false, reason: "Seules les transactions complétées peuvent être annulées" };
    }

    // Contrainte temporelle: pas d'annulation après 24h
    const transactionDate = new Date(transaction.timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      return { canCancel: false, reason: "Impossible d'annuler une transaction de plus de 24h" };
    }

    // Vérification des permissions par rôle
    const normalizedRole = userRole.toLowerCase().trim();
    
    switch (normalizedRole) {
      case 'agent':
        // Les agents ne peuvent annuler que leurs propres transactions de leur agence
        if (transaction.agencyId !== userAgency) {
          return { canCancel: false, reason: "Vous ne pouvez annuler que les transactions de votre agence" };
        }
        if (transaction.amount > 1000) {
          return { canCancel: false, reason: "Les agents ne peuvent annuler des transactions > 1000 EUR" };
        }
        break;
        
      case 'supervisor':
        // Les superviseurs peuvent annuler dans leur agence jusqu'à 10000 EUR
        if (transaction.agencyId !== userAgency) {
          return { canCancel: false, reason: "Vous ne pouvez annuler que les transactions de votre agence" };
        }
        if (transaction.amount > 10000) {
          return { canCancel: false, reason: "Montant trop élevé pour votre niveau d'autorisation" };
        }
        break;
        
      case 'manager':
        // Les managers peuvent annuler jusqu'à 50000 EUR dans toute agence
        if (transaction.amount > 50000) {
          return { canCancel: false, reason: "Montant trop élevé pour votre niveau d'autorisation" };
        }
        break;
        
      case 'administrator':
        // Les administrateurs peuvent tout annuler
        break;
        
      default:
        return { canCancel: false, reason: "Rôle utilisateur non reconnu" };
    }

    // Vérifications de sécurité supplémentaires
    if (transaction.type === 'international_transfer' && transaction.amount > 25000 && normalizedRole !== 'administrator') {
      return { canCancel: false, reason: "Seuls les administrateurs peuvent annuler des transferts internationaux > 25000 EUR" };
    }

    return { canCancel: true };
  }

  /**
   * Crée une transaction d'annulation (reversal) avec validation stricte
   */
  static createReversalTransaction(
    originalTransaction: Transaction,
    cancelledBy: string,
    cancelledByName: string,
    reason: string
  ): ReversalTransaction | null {
    
    // Validation stricte des paramètres
    if (!originalTransaction?.id?.trim()) {
      console.error("Transaction originale invalide");
      return null;
    }

    if (!cancelledBy?.trim() || cancelledBy.trim().length < 3) {
      console.error("ID utilisateur invalide pour l'annulation");
      return null;
    }

    if (!cancelledByName?.trim() || cancelledByName.trim().length < 2) {
      console.error("Nom utilisateur invalide pour l'annulation");
      return null;
    }

    if (!reason?.trim() || reason.trim().length < 10) {
      console.error("Raison d'annulation insuffisante (minimum 10 caractères)");
      return null;
    }

    // Validation de sécurité: vérifier que la transaction peut être annulée
    if (originalTransaction.status !== 'completed') {
      console.error("Tentative d'annulation d'une transaction non complétée");
      return null;
    }

    const reversalId = `reversal_${originalTransaction.id}_${Date.now()}`;
    
    return {
      id: reversalId,
      originalTransactionId: originalTransaction.id,
      type: 'reversal',
      agencyId: originalTransaction.agencyId,
      agencyName: originalTransaction.agencyName,
      amount: originalTransaction.amount,
      fromCurrency: originalTransaction.toCurrency, // Inverser les devises
      toCurrency: originalTransaction.fromCurrency,
      exchangeRate: originalTransaction.exchangeRate ? 1 / originalTransaction.exchangeRate : 0,
      convertedAmount: originalTransaction.amount, // Montant original à restituer
      fees: 0, // Pas de frais sur les annulations
      commission: {
        amount: 0,
        percentage: 0,
        tier: originalTransaction.commission.tier,
        totalCommission: 0
      },
      status: 'pending',
      timestamp: new Date(),
      reversalReason: reason.trim(),
      isReversal: true,
      spread: 0,
      finalRate: originalTransaction.exchangeRate ? 1 / originalTransaction.exchangeRate : 0,
      origin: originalTransaction.origin,
      destination: originalTransaction.destination,
      sender: originalTransaction.receiver, // Inverser sender/receiver
      receiver: originalTransaction.sender,
      validationType: 'none'
    };
  }

  /**
   * Valide et finalise une annulation de transaction
   * Génère automatiquement les écritures d'annulation dans le ledger
   */
  static validateAndFinalizeTransactionCancellation(
    originalTransactionId: string,
    reversalTransactionId: string,
    cancelledBy: string,
    cancelledByName: string,
    reason: string
  ): { success: boolean; cancellationRecord?: TransactionCancellation; error?: string } {
    
    try {
      // Créer l'enregistrement d'annulation
      const cancellationRecord = this.createCancellationRecord(
        originalTransactionId,
        reversalTransactionId,
        cancelledBy,
        cancelledByName,
        reason
      );

      if (!cancellationRecord) {
        return { success: false, error: "Impossible de créer l'enregistrement d'annulation" };
      }

      // Générer automatiquement les écritures d'annulation dans le ledger
      console.log('Génération des écritures d\'annulation pour transaction validée:', originalTransactionId);
      
      try {
        const reversalEntries = LedgerService.createReversalEntriesForValidatedCancellation(
          originalTransactionId,
          reversalTransactionId
        );
        
        console.log('Écritures d\'annulation générées:', reversalEntries.length);
        
        return { 
          success: true, 
          cancellationRecord 
        };
      } catch (ledgerError) {
        console.error('Erreur lors de la génération des écritures d\'annulation:', ledgerError);
        return { 
          success: false, 
          error: "Annulation créée mais erreur dans la génération des écritures comptables" 
        };
      }
      
    } catch (error) {
      console.error('Erreur lors de la validation et finalisation de l\'annulation:', error);
      return { success: false, error: "Erreur lors de la finalisation de l'annulation" };
    }
  }

  /**
   * Crée un enregistrement d'annulation avec validation
   */
  static createCancellationRecord(
    originalTransactionId: string,
    reversalTransactionId: string,
    cancelledBy: string,
    cancelledByName: string,
    reason: string
  ): TransactionCancellation | null {
    
    // Validation stricte des paramètres
    if (!originalTransactionId?.trim()) {
      console.error("ID transaction originale manquant");
      return null;
    }

    if (!reversalTransactionId?.trim()) {
      console.error("ID transaction d'annulation manquant");
      return null;
    }

    if (!cancelledBy?.trim() || cancelledBy.trim().length < 3) {
      console.error("ID utilisateur invalide");
      return null;
    }

    if (!cancelledByName?.trim() || cancelledByName.trim().length < 2) {
      console.error("Nom utilisateur invalide");
      return null;
    }

    if (!reason?.trim() || reason.trim().length < 10) {
      console.error("Raison d'annulation insuffisante");
      return null;
    }

    return {
      id: `cancellation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalTransactionId: originalTransactionId.trim(),
      reversalTransactionId: reversalTransactionId.trim(),
      status: 'completed',
      reason: reason.trim(),
      cancelledBy: cancelledBy.trim(),
      cancelledByName: cancelledByName.trim(),
      cancelledAt: new Date()
    };
  }

  /**
   * Valide si une raison d'annulation est acceptable
   */
  static validateCancellationReason(reason: string): { isValid: boolean; error?: string } {
    if (!reason?.trim()) {
      return { isValid: false, error: "Raison d'annulation obligatoire" };
    }

    const trimmedReason = reason.trim();
    
    if (trimmedReason.length < 10) {
      return { isValid: false, error: "La raison doit contenir au moins 10 caractères" };
    }

    if (trimmedReason.length > 500) {
      return { isValid: false, error: "La raison ne peut dépasser 500 caractères" };
    }

    // Vérification de mots interdits (sécurité basique)
    const forbiddenWords = ['test', 'fake', 'bidon'];
    const hasForbiddenWords = forbiddenWords.some(word => 
      trimmedReason.toLowerCase().includes(word)
    );

    if (hasForbiddenWords) {
      return { isValid: false, error: "Raison d'annulation non professionnelle détectée" };
    }

    return { isValid: true };
  }
}
