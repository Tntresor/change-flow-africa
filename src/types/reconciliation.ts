
export interface ReconciliationEntry {
  id: string;
  agentId: string;
  agentName: string;
  agencyId: string;
  date: Date;
  tillId: string;
  currency: string;
  theoreticalBalance: number;
  actualCash: number;
  variance: number;
  transactions: ReconciliationTransaction[];
  status: 'pending' | 'balanced' | 'variance_documented' | 'variance_unresolved';
  notes?: string;
}

export interface ReconciliationTransaction {
  transactionId: string;
  type: 'transaction' | 'cash_in' | 'cash_out';
  amount: number;
  currency: string;
  timestamp: Date;
  impact: 'debit' | 'credit';
}

export interface ReconciliationReport {
  id: string;
  agencyId: string;
  agencyName: string;
  date: Date;
  entries: ReconciliationEntry[];
  totalVariance: { [currency: string]: number };
  status: 'completed' | 'pending_review' | 'approved';
  auditTrail: AuditTrailEntry[];
}

export interface AuditTrailEntry {
  id: string;
  timestamp: Date;
  action: string;
  performedBy: string;
  details: string;
  relatedTransactionId?: string;
}
