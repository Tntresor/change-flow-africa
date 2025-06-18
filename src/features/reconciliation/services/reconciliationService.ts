
import { ReconciliationEntry } from "@/types/reconciliation";
import { Transaction } from "@/types/transaction";
import { CashOperation } from "@/types/cashOperation";
import { ReconciliationCalculator } from "./reconciliationCalculator";
import { ReconciliationValidator } from "./reconciliationValidator";
import { ReconciliationStats } from "./reconciliationStats";
import { ReconciliationReportGenerator } from "./reconciliationReportGenerator";

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
    // Convertir les transactions et opérations cash
    const transactionsList = ReconciliationCalculator.convertTransactions(
      transactions, 
      agentId, 
      currency
    );
    
    const cashOperationsList = ReconciliationCalculator.convertCashOperations(
      cashOperations, 
      agencyId, 
      currency
    );

    // Combiner toutes les transactions de réconciliation
    const allTransactions = [...transactionsList, ...cashOperationsList]
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Calculer le solde théorique
    const theoreticalBalance = ReconciliationCalculator.calculateTheoreticalBalance(allTransactions);

    // Calculer l'écart et le statut
    const { variance, status } = ReconciliationCalculator.calculateVarianceAndStatus(
      actualCash, 
      theoreticalBalance
    );

    return {
      id: `rec_${agentId}_${tillId}_${Date.now()}`,
      agentId,
      agentName,
      agencyId,
      date: new Date(),
      tillId,
      currency,
      theoreticalBalance,
      actualCash: Math.round(actualCash * 100) / 100,
      variance,
      transactions: allTransactions,
      status
    };
  }

  /**
   * Génère un rapport de réconciliation complet pour une agence
   */
  static generateReconciliationReport = ReconciliationReportGenerator.generateReconciliationReport;

  /**
   * Met à jour le statut d'une entrée de réconciliation
   */
  static updateReconciliationStatus = ReconciliationReportGenerator.updateReconciliationStatus;

  /**
   * Valide les données de réconciliation
   */
  static validateReconciliationData = ReconciliationValidator.validateReconciliationData;

  /**
   * Calcule les statistiques de réconciliation
   */
  static calculateReconciliationStats = ReconciliationStats.calculateReconciliationStats;
}
