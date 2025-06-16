
export interface ExchangeRateSettings {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  baseRate: number; // Taux mid-market (interbancaire)
  totalSpread: number; // Spread total en valeur absolue
  bidRate: number; // Taux d'achat (baseRate - spread/2)
  askRate: number; // Taux de vente (baseRate + spread/2)
  isActive: boolean;
  lastUpdated: Date;
}

export interface CommissionTierSettings {
  id: string;
  name: string;
  minAmount: number;
  maxAmount?: number;
  fixedAmount: number;
  percentage: number;
  currency: string;
  isActive: boolean;
  order: number;
  type: 'percentage' | 'fixed' | 'percentage_plus_fixed' | 'percentage_with_minimum';
  value: number;
  transactionType?: string; // Type de transaction spécifique
}

export interface FeeSettings {
  id: string;
  name: string;
  amount: number;
  currency: string;
  isActive: boolean;
  description?: string;
  transactionType?: string; // Type de transaction spécifique
}
