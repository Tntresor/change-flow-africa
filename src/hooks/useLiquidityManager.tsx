
import { useState, useEffect } from "react";
import { mockAgencyLiquidity } from "@/data/mockLiquidityData";
import { AgencyLiquidity } from "@/types/liquidity";
import { usePoolLiquidity } from "./usePoolLiquidity";
import { useLiquidityTransfers } from "./useLiquidityTransfers";
import { useCashOperations } from "./useCashOperations";

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

  return {
    agencyLiquidity,
    poolLiquidity,
    transfers,
    cashOperations,
    processCashOperation: handleCashOperation,
    transferLiquidity: handleTransferLiquidity,
    executeTransfer: handleExecuteTransfer
  };
}
