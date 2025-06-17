
import { ExchangeRateSettings, CommissionTierSettings, FeeSettings } from "@/types/rates";
import { ExchangeRateService } from "@/features/exchange-rates/services/exchangeRateService";
import { CommissionService, CommissionCalculation } from "./commissionService";
import { FeeService, FeeCalculation } from "./feeService";

export interface TransactionCalculationResult {
  exchangeRate: number;
  convertedAmount: number;
  commission: CommissionCalculation;
  fees: FeeCalculation;
  totalCost: number;
  netAmount: number;
  finalAmount: number; // Added missing property
}

export interface TransactionCalculationOverrides {
  rate?: number;
  commission?: number;
  fees?: number;
}

export class TransactionCalculationService {
  static calculateTransaction(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    exchangeRates: ExchangeRateSettings[],
    commissions: CommissionTierSettings[],
    fees: FeeSettings[],
    overrides: TransactionCalculationOverrides = {},
    transactionType: string = "currency_exchange"
  ): TransactionCalculationResult {
    // 1. Calcul du taux de change
    const exchangeRate = this.calculateExchangeRate(
      fromCurrency,
      toCurrency,
      exchangeRates,
      overrides.rate
    );

    // 2. Conversion du montant
    const convertedAmount = amount * exchangeRate;

    // 3. Calcul des commissions
    const commission = this.calculateCommission(
      amount,
      commissions,
      transactionType,
      overrides.commission
    );

    // 4. Calcul des frais
    const feeCalculation = this.calculateFees(
      fees,
      transactionType,
      overrides.fees
    );

    // 5. Calculs finaux
    const totalCost = commission.totalCommission + feeCalculation.totalFees;
    const netAmount = amount - totalCost;
    const finalAmount = netAmount * exchangeRate; // Calculate final amount after costs

    return {
      exchangeRate,
      convertedAmount,
      commission,
      fees: feeCalculation,
      totalCost,
      netAmount,
      finalAmount
    };
  }

  private static calculateExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    exchangeRates: ExchangeRateSettings[],
    manualRate?: number
  ): number {
    if (manualRate !== undefined) {
      return manualRate;
    }

    const rateCalculation = ExchangeRateService.calculateExchangeRate(
      fromCurrency,
      toCurrency,
      exchangeRates
    );

    return rateCalculation?.applicableRate || 0;
  }

  private static calculateCommission(
    amount: number,
    commissions: CommissionTierSettings[],
    transactionType: string,
    manualCommission?: number
  ): CommissionCalculation {
    if (manualCommission !== undefined) {
      return {
        amount: manualCommission,
        percentage: 0,
        tier: CommissionService['createDefaultTier'](),
        totalCommission: manualCommission
      };
    }

    return CommissionService.calculateCommission(amount, commissions, transactionType);
  }

  private static calculateFees(
    fees: FeeSettings[],
    transactionType: string,
    manualFees?: number
  ): FeeCalculation {
    if (manualFees !== undefined) {
      return {
        fees: [],
        totalFees: manualFees
      };
    }

    return FeeService.calculateFees(fees, transactionType);
  }

  static validateTransactionInputs(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!amount || amount <= 0) {
      errors.push("Le montant doit être supérieur à 0");
    }

    if (!fromCurrency) {
      errors.push("La devise source est obligatoire");
    }

    if (!toCurrency) {
      errors.push("La devise de destination est obligatoire");
    }

    if (fromCurrency === toCurrency) {
      errors.push("Les devises source et destination doivent être différentes");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
