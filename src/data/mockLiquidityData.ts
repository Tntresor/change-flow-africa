
import { AgencyLiquidity } from "@/types/liquidity";

export const mockAgencyLiquidity: AgencyLiquidity[] = [
  {
    id: "liq_1",
    agencyId: "1",
    agencyName: "Agence Paris",
    balances: [
      { currency: "EUR", balance: 50000, minThreshold: 10000, maxThreshold: 100000, status: "normal", reservedAmount: 5000, availableAmount: 45000 },
      { currency: "XOF", balance: 8500000, minThreshold: 2000000, maxThreshold: 15000000, status: "normal", reservedAmount: 500000, availableAmount: 8000000 },
      { currency: "USD", balance: 15000, minThreshold: 5000, maxThreshold: 30000, status: "low", reservedAmount: 2000, availableAmount: 13000 },
    ],
    lastUpdated: new Date(),
    alerts: [
      {
        id: "alert_1",
        type: "low_balance",
        currency: "USD",
        currentBalance: 15000,
        threshold: 20000,
        severity: "warning",
        message: "Solde USD faible - Réapprovisionnement recommandé",
        timestamp: new Date(),
        acknowledged: false
      }
    ]
  },
  {
    id: "liq_2",
    agencyId: "2",
    agencyName: "Agence Douala",
    balances: [
      { currency: "XOF", balance: 12000000, minThreshold: 2000000, maxThreshold: 15000000, status: "normal", reservedAmount: 800000, availableAmount: 11200000 },
      { currency: "EUR", balance: 25000, minThreshold: 8000, maxThreshold: 60000, status: "normal", reservedAmount: 3000, availableAmount: 22000 },
      { currency: "USD", balance: 18000, minThreshold: 5000, maxThreshold: 40000, status: "normal", reservedAmount: 2000, availableAmount: 16000 },
    ],
    lastUpdated: new Date(),
    alerts: []
  },
  {
    id: "liq_3",
    agencyId: "3",
    agencyName: "Agence Casablanca",
    balances: [
      { currency: "MAD", balance: 180000, minThreshold: 30000, maxThreshold: 300000, status: "normal", reservedAmount: 15000, availableAmount: 165000 },
      { currency: "EUR", balance: 35000, minThreshold: 10000, maxThreshold: 80000, status: "normal", reservedAmount: 4000, availableAmount: 31000 },
      { currency: "USD", balance: 12000, minThreshold: 8000, maxThreshold: 50000, status: "low", reservedAmount: 1500, availableAmount: 10500 },
    ],
    lastUpdated: new Date(),
    alerts: [
      {
        id: "alert_2",
        type: "low_balance",
        currency: "USD",
        currentBalance: 12000,
        threshold: 15000,
        severity: "warning",
        message: "Solde USD faible - Réapprovisionnement recommandé",
        timestamp: new Date(),
        acknowledged: false
      }
    ]
  },
  {
    id: "liq_4",
    agencyId: "4",
    agencyName: "Agence Kigali",
    balances: [
      { currency: "RWF", balance: 15000000, minThreshold: 3000000, maxThreshold: 25000000, status: "normal", reservedAmount: 1000000, availableAmount: 14000000 },
      { currency: "USD", balance: 22000, minThreshold: 8000, maxThreshold: 45000, status: "normal", reservedAmount: 2500, availableAmount: 19500 },
      { currency: "EUR", balance: 18000, minThreshold: 6000, maxThreshold: 40000, status: "normal", reservedAmount: 2000, availableAmount: 16000 },
    ],
    lastUpdated: new Date(),
    alerts: []
  },
  {
    id: "liq_5",
    agencyId: "5",
    agencyName: "Agence Dubai",
    balances: [
      { currency: "AED", balance: 120000, minThreshold: 25000, maxThreshold: 200000, status: "normal", reservedAmount: 8000, availableAmount: 112000 },
      { currency: "USD", balance: 28000, minThreshold: 10000, maxThreshold: 60000, status: "normal", reservedAmount: 3000, availableAmount: 25000 },
      { currency: "EUR", balance: 20000, minThreshold: 7000, maxThreshold: 50000, status: "normal", reservedAmount: 2500, availableAmount: 17500 },
    ],
    lastUpdated: new Date(),
    alerts: []
  }
];
