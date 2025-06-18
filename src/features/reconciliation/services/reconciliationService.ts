
import { ReconciliationEntry, ReconciliationTransaction, ReconciliationReport, AuditTrailEntry } from "@/types/reconciliation";
import { Transaction } from "@/types/transaction";
import { CashOperation } from "@/types/cashOperation";

export class ReconciliationService {
  /**
   * Crée une entrée de réconciliation pour un agent
   */
  static createReconciliationEntry(
    agentId: string,
    agentName: string,
    agencyId: string,
    tillId: string,
    currency: string,
    transactions: Transaction[],
    cashOperations: CashOperation[],
    actualCash: number
  ): ReconciliationEntry {
    // Filtrer les transactions et opérations pour cet agent et cette devise
    const agentTransactions = transactions.filter(t => 
      t.agent?.id === agentId && 
      (t.fromCurrency === currency || t.toCurrency === currency)
    );

    const agentCashOps = cashOperations.filter(op => 
      op.agencyId === agencyId && 
      op.currency === currency
    );

    // Construire la liste des transactions de réconciliation
    const reconciliationTransactions: ReconciliationTransaction[] = [];

    // Ajouter les transactions
    agentTransactions.forEach(tx => {
      // Transaction sortante (débit)
      if (tx.fromCurrency === currency) {
        reconciliationTransactions.push({
          transactionId: tx.id,
          type: 'transaction',
          amount: tx.amount + tx.fees,
          currency: tx.fromCurrency,
          timestamp: tx.timestamp,
          impact: 'debit'
        });
      }
      
      // Transaction entrante (crédit)
      if (tx.toCurrency === currency && tx.fromCurrency !== tx.toCurrency) {
        reconciliationTransactions.push({
          transactionId: tx.id,
          type: 'transaction',
          amount: tx.convertedAmount,
          currency: tx.toCurrency,
          timestamp: tx.timestamp,
          impact: 'credit'
        });
      }
    });

    // Ajouter les opérations cash
    agentCashOps.forEach(op => {
      reconciliationTransactions.push({
        transactionId: op.id,
        type: op.type,
        amount: op.amount,
        currency: op.currency,
        timestamp: op.timestamp,
        impact: op.type === 'cash_in' ? 'credit' : 'debit'
      });
    });

    // Calculer le solde théorique
    const theoreticalBalance = reconciliationTransactions.reduce((balance, tx) => {
      return tx.impact === 'credit' ? balance + tx.amount : balance - tx.amount;
    }, 0);

    // Calculer l'écart
    const variance = actualCash - theoreticalBalance;

    // Déterminer le statut
    let status: ReconciliationEntry['status'] = 'balanced';
    if (Math.abs(variance) > 0.01) { // Tolérance de 0.01
      status = 'variance_unresolved';
    }

    return {
      id: `rec_${agentId}_${tillId}_${Date.now()}`,
      agentId,
      agentName,
      agencyId,
      date: new Date(),
      tillId,
      currency,
      theoreticalBalance: Math.round(theoreticalBalance * 100) / 100,
      actualCash: Math.round(actualCash * 100) / 100,
      variance: Math.round(variance * 100) / 100,
      transactions: reconciliationTransactions.sort((a, b) => 
        a.timestamp.getTime() - b.timestamp.getTime()
      ),
      status
    };
  }

  /**
   * Génère un rapport de réconciliation complet pour une agence
   */
  static generateReconciliationReport(
    agencyId: string,
    agencyName: string,
    entries: ReconciliationEntry[]
  ): ReconciliationReport {
    // Calculer la variance totale par devise
    const totalVariance: { [currency: string]: number } = {};
    
    entries.forEach(entry => {
      if (!totalVariance[entry.currency]) {
        totalVariance[entry.currency] = 0;
      }
      totalVariance[entry.currency] += entry.variance;
    });

    // Arrondir les variances
    Object.keys(totalVariance).forEach(currency => {
      totalVariance[currency] = Math.round(totalVariance[currency] * 100) / 100;
    });

    // Déterminer le statut du rapport
    const hasVariances = Object.values(totalVariance).some(variance => Math.abs(variance) > 0.01);
    const status = hasVariances ? 'pending_review' : 'completed';

    // Créer la piste d'audit
    const auditTrail: AuditTrailEntry[] = entries.map(entry => ({
      id: `audit_${entry.id}`,
      timestamp: entry.date,
      action: `Réconciliation ${entry.agentName} - ${entry.currency}`,
      performedBy: 'system',
      details: `Variance: ${entry.variance} ${entry.currency}`,
    }));

    return {
      id: `report_${agencyId}_${Date.now()}`,
      agencyId,
      agencyName,
      date: new Date(),
      entries,
      totalVariance,
      status,
      auditTrail
    };
  }

  /**
   * Met à jour le statut d'une entrée de réconciliation
   */
  static updateReconciliationStatus(
    entry: ReconciliationEntry,
    newStatus: ReconciliationEntry['status'],
    notes?: string,
    performedBy?: string
  ): ReconciliationEntry {
    return {
      ...entry,
      status: newStatus,
      notes: notes || entry.notes
    };
  }

  /**
   * Valide les données de réconciliation
   */
  static validateReconciliationData(
    agentId: string,
    tillId: string,
    currency: string,
    actualCash: number
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!agentId) {
      errors.push("L'identifiant de l'agent est obligatoire");
    }

    if (!tillId) {
      errors.push("L'identifiant de la caisse est obligatoire");
    }

    if (!currency) {
      errors.push("La devise est obligatoire");
    }

    if (actualCash < 0) {
      errors.push("Le montant cash ne peut pas être négatif");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calcule les statistiques de réconciliation
   */
  static calculateReconciliationStats(entries: ReconciliationEntry[]): {
    totalEntries: number;
    balancedEntries: number;
    varianceEntries: number;
    averageVariance: number;
    maxVariance: number;
  } {
    const totalEntries = entries.length;
    const balancedEntries = entries.filter(e => e.status === 'balanced').length;
    const varianceEntries = totalEntries - balancedEntries;
    
    const variances = entries.map(e => Math.abs(e.variance));
    const averageVariance = variances.length > 0 
      ? variances.reduce((sum, v) => sum + v, 0) / variances.length 
      : 0;
    const maxVariance = variances.length > 0 ? Math.max(...variances) : 0;

    return {
      totalEntries,
      balancedEntries,
      varianceEntries,
      averageVariance: Math.round(averageVariance * 100) / 100,
      maxVariance: Math.round(maxVariance * 100) / 100
    };
  }
}
