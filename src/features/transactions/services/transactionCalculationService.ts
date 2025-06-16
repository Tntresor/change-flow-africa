
import { ExchangeRateService } from "@/features/exchange-rates/services/exchangeRateService";
import { ExchangeRateSettings, CommissionTierSettings, FeeSettings } from "@/types/rates";

export interface TransactionCalculationResult {
  convertedAmount: number;
  commission: number;
  fees: number;
  finalAmount: number;
  exchangeRate: number;
}

export class TransactionCalculationService {
  static calculateTransaction(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    exchangeRates: ExchangeRateSettings[],
    commissions: CommissionTierSettings[],
    fees: FeeSettings[],
    manualOverrides?: {
      rate?: number;
      commission?: number;
      fees?: number;
    }
  ): TransactionCalculationResult {
    // Calcul du taux de change
    const exchangeRate = manualOverrides?.rate || 
      ExchangeRateService.calculateExchangeRate(fromCurrency, toCurrency, exchangeRates)?.applicableRate || 
      1;

    // Calcul de la commission
    let commission = manualOverrides?.commission || 0;
    if (!manualOverrides?.commission) {
      const activeCommission = commissions.find(c => c.isActive);
      if (activeCommission) {
        commission = (amount * activeCommission.percentage / 100) + activeCommission.fixedAmount;
      }
    }

    // Calcul des frais
    const totalFees = manualOverrides?.fees || 
      fees.filter(f => f.isActive).reduce((sum, fee) => sum + fee.amount, 0);

    // Montant après déduction des commissions et frais, puis conversion
    const netAmount = amount - commission - totalFees;
    const convertedAmount = netAmount * exchangeRate;

    return {
      convertedAmount,
      commission,
      fees: totalFees,
      finalAmount: convertedAmount,
      exchangeRate
    };
  }
}
