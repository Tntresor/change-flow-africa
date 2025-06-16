
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
    },
    {
      id: '2',
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      baseRate: 0.9200,
      totalSpread: 0.0090,
      bidRate: 0.9155,
      askRate: 0.9245,
      isActive: true,
      lastUpdated: new Date(),
    }
  ]

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
