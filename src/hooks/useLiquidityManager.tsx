
import { useState, useEffect } from "react";
import { AgencyLiquidity, PoolLiquidity, LiquidityTransfer, CurrencyBalance } from "@/types/liquidity";
import { Transaction } from "@/types/transaction";
import { useToast } from "@/hooks/use-toast";

// Données mockées pour la démonstration
const mockAgencyLiquidity: AgencyLiquidity[] = [
  {
    id: "liq_1",
    agencyId: "1",
    agencyName: "Agence Paris Centre",
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
    agencyName: "Agence Lyon",
    balances: [
      { currency: "EUR", balance: 35000, minThreshold: 10000, maxThreshold: 100000, status: "normal", reservedAmount: 3000, availableAmount: 32000 },
      { currency: "XOF", balance: 12000000, minThreshold: 2000000, maxThreshold: 15000000, status: "normal", reservedAmount: 800000, availableAmount: 11200000 },
      { currency: "MAD", balance: 45000, minThreshold: 10000, maxThreshold: 80000, status: "normal", reservedAmount: 5000, availableAmount: 40000 },
    ],
    lastUpdated: new Date(),
    alerts: []
  }
];

export function useLiquidityManager() {
  const [agencyLiquidity, setAgencyLiquidity] = useState<AgencyLiquidity[]>(mockAgencyLiquidity);
  const [poolLiquidity, setPoolLiquidity] = useState<PoolLiquidity[]>([]);
  const [transfers, setTransfers] = useState<LiquidityTransfer[]>([]);
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
    updateBalanceAfterTransaction,
    transferLiquidity,
  };
}
