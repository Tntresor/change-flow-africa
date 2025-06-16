
import { useState } from "react";
import { CashOperation, CashOperationRequest } from "@/types/cashOperation";
import { AgencyLiquidity } from "@/types/liquidity";
import { updateCurrencyBalance } from "@/utils/liquidityUtils";
import { useToast } from "@/hooks/use-toast";

export function useCashOperations() {
  const [cashOperations, setCashOperations] = useState<CashOperation[]>([]);
  const { toast } = useToast();

  const processCashOperation = (
    agencyId: string,
    operation: CashOperationRequest,
    agencies: AgencyLiquidity[],
    updateAgencies: (updater: (prev: AgencyLiquidity[]) => AgencyLiquidity[]) => void
  ) => {
    const agency = agencies.find(a => a.agencyId === agencyId);
    if (!agency) {
      toast({
        title: "Erreur",
        description: "Agence introuvable",
        variant: "destructive"
      });
      return;
    }

    console.log('Processing cash operation:', { agencyId, operation });

    // Create the operation record
    const newOperation: CashOperation = {
      id: `cash_${Date.now()}`,
      ...operation,
      timestamp: new Date(),
      agencyId,
      agencyName: agency.agencyName
    };

    console.log('New cash operation created:', newOperation);

    // Update the agency's balance
    updateAgencies(prev => {
      const updated = prev.map(ag => {
        if (ag.agencyId === agencyId) {
          const updatedBalances = ag.balances.map(balance => {
            if (balance.currency === operation.currency) {
              const amountChange = operation.type === 'cash_in' ? operation.amount : -operation.amount;
              
              console.log(`Updating balance for ${balance.currency}:`, {
                oldBalance: balance.balance,
                amountChange,
                newBalance: balance.balance + amountChange
              });

              return updateCurrencyBalance(balance, amountChange);
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

  return {
    cashOperations,
    processCashOperation
  };
}
