
import { ReconciliationEntry } from "@/types/reconciliation";

export class ReconciliationStats {
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
