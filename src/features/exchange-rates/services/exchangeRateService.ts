
import { ExchangeRateSettings } from "@/types/rates";

export interface ExchangeRateCalculation {
  baseRate: number;
  bidRate: number;
  askRate: number;
  spread: number;
  spreadPercentage: number;
  applicableRate: number;
  isSellingToCurrency: boolean;
  transferDirection?: 'SEND' | 'RECEIVE';
  marginApplied?: number;
}

export interface TransferRateRequest {
  direction: 'SEND' | 'RECEIVE';
  sellMargin?: number; // Default 0.005 (0.5%)
  buyMargin?: number;  // Default 0.005 (0.5%)
}

export class ExchangeRateService {
  private static readonly DEFAULT_SELL_MARGIN = 0.005; // 0.5%
  private static readonly DEFAULT_BUY_MARGIN = 0.005;  // 0.5%

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

  /**
   * Calculate display rate (mid-market) for quotes
   */
  static calculateDisplayRate(
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
    
    // For display purposes, use mid-market rate
    const midRate = (bidRate + askRate) / 2;

    return {
      baseRate,
      bidRate,
      askRate,
      spread: totalSpread,
      spreadPercentage,
      applicableRate: midRate,
      isSellingToCurrency: false // Not applicable for display rates
    };
  }

  /**
   * Calculate transfer rate with correct bid/ask logic and margin application
   */
  static calculateTransferRate(
    fromCurrency: string,
    toCurrency: string,
    rates: ExchangeRateSettings[],
    transferRequest: TransferRateRequest
  ): ExchangeRateCalculation | null {
    const exchangeRate = this.getExchangeRateForPair(fromCurrency, toCurrency, rates);
    
    if (!exchangeRate) {
      return null;
    }

    const { baseRate, totalSpread, bidRate, askRate } = exchangeRate;
    const spreadPercentage = baseRate > 0 ? (totalSpread / baseRate) * 100 : 0;
    
    const sellMargin = transferRequest.sellMargin ?? this.DEFAULT_SELL_MARGIN;
    const buyMargin = transferRequest.buyMargin ?? this.DEFAULT_BUY_MARGIN;

    let applicableRate: number;
    let marginApplied: number;
    let isSellingToCurrency: boolean;

    if (transferRequest.direction === 'SEND') {
      // Customer sells source currency -> we buy -> use BID -> apply SELL margin
      applicableRate = bidRate * (1 - sellMargin);
      marginApplied = sellMargin;
      isSellingToCurrency = false; // We are buying from customer
    } else { // RECEIVE
      // Customer buys source currency -> we sell -> use ASK -> apply BUY margin  
      applicableRate = askRate * (1 + buyMargin);
      marginApplied = buyMargin;
      isSellingToCurrency = true; // We are selling to customer
    }

    // Round to 6 decimal places for precision
    applicableRate = Math.round(applicableRate * 1000000) / 1000000;

    return {
      baseRate,
      bidRate,
      askRate,
      spread: totalSpread,
      spreadPercentage,
      applicableRate,
      isSellingToCurrency,
      transferDirection: transferRequest.direction,
      marginApplied
    };
  }

  /**
   * Legacy method for backward compatibility - now uses display rate
   */
  static calculateExchangeRate(
    fromCurrency: string,
    toCurrency: string,
    rates: ExchangeRateSettings[]
  ): ExchangeRateCalculation | null {
    return this.calculateDisplayRate(fromCurrency, toCurrency, rates);
  }

  static convertAmount(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: ExchangeRateSettings[],
    manualRate?: number,
    transferRequest?: TransferRateRequest
  ): number {
    if (manualRate) {
      return amount * manualRate;
    }

    let calculation: ExchangeRateCalculation | null;
    
    if (transferRequest) {
      calculation = this.calculateTransferRate(fromCurrency, toCurrency, rates, transferRequest);
    } else {
      calculation = this.calculateDisplayRate(fromCurrency, toCurrency, rates);
    }

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

  /**
   * Utility method to verify margin application
   */
  static verifyMarginCalculation(
    bidRate: number,
    askRate: number,
    sellMargin: number = 0.005,
    buyMargin: number = 0.005
  ): { sendRate: number; receiveRate: number } {
    const sendRate = bidRate * (1 - sellMargin);
    const receiveRate = askRate * (1 + buyMargin);
    
    return {
      sendRate: Math.round(sendRate * 1000000) / 1000000,
      receiveRate: Math.round(receiveRate * 1000000) / 1000000
    };
  }
}
