
import { useState, useEffect } from "react";
import { AgencyLiquidity, PoolLiquidity, LiquidityTransfer, CurrencyBalance } from "@/types/liquidity";
import { Transaction } from "@/types/transaction";
import { useToast } from "@/hooks/use-toast";

// Add cash operation interface
interface CashOperation {
  id: string;
  type: 'cash_in' | 'cash_out';
  currency: string;
  amount: number;
  reason: string;
  reference: string;
  timestamp: Date;
  agencyId: string;
  agencyName: string;
}

// Updated mock data for the new agencies
const mockAgencyLiquidity: AgencyLiquidity[] = [
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

export function useLiquidityManager() {
  const [agencyLiquidity, setAgencyLiquidity] = useState<AgencyLiquidity[]>(mockAgencyLiquidity);
  const [poolLiquidity, setPoolLiquidity] = useState<PoolLiquidity[]>([]);
  const [transfers, setTransfers] = useState<LiquidityTransfer[]>([]);
  const [cashOperations, setCashOperations] = useState<CashOperation[]>([]);
  const { toast } = useToast();

  // Calcul de la liquidité poolée
  useEffect(() => {
    const calculatePoolLiquidity = () => {
      const currencies = new Set<string>();
      agencyLiquidity.forEach(agency => {
        agency.balances.forEach(balance => currencies.add(balance.currency));
      });

      const pools: PoolLiquidity[] = Array.from(currencies).map(currency => {
        const agencies = agencyLiquidity.map(agency => {
          const balance = agency.balances.find(b => b.currency === currency);
          return {
            agencyId: agency.agencyId,
            agencyName: agency.agencyName,
            balance: balance?.balance || 0,
            available: balance?.availableAmount || 0,
            percentage: 0 // Calculé après
          };
        }).filter(a => a.balance > 0);

        const totalBalance = agencies.reduce((sum, a) => sum + a.balance, 0);
        const totalAvailable = agencies.reduce((sum, a) => sum + a.available, 0);

        // Calcul des pourcentages
        agencies.forEach(agency => {
          agency.percentage = totalBalance > 0 ? (agency.balance / totalBalance) * 100 : 0;
        });

        return {
          currency,
          totalBalance,
          totalReserved: totalBalance - totalAvailable,
          totalAvailable,
          agencies,
          rebalancingRules: []
        };
      });

      setPoolLiquidity(pools);
    };

    calculatePoolLiquidity();
  }, [agencyLiquidity]);

  const updateBalanceAfterTransaction = (transaction: Transaction) => {
    setAgencyLiquidity(prev => prev.map(agency => {
      if (agency.agencyId === transaction.agencyId) {
        return {
          ...agency,
          balances: agency.balances.map(balance => {
            if (balance.currency === transaction.fromCurrency) {
              const newBalance = balance.balance - transaction.amount;
              return {
                ...balance,
                balance: newBalance,
                availableAmount: newBalance - balance.reservedAmount,
                status: getBalanceStatus(newBalance, balance.minThreshold, balance.maxThreshold)
              };
            }
            if (balance.currency === transaction.toCurrency) {
              const newBalance = balance.balance + transaction.convertedAmount;
              return {
                ...balance,
                balance: newBalance,
                availableAmount: newBalance - balance.reservedAmount,
                status: getBalanceStatus(newBalance, balance.minThreshold, balance.maxThreshold)
              };
            }
            return balance;
          }),
          lastUpdated: new Date()
        };
      }
      return agency;
    }));

    toast({
      title: "Balance mise à jour",
      description: `Liquidité de l'agence ${transaction.agencyName} mise à jour après transaction`,
    });
  };

  const processCashOperation = (
    agencyId: string,
    operation: {
      type: 'cash_in' | 'cash_out';
      currency: string;
      amount: number;
      reason: string;
      reference: string;
    }
  ) => {
    const agency = agencyLiquidity.find(a => a.agencyId === agencyId);
    if (!agency) {
      toast({
        title: "Erreur",
        description: "Agence introuvable",
        variant: "destructive"
      });
      return;
    }

    console.log('Processing cash operation:', { agencyId, operation });

    // Create the operation record first
    const newOperation: CashOperation = {
      id: `cash_${Date.now()}`,
      ...operation,
      timestamp: new Date(),
      agencyId,
      agencyName: agency.agencyName
    };

    console.log('New cash operation created:', newOperation);

    // Update the agency's balance
    setAgencyLiquidity(prev => {
      const updated = prev.map(ag => {
        if (ag.agencyId === agencyId) {
          const updatedBalances = ag.balances.map(balance => {
            if (balance.currency === operation.currency) {
              const amountChange = operation.type === 'cash_in' ? operation.amount : -operation.amount;
              const newBalance = balance.balance + amountChange;
              const newAvailable = newBalance - balance.reservedAmount;
              const newStatus = getBalanceStatus(newBalance, balance.minThreshold, balance.maxThreshold);
              
              console.log(`Updating balance for ${balance.currency}:`, {
                oldBalance: balance.balance,
                amountChange,
                newBalance,
                newAvailable,
                newStatus
              });

              return {
                ...balance,
                balance: newBalance,
                availableAmount: newAvailable,
                status: newStatus
              };
            }
            return balance;
          });

          return {
            ...ag,
            balances: updatedBalances,
            lastUpdated: new Date()
          };
        }
        return ag;
      });
      
      console.log('Agency liquidity updated:', updated.find(a => a.agencyId === agencyId));
      return updated;
    });

    // Add to operations history
    setCashOperations(prev => {
      const updated = [newOperation, ...prev];
      console.log('Cash operations updated:', updated);
      return updated;
    });

    toast({
      title: `${operation.type === 'cash_in' ? 'Réapprovisionnement' : 'Collecte'} effectué`,
      description: `${operation.amount} ${operation.currency} - ${agency.agencyName}`,
    });

    console.log('Cash operation processing completed');
  };

  const getBalanceStatus = (balance: number, minThreshold: number, maxThreshold: number): 'critical' | 'low' | 'normal' | 'high' => {
    if (balance < minThreshold * 0.5) return 'critical';
    if (balance < minThreshold) return 'low';
    if (balance > maxThreshold) return 'high';
    return 'normal';
  };

  const transferLiquidity = (transfer: Omit<LiquidityTransfer, 'id' | 'timestamp' | 'status'>) => {
    const newTransfer: LiquidityTransfer = {
      ...transfer,
      id: `transfer_${Date.now()}`,
      timestamp: new Date(),
      status: 'pending'
    };

    setTransfers(prev => [newTransfer, ...prev]);
    
    // Simulation de l'exécution du transfert
    setTimeout(() => {
      executeTransfer(newTransfer.id);
    }, 2000);
  };

  const executeTransfer = (transferId: string) => {
    const transfer = transfers.find(t => t.id === transferId);
    if (!transfer) return;

    setAgencyLiquidity(prev => prev.map(agency => {
      if (agency.agencyId === transfer.fromAgencyId) {
        return {
          ...agency,
          balances: agency.balances.map(balance => {
            if (balance.currency === transfer.currency) {
              const newBalance = balance.balance - transfer.amount;
              return {
                ...balance,
                balance: newBalance,
                availableAmount: newBalance - balance.reservedAmount,
                status: getBalanceStatus(newBalance, balance.minThreshold, balance.maxThreshold)
              };
            }
            return balance;
          })
        };
      }
      if (agency.agencyId === transfer.toAgencyId) {
        return {
          ...agency,
          balances: agency.balances.map(balance => {
            if (balance.currency === transfer.currency) {
              const newBalance = balance.balance + transfer.amount;
              return {
                ...balance,
                balance: newBalance,
                availableAmount: newBalance - balance.reservedAmount,
                status: getBalanceStatus(newBalance, balance.minThreshold, balance.maxThreshold)
              };
            }
            return balance;
          })
        };
      }
      return agency;
    }));

    setTransfers(prev => prev.map(t => 
      t.id === transferId ? { ...t, status: 'completed' } : t
    ));

    toast({
      title: "Transfert de liquidité effectué",
      description: `${transfer.amount} ${transfer.currency} transféré avec succès`,
    });
  };

  return {
    agencyLiquidity,
    poolLiquidity,
    transfers,
    cashOperations,
    updateBalanceAfterTransaction,
    transferLiquidity,
    processCashOperation,
  };
}
