import { ExchangeRateSettings, CommissionTierSettings, FeeSettings } from "@/types/rates";
import { ExchangeRateService, TransferRateRequest } from "@/features/exchange-rates/services/exchangeRateService";
import { CommissionService, CommissionCalculation } from "./commissionService";
import { FeeService, FeeCalculation } from "./feeService";

export interface TransactionCalculationResult {
  exchangeRate: number;
  convertedAmount: number;
  commission: CommissionCalculation;
  fees: FeeCalculation;
  totalCost: number;
  netAmount: number;
  finalAmount: number;
  transferDirection?: 'SEND' | 'RECEIVE';
  marginApplied?: number;
}

export interface TransactionCalculationOverrides {
  rate?: number;
  commission?: number;
  fees?: number;
  transferDirection?: 'SEND' | 'RECEIVE';
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
    // Determine transfer direction (default to SEND for backward compatibility)
    const transferDirection = overrides.transferDirection || 'SEND';

    // 1. Calculate exchange rate with correct bid/ask logic
    const exchangeRateResult = this.calculateExchangeRate(
      fromCurrency,
      toCurrency,
      exchangeRates,
      overrides.rate,
      transferDirection
    );

    // 2. Calculate converted amount
    const convertedAmount = amount * exchangeRateResult.rate;

    // 3. Calculate commissions
    const commission = this.calculateCommission(
      amount,
      commissions,
      transactionType,
      overrides.commission
    );

    // 4. Calculate fees
    const feeCalculation = this.calculateFees(
      fees,
      transactionType,
      overrides.fees
    );

    // 5. Final calculations
    const totalCost = commission.totalCommission + feeCalculation.totalFees;
    const netAmount = amount - totalCost;
    const finalAmount = netAmount * exchangeRateResult.rate;

    return {
      exchangeRate: exchangeRateResult.rate,
      convertedAmount,
      commission,
      fees: feeCalculation,
      totalCost,
      netAmount,
      finalAmount,
      transferDirection,
      marginApplied: exchangeRateResult.marginApplied
    };
  }

  private static calculateExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    exchangeRates: ExchangeRateSettings[],
    manualRate?: number,
    transferDirection: 'SEND' | 'RECEIVE' = 'SEND'
  ): { rate: number; marginApplied?: number } {
    if (manualRate !== undefined) {
      return { rate: manualRate };
    }

    // Use the corrected transfer rate calculation
    const transferRequest: TransferRateRequest = {
      direction: transferDirection
    };

    const rateCalculation = ExchangeRateService.calculateTransferRate(
      fromCurrency,
      toCurrency,
      exchangeRates,
      transferRequest
    );

    return {
      rate: rateCalculation?.applicableRate || 0,
      marginApplied: rateCalculation?.marginApplied
    };
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
