
import { CurrencyBalance } from './liquidity';

export interface CashierTill {
  id: string;
  cashierId: string;
  cashierName: string;
  agencyId: string;
  balances: CurrencyBalance[];
  isActive: boolean;
  lastActivity: Date;
}

export interface SafeVault {
  id: string;
  agencyId: string;
  agencyName: string;
  balances: CurrencyBalance[];
  lastUpdated: Date;
  accessLevel: 'manager' | 'supervisor';
}

export interface CashTransferRequest {
  fromType: 'till' | 'vault';
  toType: 'till' | 'vault';
  fromId: string;
  toId: string;
  currency: string;
  amount: number;
  reason: string;
  initiatedBy: string;
}

export interface AgencyCashSummary {
  agencyId: string;
  agencyName: string;
  totalsByCurrency: { [currency: string]: number };
  tills: CashierTill[];
  vault: SafeVault;
  lastConsolidation: Date;
}
