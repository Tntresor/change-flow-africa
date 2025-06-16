
import { useState, useEffect } from "react";
import { TransactionFormData } from "@/components/transactions/form/TransactionFormData";
import { TransactionCalculationService } from "../services/transactionCalculationService";
import { mockExchangeRates } from "@/data/ratesData";
import { useCommissionCalculation } from "./useCommissionCalculation";

export function useTransactionCalculation(watchedValues: TransactionFormData) {
  const [manualRateEnabled, setManualRateEnabled] = useState(false);
  const [manualRate, setManualRate] = useState<number>(0);
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);

  const {
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
  } = useCommissionCalculation(watchedValues.amount || 0, watchedValues.type || "currency_exchange");

  const calculateTransaction = () => {
    const { amount, fromCurrency, toCurrency, type } = watchedValues;
    
    if (!amount || !fromCurrency || !toCurrency) return;

    const validation = TransactionCalculationService.validateTransactionInputs(
      amount,
      fromCurrency,
      toCurrency
    );

    if (!validation.isValid) {
      console.warn("Validation errors:", validation.errors);
      return;
    }

    const result = TransactionCalculationService.calculateTransaction(
      amount,
      fromCurrency,
      toCurrency,
      mockExchangeRates,
      [], // commissions calculées séparément
      [], // frais calculés séparément
      {
        rate: manualRateEnabled ? manualRate : undefined,
        commission: useManualCommission ? manualCommission : undefined,
        fees: useManualFees ? manualFees : undefined
      },
      type || "currency_exchange"
    );

    setCalculatedAmount(result.convertedAmount);

    // Mettre à jour le taux manuel si pas activé
    if (!manualRateEnabled) {
      setManualRate(result.exchangeRate);
    }
  };

  useEffect(() => {
    calculateTransaction();
  }, [
    watchedValues, 
    manualRateEnabled, 
    manualRate, 
    useManualCommission,
    manualCommission,
    useManualFees,
    manualFees
  ]);

  return {
    // Taux de change
    manualRateEnabled,
    setManualRateEnabled,
    manualRate,
    setManualRate,
    
    // Commissions
    commissionCalculation,
    manualCommission,
    setManualCommission,
    useManualCommission,
    setUseManualCommission,
    
    // Frais
    feeCalculation,
    manualFees,
    setManualFees,
    useManualFees,
    setUseManualFees,
    
    // Résultats
    calculatedAmount,
    totalCost,
    calculateTransaction
  };
}
