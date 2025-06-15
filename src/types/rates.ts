
export interface ExchangeRateSettings {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  baseRate: number;
  spread: number; // Spread en points de base (1 point = 0.01%)
  finalRate: number; // Taux final appliqué (baseRate + spread)
  isActive: boolean;
  lastUpdated: Date;
}

export interface CommissionTierSettings {
  id: string;
  name: string;
  minAmount: number;
  maxAmount?: number;
  fixedAmount: number; // Montant fixe
  percentage: number; // Pourcentage
  currency: string;
  isActive: boolean;
  order: number; // Ordre d'application des paliers
}

export interface FeeSettings {
  id: string;
  name: string;
  amount: number;
  currency: string;
  isActive: boolean;
  description?: string;
}

export interface SpreadSettings {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  buySpread: number; // Spread à l'achat
  sellSpread: number; // Spread à la vente
  isActive: boolean;
}
