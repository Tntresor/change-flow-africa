
export interface Transaction {
  id: string;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  convertedAmount: number;
  status: 'pending' | 'completed' | 'rejected' | 'offline';
  timestamp: Date;
  agencyId: string;
  agencyName: string;
  category: TransactionCategory;
  customerName?: string;
  customerPhone?: string;
  validationType: 'blocking' | 'warning' | 'none';
  isOffline?: boolean;
  prefixId?: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

export interface Agency {
  id: string;
  name: string;
  code: string;
  country: string;
  isActive: boolean;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
}
