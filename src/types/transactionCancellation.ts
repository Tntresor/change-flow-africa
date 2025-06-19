
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

export interface ReversalTransaction extends Omit<Transaction, 'id' | 'timestamp'> {
  id: string;
  timestamp: Date;
  isReversal: boolean;
  originalTransactionId: string;
  reversalReason: string;
}
