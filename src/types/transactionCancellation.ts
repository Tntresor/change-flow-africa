
import { Transaction } from "./transaction";

export interface TransactionCancellation {
  id: string;
  originalTransactionId: string;
  reversalTransactionId: string;
  cancelledBy: string;
  cancelledByName: string;
  cancelledAt: Date;
  reason: string;
  status: 'pending' | 'completed' | 'failed';
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: Date;
}

export interface ReversalTransaction extends Omit<Transaction, 'id' | 'timestamp' | 'type'> {
  id: string;
  timestamp: Date;
  type: 'reversal';
  isReversal: boolean;
  originalTransactionId: string;
  reversalReason: string;
}
