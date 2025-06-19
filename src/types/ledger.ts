
export interface LedgerEntry {
  id: string;
  transactionId: string;
  agencyId: string;
  agencyName: string;
  entryDate: Date;
  accountType: 'asset' | 'liability' | 'revenue' | 'expense';
  accountCode: string;
  accountName: string;
  currency: string;
  debitAmount: number;
  creditAmount: number;
  balance: number;
  description: string;
  reference: string;
  isReversalEntry: boolean;
  originalEntryId?: string;
}

export interface AgencyLedger {
  agencyId: string;
  agencyName: string;
  entries: LedgerEntry[];
  balancesByCurrency: Record<string, AgencyBalance>;
  lastUpdated: Date;
}

export interface AgencyBalance {
  currency: string;
  totalAssets: number;
  totalLiabilities: number;
  totalRevenue: number;
  totalExpenses: number;
  netPosition: number;
}

export interface ConsolidatedLedger {
  companyName: string;
  consolidationDate: Date;
  agencyLedgers: AgencyLedger[];
  consolidatedBalances: Record<string, AgencyBalance>;
  totalNetPosition: Record<string, number>;
}

export interface LedgerAccount {
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'revenue' | 'expense';
  currency?: string;
  isActive: boolean;
}
