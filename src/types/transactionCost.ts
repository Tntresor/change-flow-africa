export interface ThirdPartyFeeSettings {
  id: string;
  name: string;
  type: 'fixed' | 'percentage' | 'mixed';
  fixedAmount?: number;
  percentage?: number;
  currency: string;
  isActive: boolean;
  transactionType?: string;
  description?: string;
}

export interface TransactionCostBreakdown {
  thirdPartyCapital: number;
  fixedFees: number;
  variableFees: number;
  totalThirdPartyCost: number;
  feeDetails: ThirdPartyFeeDetails[];
}

export interface ThirdPartyFeeDetails {
  feeId: string;
  feeName: string;
  type: 'fixed' | 'percentage' | 'mixed';
  appliedAmount: number;
  calculationBase?: number;
}

export interface TransactionCostCalculation {
  transactionId: string;
  amount: number;
  currency: string;
  costBreakdown: TransactionCostBreakdown;
  timestamp: Date;
}
