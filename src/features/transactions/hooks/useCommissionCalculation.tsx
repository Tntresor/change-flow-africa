
import { useState, useMemo } from "react";
import { CommissionService, CommissionCalculation } from "../services/commissionService";
import { FeeService, FeeCalculation } from "../services/feeService";
import { mockCommissions, mockFees } from "@/data/ratesData";

export function useCommissionCalculation(
  amount: number,
  transactionType: string = "currency_exchange"
) {
  const [manualCommission, setManualCommission] = useState<number>(0);
  const [manualFees, setManualFees] = useState<number>(0);
  const [useManualCommission, setUseManualCommission] = useState(false);
  const [useManualFees, setUseManualFees] = useState(false);

  const commissionCalculation = useMemo((): CommissionCalculation => {
    if (useManualCommission) {
      return {
        amount: manualCommission,
        percentage: 0,
        tier: CommissionService['createDefaultTier'](),
        totalCommission: manualCommission
      };
    }

    return CommissionService.calculateCommission(amount, mockCommissions, transactionType);
  }, [amount, transactionType, useManualCommission, manualCommission]);

  const feeCalculation = useMemo((): FeeCalculation => {
    if (useManualFees) {
      return {
        fees: [],
        totalFees: manualFees
      };
    }

    return FeeService.calculateFees(mockFees, transactionType);
  }, [transactionType, useManualFees, manualFees]);

  const totalCost = useMemo(() => {
    return commissionCalculation.totalCommission + feeCalculation.totalFees;
  }, [commissionCalculation.totalCommission, feeCalculation.totalFees]);

  return {
    commissionCalculation,
    feeCalculation,
    totalCost,
    manualCommission,
    setManualCommission,
    manualFees,
    setManualFees,
    useManualCommission,
    setUseManualCommission,
    useManualFees,
    setUseManualFees
  };
}
