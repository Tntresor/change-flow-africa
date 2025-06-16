
import { ExchangeRateSettings } from "@/types/rates";

export interface ExchangeRateCalculation {
  baseRate: number;
  bidRate: number;
  askRate: number;
  spread: number;
  spreadPercentage: number;
  applicableRate: number;
  isSellingToCurrency: boolean;
}

export class ExchangeRateService {
  private static calculateBidAskRates(baseRate: number, totalSpread: number) {
    const halfSpread = totalSpread / 2;
    return {
      bidRate: baseRate - halfSpread,
      askRate: baseRate + halfSpread
    };
  }

  static getExchangeRateForPair(
    fromCurrency: string, 
    toCurrency: string, 
    rates: ExchangeRateSettings[]
  ): ExchangeRateSettings | null {
    return rates.find(
      rate => rate.fromCurrency === fromCurrency && 
               rate.toCurrency === toCurrency && 
               rate.isActive
    ) || null;
  }

  static calculateExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    rates: ExchangeRateSettings[]
  ): ExchangeRateCalculation | null {
    const exchangeRate = this.getExchangeRateForPair(fromCurrency, toCurrency, rates);
    
    if (!exchangeRate) {
      return null;
    }

    const { baseRate, totalSpread, bidRate, askRate } = exchangeRate;
    const spreadPercentage = baseRate > 0 ? (totalSpread / baseRate) * 100 : 0;
    
    // Le client achète la devise de destination, nous vendons (taux Ask)
    const applicableRate = askRate;
    const isSellingToCurrency = true;

    return {
      baseRate,
      bidRate,
      askRate,
      spread: totalSpread,
      spreadPercentage,
      applicableRate,
      isSellingToCurrency
    };
  }

  static convertAmount(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: ExchangeRateSettings[],
    manualRate?: number
  ): number {
    if (manualRate) {
      return amount * manualRate;
    }

    const calculation = this.calculateExchangeRate(fromCurrency, toCurrency, rates);
    if (!calculation) {
      return 0;
    }

    return amount * calculation.applicableRate;
  }

  static createExchangeRateSettings(
    fromCurrency: string,
    toCurrency: string,
    baseRate: number,
    totalSpread: number
  ): Omit<ExchangeRateSettings, 'id' | 'lastUpdated'> {
    const { bidRate, askRate } = this.calculateBidAskRates(baseRate, totalSpread);
    
    return {
      fromCurrency,
      toCurrency,
      baseRate,
      totalSpread,
      bidRate,
      askRate,
      isActive: true
    };
  }
}
