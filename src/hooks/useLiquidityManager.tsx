
import { useState, useEffect } from "react";
import { mockAgencyLiquidity } from "@/data/mockLiquidityData";
import { AgencyLiquidity } from "@/types/liquidity";
import { Transaction } from "@/types/transaction";
import { usePoolLiquidity } from "./usePoolLiquidity";
import { useLiquidityTransfers } from "./useLiquidityTransfers";
import { useCashOperations } from "./useCashOperations";
import { updateCurrencyBalance } from "@/utils/liquidityUtils";

export function useLiquidityManager() {
  const [agencyLiquidity, setAgencyLiquidity] = useState<AgencyLiquidity[]>(mockAgencyLiquidity);
  
  const poolLiquidity = usePoolLiquidity(agencyLiquidity);
  const { transfers, transferLiquidity, executeTransfer } = useLiquidityTransfers();
  const { cashOperations, processCashOperation } = useCashOperations();

  const handleCashOperation = (
    agencyId: string,
    operation: {
      type: 'cash_in' | 'cash_out';
      currency: string;
      amount: number;
      reason: string;
      reference: string;
    }
  ) => {
    processCashOperation(agencyId, operation, agencyLiquidity, setAgencyLiquidity);
  };

  const handleTransferLiquidity = (transfer: {
    fromAgencyId: string;
    toAgencyId: string;
    currency: string;
    amount: number;
    reason: string;
    initiatedBy: string;
  }) => {
    transferLiquidity(transfer);
  };

  const handleExecuteTransfer = (transferId: string) => {
    executeTransfer(transferId, agencyLiquidity, setAgencyLiquidity);
  };

  const updateBalanceAfterTransaction = (transaction: Transaction) => {
    console.log('Updating balance after transaction:', transaction);
    
    setAgencyLiquidity(prev => prev.map(agency => {
      if (agency.agencyId === transaction.agencyId) {
        return {
          ...agency,
          balances: agency.balances.map(balance => {
            // Update balance for the source currency (subtract amount + fees)
            if (balance.currency === transaction.fromCurrency) {
              const totalDeduction = transaction.amount + transaction.fees;
              return updateCurrencyBalance(balance, -totalDeduction);
            }
            // Update balance for the destination currency (add converted amount)
            if (balance.currency === transaction.toCurrency) {
              return updateCurrencyBalance(balance, transaction.convertedAmount);
            }
            return balance;
          }),
          lastUpdated: new Date()
        };
      }
      return agency;
    }));
  };

  return {
    agencyLiquidity,
    poolLiquidity,
    transfers,
    cashOperations,
    processCashOperation: handleCashOperation,
    transferLiquidity: handleTransferLiquidity,
    executeTransfer: handleExecuteTransfer,
    updateBalanceAfterTransaction
  };
}
