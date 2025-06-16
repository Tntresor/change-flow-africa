
import { ExchangeRateSettings, CommissionTierSettings, FeeSettings } from "@/types/rates";

export const mockExchangeRates: ExchangeRateSettings[] = [
  {
    id: "1",
    fromCurrency: "EUR",
    toCurrency: "USD",
    baseRate: 1.0850,
    spread: 0.0050, // Spread positif = taux final plus avantageux pour nous
    finalRate: 1.0900, // baseRate + spread
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "2", 
    fromCurrency: "USD",
    toCurrency: "EUR",
    baseRate: 0.9200,
    spread: 0.0045, // Spread positif
    finalRate: 0.9245, // baseRate + spread
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "3",
    fromCurrency: "EUR",
    toCurrency: "XOF",
    baseRate: 655.957,
    spread: 8.0, // Spread plus important pour les devises africaines
    finalRate: 663.957, // baseRate + spread
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "4",
    fromCurrency: "EUR",
    toCurrency: "MAD",
    baseRate: 10.85,
    spread: 0.20, // Spread avantageux
    finalRate: 11.05, // baseRate + spread
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "5",
    fromCurrency: "USD",
    toCurrency: "MAD",
    baseRate: 9.95,
    spread: 0.15, // Spread positif
    finalRate: 10.10, // baseRate + spread
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
    type: 'percentage',
    value: 1.5,
    transactionType: "currency_exchange",
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
    type: 'percentage',
    value: 1.2,
    transactionType: "currency_exchange",
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
    type: 'percentage',
    value: 1.0,
    transactionType: "currency_exchange",
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
    type: 'percentage',
    value: 0.8,
    transactionType: "currency_exchange",
  },
];

export const mockCommissions: CommissionTierSettings[] = [
  {
    id: "comm1",
    name: "Commission Change Standard",
    minAmount: 0,
    maxAmount: 1000,
    fixedAmount: 2.00,
    percentage: 1.0,
    currency: "EUR",
    isActive: true,
    order: 1,
    type: 'percentage_plus_fixed',
    value: 1.0,
    transactionType: "currency_exchange",
  },
  {
    id: "comm2",
    name: "Commission Transfert International",
    minAmount: 0,
    maxAmount: 5000,
    fixedAmount: 5.00,
    percentage: 0.8,
    currency: "EUR",
    isActive: true,
    order: 2,
    type: 'percentage_plus_fixed',
    value: 0.8,
    transactionType: "international_transfer",
  },
  {
    id: "comm3",
    name: "Commission Transfert Interne",
    minAmount: 0,
    fixedAmount: 1.50,
    percentage: 0.5,
    currency: "EUR",
    isActive: true,
    order: 3,
    type: 'fixed',
    value: 1.50,
    transactionType: "internal_transfer",
  },
];

export const mockFees: FeeSettings[] = [
  {
    id: "1",
    name: "Frais de traitement",
    amount: 2.50,
    currency: "EUR",
    isActive: true,
    description: "Frais de traitement standard",
    transactionType: "currency_exchange",
  },
  {
    id: "2",
    name: "Frais urgence",
    amount: 10.00,
    currency: "EUR", 
    isActive: true,
    description: "Frais pour traitement urgent",
    transactionType: "all",
  },
  {
    id: "3",
    name: "Frais transfert international",
    amount: 15.00,
    currency: "EUR",
    isActive: true,
    description: "Frais spécifiques aux transferts internationaux",
    transactionType: "international_transfer",
  },
];
