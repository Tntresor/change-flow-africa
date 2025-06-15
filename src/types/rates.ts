
export interface ExchangeRateSettings {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  baseRate: number;
  margin: number; // Marge en pourcentage
  finalRate: number; // Taux final appliqué
  isActive: boolean;
  lastUpdated: Date;
}

export interface CommissionSettings {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxAmount?: number;
  currency: string;
  isActive: boolean;
}

export interface FeeSettings {
  id: string;
  name: string;
  amount: number;
  currency: string;
  isActive: boolean;
  description?: string;
}
