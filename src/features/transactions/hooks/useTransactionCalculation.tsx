
import { useState, useEffect } from "react";
import { TransactionFormData } from "@/components/transactions/form/TransactionFormData";
import { TransactionCalculationService } from "../services/transactionCalculationService";
import { mockExchangeRates, mockCommissions, mockFees } from "@/data/ratesData";

export function useTransactionCalculation(watchedValues: TransactionFormData) {
  const [manualRateEnabled, setManualRateEnabled] = useState(false);
  const [manualRate, setManualRate] = useState<number>(0);
  const [manualCommission, setManualCommission] = useState<number>(0);
  const [manualFees, setManualFees] = useState<number>(0);
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);

  const calculateTransaction = () => {
    const { amount, fromCurrency, toCurrency } = watchedValues;
    
    if (!amount || !fromCurrency || !toCurrency) return;

    const result = TransactionCalculationService.calculateTransaction(
      amount,
      fromCurrency,
      toCurrency,
      mockExchangeRates,
      mockCommissions,
      mockFees,
      {
        rate: manualRateEnabled ? manualRate : undefined,
        commission: manualCommission || undefined,
        fees: manualFees || undefined
      }
    );

    setCalculatedAmount(result.convertedAmount);

    // Mettre à jour le taux manuel si pas activé
    if (!manualRateEnabled) {
      setManualRate(result.exchangeRate);
    }
  };

  useEffect(() => {
    calculateTransaction();
  }, [watchedValues, manualRateEnabled, manualRate, manualCommission, manualFees]);

  return {
    manualRateEnabled,
    setManualRateEnabled,
    manualRate,
    setManualRate,
    manualCommission,
    setManualCommission,
    manualFees,
    setManualFees,
    calculatedAmount,
    calculateTransaction
  };
}
