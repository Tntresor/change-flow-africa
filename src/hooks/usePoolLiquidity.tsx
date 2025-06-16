
import { useState, useEffect } from "react";
import { PoolLiquidity, AgencyLiquidity } from "@/types/liquidity";

export function usePoolLiquidity(agencyLiquidity: AgencyLiquidity[]) {
  const [poolLiquidity, setPoolLiquidity] = useState<PoolLiquidity[]>([]);

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

  return poolLiquidity;
}
