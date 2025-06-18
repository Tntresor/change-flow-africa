
import { ReconciliationTransaction } from "@/types/reconciliation";
import { Transaction } from "@/types/transaction";
import { CashOperation } from "@/types/cashOperation";

export class ReconciliationCalculator {
  /**
   * Convertit les transactions en transactions de réconciliation
   */
  static convertTransactions(
    transactions: Transaction[],
    agentId: string,
    currency: string
  ): ReconciliationTransaction[] {
    const reconciliationTransactions: ReconciliationTransaction[] = [];

    const agentTransactions = transactions.filter(t => 
      t.agent?.id === agentId && 
      (t.fromCurrency === currency || t.toCurrency === currency)
    );

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

    return reconciliationTransactions;
  }

  /**
   * Convertit les opérations cash en transactions de réconciliation
   */
  static convertCashOperations(
    cashOperations: CashOperation[],
    agencyId: string,
    currency: string
  ): ReconciliationTransaction[] {
    const reconciliationTransactions: ReconciliationTransaction[] = [];

    const agentCashOps = cashOperations.filter(op => 
      op.agencyId === agencyId && 
      op.currency === currency
    );

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

    return reconciliationTransactions;
  }

  /**
   * Calcule le solde théorique à partir des transactions
   */
  static calculateTheoreticalBalance(transactions: ReconciliationTransaction[]): number {
    const balance = transactions.reduce((balance, tx) => {
      return tx.impact === 'credit' ? balance + tx.amount : balance - tx.amount;
    }, 0);

    return Math.round(balance * 100) / 100;
  }

  /**
   * Calcule l'écart et détermine le statut
   */
  static calculateVarianceAndStatus(
    actualCash: number,
    theoreticalBalance: number
  ): { variance: number; status: 'balanced' | 'variance_unresolved' } {
    const variance = Math.round((actualCash - theoreticalBalance) * 100) / 100;
    const status = Math.abs(variance) > 0.01 ? 'variance_unresolved' : 'balanced';

    return { variance, status };
  }
}
