
import { ExchangeRateSettings, CommissionTierSettings, FeeSettings } from "@/types/rates";

export const mockExchangeRates: ExchangeRateSettings[] = [
  {
    id: "1",
    fromCurrency: "EUR",
    toCurrency: "USD",
    baseRate: 1.0850,
    spread: 0.0050, // 0.5% de spread
    finalRate: 1.0900,
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "2", 
    fromCurrency: "USD",
    toCurrency: "EUR",
    baseRate: 0.9200,
    spread: 0.0045,
    finalRate: 0.9245,
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "3",
    fromCurrency: "EUR",
    toCurrency: "XOF",
    baseRate: 655.957,
    spread: 5.0, // 5 XOF de spread
    finalRate: 660.957,
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "4",
    fromCurrency: "EUR",
    toCurrency: "MAD",
    baseRate: 10.85,
    spread: 0.15, // 0.15 MAD de spread
    finalRate: 11.00,
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "5",
    fromCurrency: "USD",
    toCurrency: "MAD",
    baseRate: 9.95,
    spread: 0.12,
    finalRate: 10.07,
    isActive: true,
    lastUpdated: new Date(),
  },
];

export const mockCommissionTiers: CommissionTierSettings[] = [
  {
    id: "tier1",
    name: "Palier 1 (0€ - 100€)",
    minAmount: 0,
    maxAmount: 100,
    fixedAmount: 2.50,
    percentage: 1.5,
    currency: "EUR",
    isActive: true,
    order: 1,
  },
  {
    id: "tier2", 
    name: "Palier 2 (100€ - 500€)",
    minAmount: 100,
    maxAmount: 500,
    fixedAmount: 5.00,
    percentage: 1.2,
    currency: "EUR",
    isActive: true,
    order: 2,
  },
  {
    id: "tier3",
    name: "Palier 3 (500€ - 1000€)",
    minAmount: 500,
    maxAmount: 1000,
    fixedAmount: 8.00,
    percentage: 1.0,
    currency: "EUR",
    isActive: true,
    order: 3,
  },
  {
    id: "tier4",
    name: "Palier 4 (1000€+)",
    minAmount: 1000,
    fixedAmount: 15.00,
    percentage: 0.8,
    currency: "EUR",
    isActive: true,
    order: 4,
  },
];

export const mockCommissions: CommissionTierSettings[] = mockCommissionTiers;

export const mockFees: FeeSettings[] = [
  {
    id: "1",
    name: "Frais de traitement",
    amount: 2.50,
    currency: "EUR",
    isActive: true,
    description: "Frais de traitement standard",
  },
  {
    id: "2",
    name: "Frais urgence",
    amount: 10.00,
    currency: "EUR", 
    isActive: true,
    description: "Frais pour traitement urgent",
  },
];
