
export interface CashOperation {
  id: string;
  type: 'cash_in' | 'cash_out';
  currency: string;
  amount: number;
  reason: string;
  reference: string;
  timestamp: Date;
  agencyId: string;
  agencyName: string;
}

export interface CashOperationRequest {
  type: 'cash_in' | 'cash_out';
  currency: string;
  amount: number;
  reason: string;
  reference: string;
}
