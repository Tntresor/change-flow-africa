export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  spread: number;
  finalRate: number;
  convertedAmount: number;
  commission: CommissionDetails;
  fees: number;
  status: 'pending' | 'completed' | 'rejected' | 'offline';
  timestamp: Date;
  agencyId: string;
  agencyName: string;
  origin: TransactionLocation;
  destination: TransactionLocation;
  sender: CustomerInfo;
  receiver: CustomerInfo;
  validationType: 'blocking' | 'warning' | 'none';
  isOffline?: boolean;
  prefixId?: string;
  category?: TransactionCategory;
  customerName?: string;
  customerPhone?: string;
  agent?: {
    id: string;
    name: string;
    role: string;
  };
}

export type TransactionType = 
  | 'internal_transfer'
  | 'international_transfer'
  | 'currency_exchange'
  | 'payment'
  | 'reversal';

export interface TransactionLocation {
  type: 'agency' | 'partner' | 'network';
  id: string;
  name: string;
  country: string;
  code?: string;
}

export interface CustomerInfo {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  idNumber?: string;
}

export interface CommissionDetails {
  amount: number;
  percentage: number;
  tier: CommissionTier;
  totalCommission: number;
}

export interface CommissionTier {
  id: string;
  name: string;
  minAmount: number;
  maxAmount?: number;
  fixedAmount: number;
  percentage: number;
}

export interface TransactionCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
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
  spread: number;
  finalRate: number;
  lastUpdated: Date;
}

export interface Partner {
  id: string;
  name: string;
  country: string;
  type: 'bank' | 'money_transfer' | 'mobile_wallet';
  isActive: boolean;
}
