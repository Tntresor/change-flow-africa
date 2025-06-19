
export interface MakerCheckerRule {
  id: string;
  agencyId: string;
  agencyName: string;
  transactionType: 'internal_transfer' | 'international_transfer' | 'currency_exchange' | 'payment';
  currency: string;
  maxAmount: number;
  requiresApproval: boolean;
  approverRoles: ('supervisor' | 'manager' | 'administrator')[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalRule {
  id: string;
  transactionType: 'internal_transfer' | 'international_transfer' | 'currency_exchange' | 'payment';
  maxAmount: number;
  currency: string;
  isActive: boolean;
  requiredApprovalLevel: 'supervisor' | 'manager' | 'administrator';
  description: string;
}

export interface TransactionApproval {
  id: string;
  transactionId: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  comments?: string;
  requiredApprovalLevel: 'supervisor' | 'manager' | 'administrator';
  ruleId?: string;
}

export interface PendingTransaction {
  id: string;
  originalTransaction: any;
  approvalRequest: TransactionApproval;
  ruleTriggered: ApprovalRule;
}
