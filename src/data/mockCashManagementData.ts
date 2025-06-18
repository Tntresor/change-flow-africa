
import { CashierTill, SafeVault, AgencyCashSummary } from "@/types/cashManagement";
import { CurrencyBalance } from "@/types/liquidity";

// Données de test pour les caisses
export const mockCashierTills: CashierTill[] = [
  {
    id: "till_001",
    cashierId: "emp_1",
    cashierName: "Marie Dubois",
    agencyId: "1",
    balances: [
      {
        currency: "EUR",
        balance: 5000.00,
        minThreshold: 500,
        maxThreshold: 10000,
        status: "normal",
        reservedAmount: 200,
        availableAmount: 4800
      },
      {
        currency: "USD",
        balance: 3200.50,
        minThreshold: 300,
        maxThreshold: 8000,
        status: "normal",
        reservedAmount: 150,
        availableAmount: 3050.50
      }
    ],
    isActive: true,
    lastActivity: new Date("2024-01-15T14:30:00")
  },
  {
    id: "till_002",
    cashierId: "emp_2", 
    cashierName: "Jean Martin",
    agencyId: "1",
    balances: [
      {
        currency: "EUR",
        balance: 2800.75,
        minThreshold: 500,
        maxThreshold: 10000,
        status: "low",
        reservedAmount: 100,
        availableAmount: 2700.75
      },
      {
        currency: "GBP",
        balance: 1500.00,
        minThreshold: 200,
        maxThreshold: 5000,
        status: "normal",
        reservedAmount: 0,
        availableAmount: 1500.00
      }
    ],
    isActive: true,
    lastActivity: new Date("2024-01-15T16:45:00")
  },
  {
    id: "till_003",
    cashierId: "emp_3",
    cashierName: "Sophie Laurent",
    agencyId: "2",
    balances: [
      {
        currency: "EUR",
        balance: 6500.00,
        minThreshold: 500,
        maxThreshold: 10000,
        status: "normal",
        reservedAmount: 300,
        availableAmount: 6200.00
      },
      {
        currency: "CHF",
        balance: 2200.25,
        minThreshold: 200,
        maxThreshold: 5000,
        status: "normal",
        reservedAmount: 50,
        availableAmount: 2150.25
      }
    ],
    isActive: true,
    lastActivity: new Date("2024-01-15T17:20:00")
  }
];

// Données de test pour les coffres
export const mockSafeVaults: SafeVault[] = [
  {
    id: "vault_001",
    agencyId: "1",
    agencyName: "Agence Paris Centre",
    balances: [
      {
        currency: "EUR",
        balance: 25000.00,
        minThreshold: 5000,
        maxThreshold: 50000,
        status: "normal",
        reservedAmount: 1000,
        availableAmount: 24000.00
      },
      {
        currency: "USD",
        balance: 18500.75,
        minThreshold: 3000,
        maxThreshold: 40000,
        status: "normal",
        reservedAmount: 500,
        availableAmount: 18000.75
      },
      {
        currency: "GBP",
        balance: 12000.50,
        minThreshold: 2000,
        maxThreshold: 30000,
        status: "normal",
        reservedAmount: 0,
        availableAmount: 12000.50
      }
    ],
    lastUpdated: new Date("2024-01-15T18:00:00"),
    accessLevel: "manager"
  },
  {
    id: "vault_002", 
    agencyId: "2",
    agencyName: "Agence Lyon",
    balances: [
      {
        currency: "EUR",
        balance: 32000.00,
        minThreshold: 5000,
        maxThreshold: 50000,
        status: "normal",
        reservedAmount: 2000,
        availableAmount: 30000.00
      },
      {
        currency: "CHF",
        balance: 15800.25,
        minThreshold: 2000,
        maxThreshold: 35000,
        status: "normal",
        reservedAmount: 800,
        availableAmount: 15000.25
      }
    ],
    lastUpdated: new Date("2024-01-15T17:45:00"),
    accessLevel: "supervisor"
  }
];

// Données consolidées par agence
export const mockAgencyCashSummaries: AgencyCashSummary[] = [
  {
    agencyId: "1",
    agencyName: "Agence Paris Centre",
    totalsByCurrency: {
      "EUR": 32800.75, // 5000 + 2800.75 + 25000
      "USD": 21701.25, // 3200.50 + 18500.75
      "GBP": 13500.50  // 1500 + 12000.50
    },
    tills: mockCashierTills.filter(t => t.agencyId === "1"),
    vault: mockSafeVaults[0],
    lastConsolidation: new Date("2024-01-15T18:30:00")
  },
  {
    agencyId: "2", 
    agencyName: "Agence Lyon",
    totalsByCurrency: {
      "EUR": 38500.00, // 6500 + 32000
      "CHF": 17200.50  // 2200.25 + 15000.25
    },
    tills: mockCashierTills.filter(t => t.agencyId === "2"),
    vault: mockSafeVaults[1],
    lastConsolidation: new Date("2024-01-15T18:15:00")
  }
];
