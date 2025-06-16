
import { useState, useEffect } from "react";
import { mockExchangeRates, mockCommissions, mockFees } from "@/data/ratesData";
import { TransactionFormData } from "@/components/transactions/form/TransactionFormData";

export function useTransactionCalculation(watchedValues: TransactionFormData) {
  const [manualRateEnabled, setManualRateEnabled] = useState(false);
  const [manualRate, setManualRate] = useState<number>(0);
  const [manualCommission, setManualCommission] = useState<number>(0);
  const [manualFees, setManualFees] = useState<number>(0);
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);

  const calculateTransaction = () => {
    const { amount, fromCurrency, toCurrency } = watchedValues;
    
    if (!amount || !fromCurrency || !toCurrency) return;

    // Trouver le taux de change
    const exchangeRate = mockExchangeRates.find(
      rate => rate.fromCurrency === fromCurrency && rate.toCurrency === toCurrency && rate.isActive
    );

    // Utiliser le taux Ask (nous vendons la devise cible au client)
    const currentRate = manualRateEnabled ? manualRate : (exchangeRate?.askRate || 1);
    
    // Calculer la commission
    const activeCommission = mockCommissions.find(c => c.isActive);
    let commission = manualCommission;
    if (!manualCommission && activeCommission) {
      commission = (amount * activeCommission.percentage / 100) + activeCommission.fixedAmount;
    }

    // Calculer les frais
    const activeFees = mockFees.filter(f => f.isActive);
    const totalFees = manualFees || activeFees.reduce((sum, fee) => sum + fee.amount, 0);

    // Montant final après déduction des commissions et frais, puis conversion
    const convertedAmount = (amount - commission - totalFees) * currentRate;
    setCalculatedAmount(convertedAmount);

    // Mettre à jour le taux manuel si pas activé (utiliser le taux Ask)
    if (!manualRateEnabled && exchangeRate) {
      setManualRate(exchangeRate.askRate);
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
