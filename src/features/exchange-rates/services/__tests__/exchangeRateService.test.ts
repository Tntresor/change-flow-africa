import { describe, it, expect } from 'vitest'
import { ExchangeRateService } from '../exchangeRateService'
import { ExchangeRateSettings } from '@/types/rates'

describe('ExchangeRateService', () => {
  const mockRates: ExchangeRateSettings[] = [
    {
      id: '1',
      fromCurrency: 'EUR',
      toCurrency: 'USD',
      baseRate: 1.0850,
      totalSpread: 0.0100,
      bidRate: 1.0800,
      askRate: 1.0900,
      isActive: true,
      lastUpdated: new Date(),
    }
  ]

  describe('calculateDisplayRate', () => {
    it('should calculate mid-market rate for display', () => {
      const result = ExchangeRateService.calculateDisplayRate('EUR', 'USD', mockRates)
      
      expect(result).not.toBeNull()
      expect(result?.applicableRate).toBe(1.0850) // (1.0800 + 1.0900) / 2
      expect(result?.bidRate).toBe(1.0800)
      expect(result?.askRate).toBe(1.0900)
    })
  })

  describe('calculateTransferRate - corrected bid/ask logic', () => {
    it('should use BID rate with sell margin for SEND operations', () => {
      const result = ExchangeRateService.calculateTransferRate('EUR', 'USD', mockRates, {
        direction: 'SEND',
        sellMargin: 0.005 // 0.5%
      })
      
      expect(result).not.toBeNull()
      expect(result?.transferDirection).toBe('SEND')
      expect(result?.isSellingToCurrency).toBe(false) // We buy from customer
      expect(result?.marginApplied).toBe(0.005)
      // Expected: 1.0800 * (1 - 0.005) = 1.0746
      expect(result?.applicableRate).toBe(1.0746)
    })

    it('should use ASK rate with buy margin for RECEIVE operations', () => {
      const result = ExchangeRateService.calculateTransferRate('EUR', 'USD', mockRates, {
        direction: 'RECEIVE',
        buyMargin: 0.005 // 0.5%
      })
      
      expect(result).not.toBeNull()
      expect(result?.transferDirection).toBe('RECEIVE')
      expect(result?.isSellingToCurrency).toBe(true) // We sell to customer
      expect(result?.marginApplied).toBe(0.005)
      // Expected: 1.0900 * (1 + 0.005) = 1.09545
      expect(result?.applicableRate).toBe(1.09545)
    })

    it('should apply default margins when not specified', () => {
      const sendResult = ExchangeRateService.calculateTransferRate('EUR', 'USD', mockRates, {
        direction: 'SEND'
      })
      
      const receiveResult = ExchangeRateService.calculateTransferRate('EUR', 'USD', mockRates, {
        direction: 'RECEIVE'
      })
      
      expect(sendResult?.marginApplied).toBe(0.005) // Default 0.5%
      expect(receiveResult?.marginApplied).toBe(0.005) // Default 0.5%
    })
  })

  describe('verifyMarginCalculation - verification example', () => {
    it('should match the provided verification example', () => {
      // Using example: bid = 0.833000, ask = 0.834000, margins = 0.5%
      const result = ExchangeRateService.verifyMarginCalculation(
        0.833000, // bid
        0.834000, // ask
        0.005,    // sellMargin (0.5%)
        0.005     // buyMargin (0.5%)
      )
      
      expect(result.sendRate).toBe(0.828835)   // 0.833000 * (1 - 0.005)
      expect(result.receiveRate).toBe(0.838170) // 0.834000 * (1 + 0.005)
    })
  })

  describe('convertAmount with transfer direction', () => {
    it('should convert correctly for SEND operations', () => {
      const result = ExchangeRateService.convertAmount(
        100, 
        'EUR', 
        'USD', 
        mockRates, 
        undefined, 
        { direction: 'SEND', sellMargin: 0.005 }
      )
      
      // 100 * 1.0746 = 107.46
      expect(result).toBe(107.46)
    })

    it('should convert correctly for RECEIVE operations', () => {
      const result = ExchangeRateService.convertAmount(
        100, 
        'EUR', 
        'USD', 
        mockRates, 
        undefined, 
        { direction: 'RECEIVE', buyMargin: 0.005 }
      )
      
      // 100 * 1.09545 = 109.545
      expect(result).toBe(109.545)
    })
  })

  describe('getExchangeRateForPair', () => {
    it('should return the correct exchange rate for a valid pair', () => {
      const result = ExchangeRateService.getExchangeRateForPair('EUR', 'USD', mockRates)
      expect(result).not.toBeNull()
      expect(result?.fromCurrency).toBe('EUR')
      expect(result?.toCurrency).toBe('USD')
    })

    it('should return null for an invalid pair', () => {
      const result = ExchangeRateService.getExchangeRateForPair('EUR', 'GBP', mockRates)
      expect(result).toBeNull()
    })
  })

  describe('calculateExchangeRate', () => {
    it('should calculate correct exchange rate with spread', () => {
      const result = ExchangeRateService.calculateExchangeRate('EUR', 'USD', mockRates)
      
      expect(result).not.toBeNull()
      expect(result?.baseRate).toBe(1.0850)
      expect(result?.bidRate).toBe(1.0800)
      expect(result?.askRate).toBe(1.0900)
      expect(result?.spread).toBe(0.0100)
      expect(result?.applicableRate).toBe(1.0900) // Ask rate for selling to customer
      expect(result?.isSellingToCurrency).toBe(true)
    })

    it('should return null for invalid currency pair', () => {
      const result = ExchangeRateService.calculateExchangeRate('EUR', 'GBP', mockRates)
      expect(result).toBeNull()
    })
  })

  describe('convertAmount', () => {
    it('should convert amount using ask rate', () => {
      const result = ExchangeRateService.convertAmount(100, 'EUR', 'USD', mockRates)
      expect(result).toBe(109) // 100 * 1.0900 (ask rate)
    })

    it('should use manual rate when provided', () => {
      const result = ExchangeRateService.convertAmount(100, 'EUR', 'USD', mockRates, 1.1000)
      expect(result).toBe(110)
    })

    it('should return 0 for invalid currency pair', () => {
      const result = ExchangeRateService.convertAmount(100, 'EUR', 'GBP', mockRates)
      expect(result).toBe(0)
    })
  })

  describe('createExchangeRateSettings', () => {
    it('should create correct exchange rate settings', () => {
      const result = ExchangeRateService.createExchangeRateSettings('EUR', 'GBP', 0.8500, 0.0080)
      
      expect(result.fromCurrency).toBe('EUR')
      expect(result.toCurrency).toBe('GBP')
      expect(result.baseRate).toBe(0.8500)
      expect(result.totalSpread).toBe(0.0080)
      expect(result.bidRate).toBe(0.8460) // 0.8500 - 0.0040
      expect(result.askRate).toBe(0.8540) // 0.8500 + 0.0040
      expect(result.isActive).toBe(true)
    })
  })
})
