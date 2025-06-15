
import { ExchangeRateSettings, CommissionSettings, FeeSettings } from "@/types/rates";

export const mockExchangeRates: ExchangeRateSettings[] = [
  {
    id: "1",
    fromCurrency: "EUR",
    toCurrency: "USD",
    baseRate: 1.0850,
    margin: 2.5,
    finalRate: 1.0579,
    isActive: true,
    lastUpdated: new Date("2024-06-15T10:30:00"),
  },
  {
    id: "2",
    fromCurrency: "USD",
    toCurrency: "EUR",
    baseRate: 0.9217,
    margin: 2.5,
    finalRate: 0.9447,
    isActive: true,
    lastUpdated: new Date("2024-06-15T10:30:00"),
  },
  {
    id: "3",
    fromCurrency: "EUR",
    toCurrency: "GBP",
    baseRate: 0.8465,
    margin: 2.0,
    finalRate: 0.8634,
    isActive: true,
    lastUpdated: new Date("2024-06-15T10:25:00"),
  },
];

export const mockCommissions: CommissionSettings[] = [
  {
    id: "1",
    name: "Commission standard",
    type: "percentage",
    value: 1.5,
    currency: "EUR",
    isActive: true,
  },
  {
    id: "2",
    name: "Frais fixes petites transactions",
    type: "fixed",
    value: 2.50,
    maxAmount: 100,
    currency: "EUR",
    isActive: true,
  },
];

export const mockFees: FeeSettings[] = [
  {
    id: "1",
    name: "Frais de service",
    amount: 1.00,
    currency: "EUR",
    isActive: true,
    description: "Frais de traitement de la transaction",
  },
  {
    id: "2",
    name: "Frais urgence",
    amount: 5.00,
    currency: "EUR",
    isActive: false,
    description: "Frais pour traitement urgent",
  },
];
