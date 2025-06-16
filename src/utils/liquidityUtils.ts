
import { CurrencyBalance } from "@/types/liquidity";

export const getBalanceStatus = (
  balance: number, 
  minThreshold: number, 
  maxThreshold: number
): 'critical' | 'low' | 'normal' | 'high' => {
  if (balance < minThreshold * 0.5) return 'critical';
  if (balance < minThreshold) return 'low';
  if (balance > maxThreshold) return 'high';
  return 'normal';
};

export const updateCurrencyBalance = (
  balance: CurrencyBalance,
  amountChange: number
): CurrencyBalance => {
  const newBalance = balance.balance + amountChange;
  const newAvailable = newBalance - balance.reservedAmount;
  const newStatus = getBalanceStatus(newBalance, balance.minThreshold, balance.maxThreshold);

  return {
    ...balance,
    balance: newBalance,
    availableAmount: newAvailable,
    status: newStatus
  };
};
