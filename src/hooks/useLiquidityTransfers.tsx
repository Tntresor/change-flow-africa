
import { useState } from "react";
import { LiquidityTransfer, AgencyLiquidity } from "@/types/liquidity";
import { updateCurrencyBalance } from "@/utils/liquidityUtils";
import { useToast } from "@/hooks/use-toast";

export function useLiquidityTransfers() {
  const [transfers, setTransfers] = useState<LiquidityTransfer[]>([]);
  const { toast } = useToast();

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

  const executeTransfer = (
    transferId: string,
    agencies?: AgencyLiquidity[],
    updateAgencies?: (updater: (prev: AgencyLiquidity[]) => AgencyLiquidity[]) => void
  ) => {
    const transfer = transfers.find(t => t.id === transferId);
    if (!transfer || !agencies || !updateAgencies) return;

    updateAgencies(prev => prev.map(agency => {
      if (agency.agencyId === transfer.fromAgencyId) {
        return {
          ...agency,
          balances: agency.balances.map(balance => {
            if (balance.currency === transfer.currency) {
              return updateCurrencyBalance(balance, -transfer.amount);
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
              return updateCurrencyBalance(balance, transfer.amount);
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
    transfers,
    transferLiquidity,
    executeTransfer: (transferId: string, agencies: AgencyLiquidity[], updateAgencies: (updater: (prev: AgencyLiquidity[]) => AgencyLiquidity[]) => void) => 
      executeTransfer(transferId, agencies, updateAgencies)
  };
}
