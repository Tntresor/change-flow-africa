import { ExchangeRateSettings, CommissionTierSettings, FeeSettings } from "@/types/rates";

// Fonction utilitaire pour calculer bid/ask à partir du taux de base et du spread total
const calculateBidAskRates = (baseRate: number, totalSpread: number) => {
  const halfSpread = totalSpread / 2;
  return {
    bidRate: baseRate - halfSpread,
    askRate: baseRate + halfSpread
  };
};

export const mockExchangeRates: ExchangeRateSettings[] = [
  {
    id: "1",
    fromCurrency: "EUR",
    toCurrency: "USD",
    baseRate: 1.0850, // Taux mid-market interbancaire
    totalSpread: 0.0100, // Spread total de 100 pips
    ...calculateBidAskRates(1.0850, 0.0100),
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "2", 
    fromCurrency: "USD",
    toCurrency: "EUR",
    baseRate: 0.9200, // Taux mid-market interbancaire
    totalSpread: 0.0090, // Spread total de 90 pips
    ...calculateBidAskRates(0.9200, 0.0090),
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "3",
    fromCurrency: "EUR",
    toCurrency: "XOF",
    baseRate: 655.957, // Taux mid-market interbancaire
    totalSpread: 16.0, // Spread plus important pour les devises africaines
    ...calculateBidAskRates(655.957, 16.0),
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "4",
    fromCurrency: "EUR",
    toCurrency: "MAD",
    baseRate: 10.85, // Taux mid-market interbancaire
    totalSpread: 0.40, // Spread total
    ...calculateBidAskRates(10.85, 0.40),
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "5",
    fromCurrency: "USD",
    toCurrency: "MAD",
    baseRate: 9.95, // Taux mid-market interbancaire
    totalSpread: 0.30, // Spread total
    ...calculateBidAskRates(9.95, 0.30),
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
