
import { ReconciliationEntry, ReconciliationReport, AuditTrailEntry } from "@/types/reconciliation";

export class ReconciliationReportGenerator {
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
}
